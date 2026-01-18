import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { AlertTriangle, Activity } from 'lucide-react';

const MedicalHistory = ({ patientId, history = [] }) => {
  const queryClient = useQueryClient();
  const [newHistory, setNewHistory] = useState('');

  const mutation = useMutation({
    mutationFn: (desc) => api.post(`/patients/${patientId}/history`, { description: desc }),
    onSuccess: () => {
      toast.success('Note Added');
      setNewHistory('');
      queryClient.invalidateQueries(['patient']);
    },
    onError: () => toast.error('Failed to add note')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newHistory.trim()) mutation.mutate(newHistory);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* INPUT */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h4 className="font-semibold text-gray-700 mb-3">Add to Medical Record</h4>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input 
            type="text" 
            placeholder="e.g. Diabetic Type 2, Penicillin Allergy..." 
            className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={newHistory}
            onChange={(e) => setNewHistory(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={mutation.isPending || !newHistory.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {mutation.isPending ? 'Adding...' : 'Add Note'}
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h4 className="font-semibold text-gray-700">Patient History Log</h4>
        </div>
        
        {!history || history.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Activity className="mx-auto w-10 h-10 mb-2 opacity-20"/>
            <p>No medical history recorded.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 max-h-100 overflow-y-auto">
            {history.slice().reverse().map((item, idx) => (
              <li key={idx} className="p-4 hover:bg-gray-50 flex gap-3 group transition-colors">
                <AlertTriangle size={18} className="text-orange-500 mt-0.5 shrink-0"/>
                <div>
                  <p className="text-gray-800 font-medium">{item.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Recorded on {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;