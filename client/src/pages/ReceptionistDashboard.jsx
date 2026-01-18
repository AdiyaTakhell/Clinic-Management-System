import { useState } from 'react';
import { useQuery } from '@tanstack/react-query'; // 👈 Import React Query
import api from '../api/axios'; // 👈 Import API
import RegisterPatient from '../components/receptionist/RegisterPatient';
import BookAppointment from '../components/receptionist/BookAppointment';
import BillingManager from '../components/receptionist/BillingManager';
import { UserPlus, CalendarPlus, Receipt } from 'lucide-react';

const ReceptionistDashboard = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [newlyRegisteredPatient, setNewlyRegisteredPatient] = useState(null);

  // 1. FETCH APPOINTMENTS (To get the notification count)
  // React Query will cache this, so it won't clash with BillingManager's fetch
  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => (await api.get('/appointments/today')).data,
    refetchInterval: 5000, // Check for new Completed visits every 5 seconds
  });

  // 2. CALCULATE PENDING BILLS
  const pendingCount = appointments.filter(app => app.status === 'Completed').length;

  // Auto-switch to booking after registration
  const handleRegistrationSuccess = (patient) => {
    setNewlyRegisteredPatient(patient);
    setActiveTab('book');
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reception Desk</h1>
          <p className="text-gray-500 text-sm">Manage patients, appointments, and billing.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex overflow-hidden">
         
         {/* Register Tab */}
         <button 
            onClick={() => setActiveTab('register')} 
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium rounded-lg transition-all ${activeTab === 'register' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500'}`}
         >
            <UserPlus size={18}/> Register
         </button>

         {/* Book Tab */}
         <button 
            onClick={() => setActiveTab('book')} 
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium rounded-lg transition-all ${activeTab === 'book' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500'}`}
         >
            <CalendarPlus size={18}/> Book
         </button>

         {/* Billing Tab (WITH BADGE) */}
         <button 
            onClick={() => setActiveTab('billing')} 
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium rounded-lg transition-all ${activeTab === 'billing' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500'}`}
         >
            <Receipt size={18}/> 
            Billing
            
            {/* 🔴 NOTIFICATION BADGE */}
            {pendingCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                    {pendingCount}
                </span>
            )}
         </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 min-h-125">
        {activeTab === 'register' && <RegisterPatient onSuccess={handleRegistrationSuccess} />}
        {activeTab === 'book' && <BookAppointment preSelectedPatient={newlyRegisteredPatient} onClearPatient={() => setNewlyRegisteredPatient(null)} />}
        {activeTab === 'billing' && <BillingManager />}
      </div>
    </div>
  );
};

export default ReceptionistDashboard;