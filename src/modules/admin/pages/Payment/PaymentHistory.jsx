import { useEffect, useState } from 'react';
import moment from 'moment'; // Make sure to install it using: npm install moment
import { getService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../components/ui/table/index';
import { FaEye } from 'react-icons/fa';

function PaymentHistory() {
  const [paymentSummary, setPaymentSummary] = useState([]);

  const navigate = useNavigate()
  useEffect(() => {
    getClassList();
  }, []);

  const getClassList = async () => {
    try {
      const result = await getService(apiName.getPayHistory);
      setPaymentSummary(result.data);
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
          <Table className="w-full text-left border-collapse">
            <TableHeader className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
              <TableRow className="text-sm text-gray-600 dark:text-gray-300 border-b dark:border-gray-700">
                <th className="px-5 py-3">Receipt No.</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Action</th>
              </TableRow>
            </TableHeader>
            <TableBody className="text-sm divide-y divide-gray-100 dark:divide-gray-800">
              {paymentSummary.map((item, index) => (
                <TableRow key={index} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <TableCell className="px-5 py-4 font-medium text-indigo-600 dark:text-indigo-400">
                    #{item.receipt_no}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    {moment(item.date).format('DD-MMM-YYYY')}
                  </TableCell>
                  <TableCell className="px-5 py-4">₹{item.amountPaid}</TableCell>
                  <TableCell className="px-5 py-4">{item.paymentMethod}</TableCell>
                  <TableCell className="px-5 py-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      Paid
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <button onClick={() => {
                      navigate(`/fee-receipt/${item._id}`);
                    }}>
                      <FaEye className='text-gray-700 dark:text-white hover:text-red-500 dark:hover:text-red-400' />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default PaymentHistory;
