import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { User, Phone, MapPin, Calendar, UserPlus } from 'lucide-react';

const RegisterPatient = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: '', age: '', gender: 'Male', contact: '', address: '' });

  const mutation = useMutation({
    mutationFn: (data) => api.post('/patients', data),
    onSuccess: (res) => {
      toast.success(`Registered: ${res.data.name}`);
      setForm({ name: '', age: '', gender: 'Male', contact: '', address: '' }); // Reset
      if (onSuccess) onSuccess(res.data);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.age < 0 || form.age > 120) return toast.error("Please enter a valid age");
    mutation.mutate(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b pb-3">
        <h3 className="text-lg font-semibold text-gray-700">New Patient Registration</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2 relative">
          <User className="absolute left-3 top-3 text-gray-400" size={18}/>
          <input required placeholder="Full Name" className="w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        </div>
        
        {/* --- AGE INPUT (VALIDATED) --- */}
        <div className="relative">
          <Calendar className="absolute left-3 top-3 text-gray-400" size={18}/>
          <input 
            required 
            type="number" 
            min="0" 
            max="120"
            placeholder="Age" 
            className="w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            value={form.age} 
            // 1. Block invalid keys
            onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
            // 2. Sanitize value (prevent paste of negatives)
            onChange={e => {
                const val = e.target.value;
                if (val < 0) return; // Ignore negatives
                setForm({...form, age: val}) 
            }}
          />
        </div>

        <select className="p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
          value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
          <option>Male</option><option>Female</option><option>Other</option>
        </select>

        <div className="md:col-span-2 relative">
          <Phone className="absolute left-3 top-3 text-gray-400" size={18}/>
          <input required type="tel" placeholder="Phone Number" className="w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} />
        </div>

        <div className="md:col-span-2 relative">
           <MapPin className="absolute left-3 top-3 text-gray-400" size={18}/>
           <textarea required rows="2" placeholder="Address" className="w-full pl-10 p-2.5 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none" 
             value={form.address} onChange={e => setForm({...form, address: e.target.value})}></textarea>
        </div>
      </div>

      <button type="submit" disabled={mutation.isPending} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-all flex justify-center items-center gap-2">
        {mutation.isPending ? 'Saving...' : <><UserPlus size={20}/> Register Patient</>}
      </button>
    </form>
  );
};
export default RegisterPatient;