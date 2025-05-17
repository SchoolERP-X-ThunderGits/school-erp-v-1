import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../components/ui/table/index';
import apiName from '../../../../constants/ApiName';
import { getService, postService } from '../../../../constants/Service';
import { showToast } from '../../../../components/Toast';
import moment from 'moment';
import { Modal } from '../../../../components/ui/modal';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../../components/ui/button/Button';
import Checkbox from '../../../../components/form/input/Checkbox';
import { REACT_APP_RAZORPAY_KEY } from '../../../../constants/Config';

const PaymentSummary = () => {
  const [data, setData] = useState();
  const [payModal, setPayModal] = useState(false);
  const [feeDetails, setFeeDetails] = useState(null);
  const [selectedFees, setSelectedFees] = useState([]);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const student = JSON.parse(localStorage.getItem("studentData"));

  useEffect(() => {
    getDashboardData();
    fetchStudentFees();
  }, []);

  const getDashboardData = async () => {
    try {
      const result = await getService(`${apiName.studentDashboard}/${student?._id}`);
      setData(result);
    } catch (error) {
      showToast('Error fetching students data', 'error');
    }
  };

  const fetchStudentFees = async () => {
    try {
      const fees = await getService(`${apiName.getFeeByStudentId}/${student?._id}`);
      setFeeDetails(fees);
    } catch (error) {
      showToast('Error fetching student details', 'error');
    }
  };

  const isFeePaid = (feeType) => {
    return feeDetails?.payments?.some(payment =>
      payment.feePaid.some(feePaid =>
        feePaid.feeType === feeType && ((feePaid.paidAmount > 0) || (feePaid.amount > 0))
      )
    );
  };

  const handleFeeSelection = (feeGroup) => {
    if (isFeePaid(feeGroup.feeType)) return;

    if (!isSelected(feeGroup)) {
      setSelectedFees(prev => [...prev, feeGroup]);
    } else {
      setSelectedFees(prev => prev.filter(fee => fee._id !== feeGroup._id));
    }
  };

  const isSelected = (feeGroup) => {
    return selectedFees.some(fee => fee._id === feeGroup._id);
  };

  const handleMasterCheckboxChange = (event) => {
    if (event) {
      const unpaidFeeGroups = feeDetails.feeStructures.reduce((acc, feeStructure) => {
        return [
          ...acc,
          ...feeStructure.feeGroups.filter(feeGroup => !isFeePaid(feeGroup.feeType))
        ];
      }, []);
      setSelectedFees(unpaidFeeGroups);
    } else {
      setSelectedFees([]);
    }
  };

  const setStatusForFeeGroups = (feeType, dueDat, payments) => {
    const paymentForFeeType = payments.find(payment =>
      payment.feePaid.some(feePaid => feePaid.feeType === feeType)
    );

    const currentDate = new Date();
    const dueDate = new Date(dueDat);

    if (!paymentForFeeType) {
      if (currentDate > dueDate) {
        return <span className="text-red-500">Overdue</span>;
      } else {
        return <span className="text-yellow-500">Due</span>;
      }
    } else {
      return <span className="text-green-500">Paid</span>;
    }
  };

  const handleCollectFee = async (e) => {
    e.preventDefault();

    const feesData = selectedFees.map((fee) => ({
      feeType: fee.feeType,
      amount: fee.amount
    }));

    const amount = selectedFees.reduce((total, fee) => total + fee.amount, 0);

    const orderBody = {
      amountPaid: amount,
      studentId: student._id,
      paymentMethod: "online",
      feePaid: feesData
    };

    try {
      const orderRes = await postService(apiName.createRazorpayOrder, orderBody);

      // if (!orderRes?.data?.id) {
      //   return showToast("Failed to create order", "error");
      // }
console.log('process.env.REACT_APP_RAZORPAY_KEY',orderRes.data.id)
      const options = {
        key: REACT_APP_RAZORPAY_KEY,
        amount: amount, // in paise
        currency: "INR",
        name: "Your School Name",
        description: "Fee Payment",
        order_id: orderRes.data.id,
        handler: async function (response) {
          const verifyBody = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            studentId: student._id
          };

          try {
            const verifyRes = await postService(apiName.verifyRazorpayPayment, verifyBody);

            if (verifyRes?.success) {
              showToast("Payment verified successfully!", "success");
              setPayModal(false);
              fetchStudentFees();
              getDashboardData();
            } else {
              showToast("Payment verification failed!", "error");
            }
          } catch (err) {
            console.error(err);
            showToast("Verification error", "error");
          }
        },
        prefill: {
          name: student.name || "Student",
          email: student.email || "student@example.com",
          contact: student.phone || "9999999999"
        },
        theme: {
          color: "#4F46E5"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      showToast("Error during Razorpay flow", "error");
    }
  };


  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">Payment Summary</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 md:p-6 shadow">
            <p className="text-sm text-gray-600 dark:text-gray-300">Total Fees</p>
            <h3 className="text-2xl font-bold text-indigo-700 dark:text-white">₹{data?.feeSummary?.totalFees || 0}</h3>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 md:p-6 shadow">
            <p className="text-sm text-gray-600 dark:text-gray-300">Paid</p>
            <h3 className="text-2xl font-bold text-indigo-700 dark:text-white">₹{data?.feeSummary?.totalPaid || 0}</h3>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 md:p-6 shadow">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Due</p>
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">₹{data?.feeSummary?.totalDue || 0}</h3>
            </div>
            <button
              onClick={() => setPayModal(true)}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Pay Now
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition shadow">
            Download Receipt
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Payment History</h2>
          {data?.feeSummary?.paymentHistory.length == 0 ?
            <div>
              <p className='text-center'>No history found</p>
            </div>
            :
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
              <Table className="w-full text-left border-collapse">
                <TableHeader className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                  <TableRow className="text-sm text-gray-600 dark:text-gray-300 border-b dark:border-gray-700">
                    <th className="px-5 py-3">Receipt No.</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Method</th>
                    <th className="px-5 py-3">Status</th>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-sm divide-y divide-gray-100 dark:divide-gray-800">
                  {data?.feeSummary?.paymentHistory?.map((item, index) => (
                    <TableRow key={index} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <TableCell className="px-5 py-4 font-medium text-indigo-600 dark:text-indigo-400">
                        #{item.receipt_no}
                      </TableCell>
                      <TableCell className="px-5 py-4">{moment(item.date).format("DD-MMM-YYYY").toLowerCase()}</TableCell>
                      <TableCell className="px-5 py-4">₹{item.amountPaid}</TableCell>
                      <TableCell className="px-5 py-4">{item.paymentMethod}</TableCell>
                      <TableCell className="px-5 py-4">
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                          Paid
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>}
        </div>

        <Modal isOpen={payModal} onClose={() => {
          setPayModal(false);
          setErrorMessage('');
        }} className="max-w-[700px] m-4">
          <div className="no-scrollbar relative w-full max-w-[700px] h-[80vh] overflow-hidden rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div className='w-full p-4 flex justify-between items-center'>
              <div className='text-3xl font-medium text-gray-800 dark:text-gray-200'>Fee Info</div>
              {selectedFees.length > 0 && (
                <Button onClick={(e) => handleCollectFee(e)}>
                  <Link>Collect Fee</Link>
                </Button>
              )}
            </div>

            <div className="overflow-y-auto h-[calc(80vh-100px)] pr-2">
              {feeDetails?.feeStructures?.length > 0 ? (
                <Table className="w-full min-w-[800px] text-left border-collapse">
                  <TableHeader className='bg-gray-100 dark:bg-gray-800'>
                    <TableRow>
                      <th className='px-5 py-3'>
                        <Checkbox
                          checked={feeDetails.feeStructures.every(feeStructure =>
                            feeStructure.feeGroups.every(feeGroup =>
                              !isFeePaid(feeGroup.feeType) && isSelected(feeGroup)
                            )
                          )}
                          onChange={handleMasterCheckboxChange}
                        />
                      </th>
                      {['Fees Structure', 'Fees Type', 'Due Date', 'Amount', 'Status', 'Discount', 'Fine'].map(header => (
                        <th key={header} className="px-5 py-3">{header}</th>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feeDetails.feeStructures.map((feeStructure) =>
                      feeStructure.feeGroups
                        .filter((feeGroup) => !isFeePaid(feeGroup.feeType))
                        .map((feeGroup) => (
                          <TableRow key={feeGroup._id}>
                            <TableCell className="px-5 py-4">
                              <Checkbox
                                checked={isSelected(feeGroup)}
                                onChange={() => handleFeeSelection(feeGroup)}
                              />
                            </TableCell>
                            <TableCell className="px-5 py-4">{feeStructure.name}</TableCell>
                            <TableCell className="px-5 py-4">{feeGroup.feeType}</TableCell>
                            <TableCell className="px-5 py-4">{new Date(feeGroup.dueDate).toLocaleDateString()}</TableCell>
                            <TableCell className="px-5 py-4">₹{feeGroup.amount}</TableCell>
                            <TableCell className="px-5 py-4">
                              {setStatusForFeeGroups(feeGroup.feeType, feeGroup.dueDate, feeDetails.payments)}
                            </TableCell>
                            <TableCell className="px-5 py-4">₹0</TableCell>
                            <TableCell className="px-5 py-4">₹0</TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-gray-600 dark:text-gray-300 py-6">
                  No fees found
                </div>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PaymentSummary;
