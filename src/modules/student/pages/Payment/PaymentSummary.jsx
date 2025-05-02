import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../components/ui/table/index';
const PaymentSummary = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">Payment Summary</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Fees */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 md:p-6 shadow">
            <p className="text-sm text-gray-600 dark:text-gray-300">Total Fees</p>
            <h3 className="text-2xl font-bold text-indigo-700 dark:text-white">₹50,000</h3>
          </div>

          {/* Paid */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 md:p-6 shadow">
            <p className="text-sm text-gray-600 dark:text-gray-300">Paid</p>
            <h3 className="text-2xl font-bold text-indigo-700 dark:text-white">₹40,000</h3>
          </div>

          {/* Due + Pay Now */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 md:p-6 shadow">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Due</p>
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">₹10,000</h3>
            </div>
            <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">Pay Now</button>
          </div>
        </div>
        
         {/* CTA Section */}
         <div className="flex justify-end">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition shadow">
            Download Receipt
          </button>
        </div>

        {/* Payment History Table */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Payment History</h2>
          <div className="overflow-x-auto">
            <Table className="w-full text-left border-collapse">
              <TableHeader className='bg-gray-100 dark:bg-gray-800'>
                <TableRow className="text-sm text-gray-600 dark:text-gray-300 border-b dark:border-gray-700">
                  <th className="px-5 py-3 font-medium text-gray-500 text-base text-left dark:text-gray-400">Date</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-base text-left dark:text-gray-400">Amount</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-base text-left dark:text-gray-400">Method</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-base text-left dark:text-gray-400">Status</th>
                </TableRow>
              </TableHeader>
              <TableBody className="text-sm text-gray-700 dark:text-gray-200 divide-y divide-gray-100 dark:divide-gray-700">
                <TableRow className='border-gray-200 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800'>
                  <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">01-Apr-2025</TableCell>
                  <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">₹20,000</TableCell>
                  <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">UPI</TableCell>
                  <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">Paid</TableCell>
                </TableRow>
                <TableRow className='border-gray-200 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800'>
                  <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">01-Mar-2025</TableCell>
                  <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">₹20,000</TableCell>
                  <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">Net Banking</TableCell>
                  <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">Paid</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default PaymentSummary;
