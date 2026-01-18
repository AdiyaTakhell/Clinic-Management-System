import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useReactToPrint } from 'react-to-print';
import api from '../api/axios';
import { Stethoscope, History, CheckCircle, Printer, AlertTriangle } from 'lucide-react';

// Components
import PatientQueue from '../components/doctor/PatientQueue';
import PrescriptionForm from '../components/doctor/PrescriptionForm';
import MedicalHistory from '../components/doctor/MedicalHistory';
import PrintPrescription from '../components/PrintPrescription';

const DoctorDashboard = () => {
  const printRef = useRef();
  
  // UI State
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState('rx');
  const [printData, setPrintData] = useState(null); // Holds data for printing

  // 1. Fetch Queue
  const { data: appointments = [], isLoading: loadingQueue } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => (await api.get('/appointments/today')).data,
    refetchInterval: 5000, 
  });

  // 2. Fetch Patient Details (History)
  const { data: patientDetails } = useQuery({
    queryKey: ['patient', selectedAppointment?.patientId?._id],
    queryFn: async () => (await api.get(`/patients/${selectedAppointment.patientId._id}`)).data,
    enabled: !!selectedAppointment, 
  });

  // 3. Print Handler
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Rx_${printData?.appointment?.patientId?.name}`,
  });

  const activeQueue = appointments.filter(app => ['Pending', 'In-Progress'].includes(app.status));

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6 p-4 max-w-7xl mx-auto">
      
      {/* LEFT SIDEBAR */}
      <PatientQueue 
        queue={activeQueue} 
        selectedId={selectedAppointment?._id} 
        onSelect={(app) => { setSelectedAppointment(app); setActiveTab('rx'); }} 
      />

      {/* RIGHT WORKSPACE */}
      <div className="w-full md:w-2/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden h-full">
        {selectedAppointment ? (
          <>
            {/* HEADER */}
            <div className="p-6 border-b border-gray-100 bg-blue-50 shrink-0">
               <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedAppointment.patientId?.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedAppointment.patientId?.age} Years • {selectedAppointment.patientId?.gender}
                    </p>
                    {/* Quick Badges */}
                    {patientDetails?.medicalHistory?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                          {patientDetails.medicalHistory.slice(0, 3).map((h, i) => (
                              <span key={i} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <AlertTriangle size={10}/> {h.description}
                              </span>
                          ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Token</p>
                    <p className="text-3xl font-bold text-blue-600">#{selectedAppointment.tokenNumber}</p>
                  </div>
               </div>
            </div>

            {/* TABS */}
            <div className="flex border-b border-gray-200 shrink-0">
               <button onClick={() => setActiveTab('rx')} 
                 className={`flex-1 py-3 font-medium text-sm flex justify-center gap-2 transition-colors ${activeTab === 'rx' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}>
                 <Stethoscope size={18}/> Prescription
               </button>
               <button onClick={() => setActiveTab('history')} 
                 className={`flex-1 py-3 font-medium text-sm flex justify-center gap-2 transition-colors ${activeTab === 'history' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}>
                 <History size={18}/> History
               </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
               {activeTab === 'rx' && (
                 <PrescriptionForm 
                   appointment={selectedAppointment} 
                   onSuccess={(data) => {
                      setPrintData(data); // Opens Success Modal
                      setSelectedAppointment(null); // Clear selection
                   }} 
                 />
               )}
               {activeTab === 'history' && (
                 <MedicalHistory 
                   patientId={selectedAppointment.patientId._id}
                   history={patientDetails?.medicalHistory} 
                 />
               )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
            <Stethoscope size={64} className="mb-4 opacity-20"/>
            <h3 className="text-xl font-semibold">Ready to Consult</h3>
            <p>Select a patient from the queue to start.</p>
          </div>
        )}
      </div>

      {/* --- SUCCESS & PRINT MODAL --- */}
      {printData && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 text-center space-y-6 animate-in zoom-in duration-200">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                 <CheckCircle size={32} />
              </div>
              <div>
                 <h2 className="text-2xl font-bold text-gray-800">Visit Completed!</h2>
                 <p className="text-gray-500 mt-1">Prescription saved successfully.</p>
              </div>
              <div className="flex gap-4 justify-center">
                 <button onClick={() => setPrintData(null)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Close</button>
                 <button onClick={handlePrint} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg">
                    <Printer size={18}/> Print Rx
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* --- HIDDEN PRINT COMPONENT --- */}
      <div style={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
         <PrintPrescription ref={printRef} data={printData} />
      </div>

    </div>
  );
};

export default DoctorDashboard;