import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Trash2, FileText, CheckCircle } from 'lucide-react';

const PrescriptionForm = ({ appointment, onSuccess }) => {
  const queryClient = useQueryClient();
  
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', frequency: '', duration: '', instruction: '' }
  ]);
  const [notes, setNotes] = useState('');

  // MUTATION
  const mutation = useMutation({
    mutationFn: (data) => api.post('/prescriptions', data),
    onSuccess: () => {
      toast.success('Prescription Saved!');
      queryClient.invalidateQueries(['appointments']);
      // Trigger parent callback to open print modal
      onSuccess({ appointment, medicines, notes });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save')
  });

  // HELPERS
  const addRow = () => setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '', instruction: '' }]);
  const removeRow = (index) => setMedicines(medicines.filter((_, i) => i !== index));
  const handleChange = (index, field, val) => {
    const list = [...medicines];
    list[index][field] = val;
    setMedicines(list);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ appointmentId: appointment._id, medicines, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
      
      {/* MEDICINES SECTION */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-700">Medicines</h4>
          <button type="button" onClick={addRow} className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline">
            <Plus size={16}/> Add New
          </button>
        </div>

        <div className="space-y-3">
          {medicines.map((med, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-2 items-start p-3 rounded-lg border bg-gray-50">
              <div className="flex-1 grid grid-cols-2 md:grid-cols-12 gap-2 w-full">
                <input placeholder="Name (e.g. Paracetamol)" className="col-span-2 md:col-span-4 p-2 border rounded text-sm outline-blue-500" 
                  value={med.name} onChange={(e) => handleChange(index, 'name', e.target.value)} required />
                
                <input placeholder="Dose (500mg)" className="col-span-1 md:col-span-2 p-2 border rounded text-sm outline-blue-500" 
                  value={med.dosage} onChange={(e) => handleChange(index, 'dosage', e.target.value)} required />
                
                <input placeholder="Freq (1-0-1)" className="col-span-1 md:col-span-2 p-2 border rounded text-sm outline-blue-500" 
                  value={med.frequency} onChange={(e) => handleChange(index, 'frequency', e.target.value)} required />
                
                <input placeholder="Days (5)" className="col-span-1 md:col-span-2 p-2 border rounded text-sm outline-blue-500" 
                  value={med.duration} onChange={(e) => handleChange(index, 'duration', e.target.value)} required />
                
                <input placeholder="Instruction (After Food)" className="col-span-1 md:col-span-2 p-2 border rounded text-sm outline-blue-500" 
                  value={med.instruction} onChange={(e) => handleChange(index, 'instruction', e.target.value)} />
              </div>
              
              {medicines.length > 1 && (
                <button type="button" onClick={() => removeRow(index)} className="text-red-400 p-2 hover:bg-red-50 rounded">
                  <Trash2 size={16}/>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* NOTES SECTION */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <FileText size={16}/> Clinical Notes
        </h4>
        <textarea 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none text-sm"
          placeholder="Diagnosis, symptoms, or advice..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="p-4 border-t border-gray-200 bg-white flex justify-end gap-3 sticky bottom-0">
        <button 
          type="submit" 
          disabled={mutation.isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 text-sm disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
        >
          {mutation.isPending ? 'Saving...' : 'Complete & Print'} 
          <CheckCircle size={16}/>
        </button>
      </div>
    </form>
  );
};

export default PrescriptionForm;