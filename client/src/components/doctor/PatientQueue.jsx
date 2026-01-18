import React from 'react';
import { Activity, CheckCircle, User, Clock } from 'lucide-react';

const PatientQueue = ({ queue, selectedId, onSelect }) => {
  return (
    <div className="w-full md:w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full animate-in slide-in-from-left duration-500">
      
      {/* HEADER */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
        <h2 className="font-bold text-gray-700 flex items-center gap-2">
          <Activity className="text-blue-500" size={20}/> Patient Queue
        </h2>
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">
          {queue.length} Waiting
        </span>
      </div>
      
      {/* LIST */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin">
        {queue.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <CheckCircle className="mx-auto mb-2 w-10 h-10 opacity-50"/>
            <p>All caught up! No patients.</p>
          </div>
        ) : (
          queue.map(app => (
            <div 
              key={app._id} 
              onClick={() => onSelect(app)}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                selectedId === app._id 
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-lg text-gray-800">Token #{app.tokenNumber}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  app.status === 'In-Progress' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {app.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <User size={16}/> {app.patientId?.name}
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                 <span>{app.patientId?.gender}, {app.patientId?.age} yrs</span>
                 <span className="flex items-center gap-1">
                   <Clock size={12}/> {new Date(app.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientQueue;