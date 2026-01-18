import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useReactToPrint } from 'react-to-print';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import PrintInvoice from '../PrintInvoice';
import { Receipt, DollarSign, Printer, CheckCircle, X } from 'lucide-react';

const BillingManager = () => {
  const queryClient = useQueryClient();
  const printRef = useRef();
  
  const [selectedBill, setSelectedBill] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [printData, setPrintData] = useState(null); 

  // 1. Fetch Completed Appointments
  const { data: list = [] } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => (await api.get('/appointments/today')).data,
    refetchInterval: 5000
  });

  const pendingBills = list.filter(app => app.status === 'Completed');

  // 2. Setup Print Handler
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice_${printData?._id}`,
  });

  // 3. Create Invoice Mutation
  const mutation = useMutation({
    mutationFn: (data) => api.post('/invoices', data),
    onSuccess: (res) => {
      toast.success('Payment Recorded!');
      setPrintData({ ...res.data, patientId: selectedBill.patientId, appointmentId: selectedBill });
      setSelectedBill(null);
      setAmount('');
      queryClient.invalidateQueries(['appointments']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error')
  });

  const handlePaymentSubmit = () => {
    if (!amount || Number(amount) <= 0) {
        return toast.error("Amount must be greater than 0");
    }
    mutation.mutate({ appointmentId: selectedBill._id, totalAmount: amount, paymentMethod, status: 'Paid' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h3 className="text-lg font-semibold text-gray-700 border-b pb-3">Pending Invoices</h3>
      
      {pendingBills.length === 0 ? (
         <div className="text-center py-10 text-gray-400">
           <Receipt className="mx-auto mb-2 opacity-50" size={40}/>
           <p>No pending bills.</p>
         </div>
      ) : (
         <div className="grid gap-4">
           {pendingBills.map(app => (
             <div key={app._id} className="p-4 border rounded-lg flex justify-between items-center hover:shadow-md transition-shadow bg-white">
               <div>
                 <p className="font-bold text-gray-800">{app.patientId?.name}</p>
                 <p className="text-sm text-gray-500">Dr. {app.doctorId?.name} • Token #{app.tokenNumber}</p>
               </div>
               <button onClick={() => setSelectedBill(app)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex gap-2 items-center text-sm font-medium">
                 <DollarSign size={16}/> Create Bill
               </button>
             </div>
           ))}
         </div>
      )}

      {/* --- PAYMENT MODAL --- */}
      {selectedBill && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in duration-200">
             <div className="flex justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2"><Receipt className="text-green-600"/> Generate Invoice</h3>
                <button onClick={() => setSelectedBill(null)} className="text-gray-400 hover:text-red-500"><X/></button>
             </div>
             
             <div className="bg-gray-50 p-4 rounded-lg text-sm">
                <p><strong>Patient:</strong> {selectedBill.patientId?.name}</p>
             </div>

             {/* --- AMOUNT INPUT (VALIDATED) --- */}
             <div>
               <label className="text-sm font-bold text-gray-700 block mb-1">Total Amount ($)</label>
               <input 
                  type="number" 
                  autoFocus 
                  min="1"
                  className="w-full p-3 border rounded-lg text-lg outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00" 
                  value={amount} 
                  // 1. Block invalid keys
                  onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                  // 2. Sanitize Input
                  onChange={e => {
                     const val = e.target.value;
                     if (val < 0) return;
                     setAmount(val);
                  }} 
               />
             </div>

             <div className="grid grid-cols-3 gap-2">
                {['Cash', 'Card', 'UPI'].map(m => (
                   <button key={m} onClick={() => setPaymentMethod(m)}
                     className={`py-2 text-sm rounded border ${paymentMethod === m ? 'bg-green-100 border-green-500 text-green-800 font-bold' : 'hover:bg-gray-50'}`}>
                     {m}
                   </button>
                ))}
             </div>

             <button onClick={handlePaymentSubmit}
               disabled={!amount || mutation.isPending}
               className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50">
               {mutation.isPending ? 'Processing...' : 'Confirm Payment'}
             </button>
          </div>
        </div>
      )}

      {/* --- SUCCESS & PRINT MODAL --- */}
      {printData && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                 <CheckCircle size={32} />
              </div>
              <div>
                 <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
                 <p className="text-gray-500 mt-1">Invoice generated for ${printData.totalAmount}</p>
              </div>
              <div className="flex gap-4 justify-center">
                 <button onClick={() => setPrintData(null)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Close</button>
                 <button onClick={handlePrint} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-lg">
                    <Printer size={18}/> Print Receipt
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* HIDDEN PRINT COMPONENT */}
      <div style={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
         <PrintInvoice ref={printRef} invoice={printData} />
      </div>
    </div>
  );
};
export default BillingManager;