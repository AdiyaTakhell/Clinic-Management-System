import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Search, X, CalendarPlus, User, Phone, Loader2 } from 'lucide-react';

const BookAppointment = ({ preSelectedPatient, onClearPatient }) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctorId, setDoctorId] = useState('');

  // Sync with parent
  useEffect(() => {
    if (preSelectedPatient) {
      setSelectedPatient(preSelectedPatient);
      setSearch('');
    }
  }, [preSelectedPatient]);

  // Search Logic
  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['search', search],
    queryFn: async () => (await api.get(`/patients?keyword=${search}`)).data,
    enabled: search.length > 0 && !selectedPatient, 
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => (await api.get('/users/doctors')).data,
  });

  const mutation = useMutation({
    mutationFn: (data) => api.post('/appointments', data),
    onSuccess: (res) => {
      toast.success(`Token #${res.data.tokenNumber} Generated!`);
      queryClient.invalidateQueries(['appointments']);
      setSelectedPatient(null);
      setDoctorId('');
      setSearch('');
      if(onClearPatient) onClearPatient(); 
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Booking Failed')
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex justify-between items-center border-b pb-3">
        <h3 className="text-lg font-semibold text-gray-700">Book Appointment</h3>
      </div>

      {/* SEARCH / SELECTED PATIENT UI */}
      <div className="relative">
        <label className="text-sm font-medium text-gray-600 mb-1 block">Patient</label>
        
        {selectedPatient ? (
          <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-200 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg">
                {selectedPatient.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-800">{selectedPatient.name}</p>
                <div className="flex gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Phone size={10}/> {selectedPatient.contact}</span>
                    <span>• {selectedPatient.age}y</span>
                </div>
              </div>
            </div>
            <button onClick={() => { setSelectedPatient(null); if(onClearPatient) onClearPatient(); }} className="text-gray-400 hover:text-red-500">
              <X size={20}/>
            </button>
          </div>
        ) : (
          <div className="relative z-50">
             <Search className="absolute left-3 top-3.5 text-gray-400" size={18}/>
             <input type="text" placeholder="Start typing name or phone..." 
               className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
               value={search} onChange={e => setSearch(e.target.value)}
             />
             {isSearching && <Loader2 className="absolute right-3 top-3.5 animate-spin text-indigo-500" size={18}/>}
             
             {search.length > 0 && (
               <div className="absolute w-full bg-white shadow-xl border rounded-lg mt-1 max-h-60 overflow-y-auto">
                 {searchResults.map(p => (
                   <div key={p._id} onClick={() => { setSelectedPatient(p); setSearch(''); }} 
                     className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0 flex justify-between">
                      <span className="font-medium">{p.name}</span>
                      <span className="text-gray-500 text-sm font-mono">{p.contact}</span>
                   </div>
                 ))}
                 {searchResults.length === 0 && !isSearching && <div className="p-3 text-gray-500 text-sm">No patients found.</div>}
               </div>
             )}
          </div>
        )}
      </div>

      {/* DOCTOR SELECT */}
      <div className="z-10 relative">
        <label className="text-sm font-medium text-gray-600 mb-1 block">Doctor</label>
        <select className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
           value={doctorId} onChange={e => setDoctorId(e.target.value)}>
           <option value="">-- Select Doctor --</option>
           {doctors.map(doc => (
             <option key={doc._id} value={doc._id}>Dr. {doc.name} ({doc.specialization})</option>
           ))}
        </select>
      </div>

      <button onClick={() => mutation.mutate({ patientId: selectedPatient?._id, doctorId, type: 'Consultation' })}
        disabled={!selectedPatient || !doctorId || mutation.isPending}
        className="w-full bg-indigo-600 text-white py-3.5 rounded-lg hover:bg-indigo-700 font-bold flex justify-center items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed">
         {mutation.isPending ? 'Processing...' : <><CalendarPlus size={20}/> Generate Token</>}
      </button>
    </div>
  );
};
export default BookAppointment;