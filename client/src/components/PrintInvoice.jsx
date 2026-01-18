import React, { forwardRef } from 'react';

const PrintInvoice = forwardRef(({ invoice }, ref) => {
  if (!invoice) return null;

  return (
    <div ref={ref} className="p-10 bg-white text-black font-sans max-w-2xl mx-auto border border-gray-200">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
        <h1 className="text-4xl font-bold uppercase tracking-wider text-gray-900">MediCare Clinic</h1>
        <p className="text-sm text-gray-600 mt-2">123 Health Street, New York, NY</p>
        <p className="text-sm text-gray-600">Ph: (555) 123-4567 • support@medicare.com</p>
      </div>

      {/* Patient & Invoice Details */}
      <div className="flex justify-between mb-8">
        <div>
          <h3 className="font-bold text-gray-700 uppercase text-sm">Bill To:</h3>
          <p className="text-xl font-semibold mt-1">{invoice.patientId?.name}</p>
          <p className="text-gray-600">{invoice.patientId?.contact}</p>
        </div>
        <div className="text-right">
          <h3 className="font-bold text-gray-700 uppercase text-sm">Invoice Info:</h3>
          <p className="mt-1">Invoice #: <span className="font-mono font-bold">{invoice._id.slice(-6).toUpperCase()}</span></p>
          <p>Date: {new Date().toLocaleDateString()}</p>
          <p>Doctor: {invoice.appointmentId?.doctorId?.name}</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8 border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="text-left p-3 font-bold uppercase text-sm">Service</th>
            <th className="text-right p-3 font-bold uppercase text-sm">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="p-3">Medical Consultation Fee</td>
            <td className="p-3 text-right">${invoice.totalAmount}</td>
          </tr>
        </tbody>
        <tfoot>
            <tr className="bg-gray-50">
                <td className="p-3 font-bold text-right">TOTAL PAID:</td>
                <td className="p-3 text-right font-bold text-xl text-green-700">${invoice.totalAmount}</td>
            </tr>
        </tfoot>
      </table>

      <div className="mt-12 text-center text-xs text-gray-400">
        <p>Computer generated invoice. No signature required.</p>
      </div>
    </div>
  );
});

export default PrintInvoice;