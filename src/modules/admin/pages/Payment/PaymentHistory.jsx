import React, { useEffect, useState } from 'react';
import moment from 'moment'; // Make sure to install it using: npm install moment
import { getService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';

function PaymentHistory() {
  const [paymentSummary, setPaymentSummary] = useState([]);

  useEffect(() => {
    getClassList();
  }, []);

  const getClassList = async () => {
    try {
      const result = await getService(apiName.getPayHistory);
      setPaymentSummary(result);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
      <div className='text-3xl font-medium text-gray-700 dark:text-white my-10'>Payment History</div>

      {paymentSummary.length === 0 ? (
        <p className="text-center">No history found</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
              <tr className="text-sm text-gray-600 dark:text-gray-300 border-b dark:border-gray-700">
                <th className="px-5 py-3">Receipt No.</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-800">
              {paymentSummary.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <td className="px-5 py-4 font-medium text-indigo-600 dark:text-indigo-400">
                    #{item.receipt_no}
                  </td>
                  <td className="px-5 py-4">
                    {moment(item.date).format('DD-MMM-YYYY')}
                  </td>
                  <td className="px-5 py-4">₹{item.amountPaid}</td>
                  <td className="px-5 py-4">{item.paymentMethod}</td>
                  <td className="px-5 py-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      Paid
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PaymentHistory;
