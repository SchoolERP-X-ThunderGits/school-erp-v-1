import React, { useState, useEffect } from 'react';
import { showToast } from '../../../../components/Toast';
import { getService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

// Example static data for dashboard
const dashboardData = {
  students: 14,
  classes: 9,
  sections: 13,
  payments: 4,
  recentTransactions: [
    { admissionNo: '1001', amount: 250, transactionId: 'TXN001', date: '2024-07-15' },
    { admissionNo: '1002', amount: 150, transactionId: 'TXN002', date: '2024-07-16' },
    { admissionNo: '1003', amount: 200, transactionId: 'TXN003', date: '2024-07-17' },
    { admissionNo: '1004', amount: 300, transactionId: 'TXN004', date: '2024-07-18' },
    { admissionNo: '1005', amount: 120, transactionId: 'TXN005', date: '2024-07-19' },
    { admissionNo: '1006', amount: 180, transactionId: 'TXN006', date: '2024-07-20' },
  ],
};

const AdminHome = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [payments, setPayments] = useState(dashboardData.payments);
  const [recentTransactions, setRecentTransactions] = useState(dashboardData.recentTransactions);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState(recentTransactions);

  useEffect(() => {
    fetchStudents();
    getClassList();
  }, []);

  const fetchStudents = async () => {
    try {
      const result = await getService(apiName.getStudent);
      setStudents(result?.length);
    } catch (error) {
      showToast('Error fetching students data', 'error');
    }
  };

  const getClassList = async () => {
    try {
      const result = await getService(apiName.getClassList);
      setClasses(result?.length);
      let totalSections = 0;
      result.forEach((cls) => {
        totalSections += cls.sections.length;
      });
      setSections(totalSections);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterTransactions(value);
  };

  const filterTransactions = (searchText) => {
    if (!searchText) {
      setFilteredTransactions(recentTransactions);
    } else {
      const filtered = recentTransactions.filter(
        (transaction) =>
          transaction.admissionNo.includes(searchText) ||
          transaction.transactionId.includes(searchText)
      );
      setFilteredTransactions(filtered);
    }
  };

  // Chart Data for Students, Classes, and Fee Dues
  const chartData = {
    labels: ['Students', 'Classes', 'Fee Dues'],
    datasets: [
      {
        label: 'Counts/Amounts',
        data: [students, classes, payments],
        backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'],
        borderColor: ['#4CAF50', '#FF9800', '#2196F3'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-gray-700 text-lg font-semibold">Total Students</h3>
          <p className="text-2xl font-bold text-gray-800">{students}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-gray-700 text-lg font-semibold">Total Classes</h3>
          <p className="text-2xl font-bold text-gray-800">{classes}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-gray-700 text-lg font-semibold">Total Sections</h3>
          <p className="text-2xl font-bold text-gray-800">{sections}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-gray-700 text-lg font-semibold">Total Payments</h3>
          <p className="text-2xl font-bold text-gray-800">{payments}</p>
        </div>
      </div>

      {/* Chart for Students, Classes, and Fee Dues */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Students, Classes, and Fee Dues</h2>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <input
          type="text"
          placeholder="Search by Admission No. or Transaction ID"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full max-w-xl p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Admission No.</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Transaction Id</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-800">{transaction.admissionNo}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{transaction.amount}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{transaction.transactionId}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{transaction.date}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    <button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
