import React, { useState, useEffect } from 'react';
import { showToast } from '../../../../components/Toast';
import { getService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import Loader from '../../../../components/Loader';
import { PiStudentFill } from "react-icons/pi";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { BsFillSignIntersectionFill } from "react-icons/bs";
import { MdPayment } from "react-icons/md";
import Chart from "react-apexcharts";
import { fetchSubscriptionStatus } from '../../../../redux/slices/subscriptionSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

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
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [payments, setPayments] = useState(dashboardData.payments);
  const dispatch = useDispatch();
  const [recentTransactions, setRecentTransactions] = useState(dashboardData.recentTransactions);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState(recentTransactions);

  useEffect(() => {
    setTimeout(() => {
      dispatch(fetchSubscriptionStatus());
      fetchStudents();
      getClassList();
    }, 1000);
  }, []);

  const fetchStudents = async () => {
    try {
      const result = await getService(apiName.getStudent);
      setStudents(result?.length);
      setLoading(false);
    } catch (error) {
      console.log('fetchStudents error', error);
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
      console.log('getClassList error', error);
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
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    colors: ['#FF4560', '#00E396', '#008FFB'], 
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: chartData.labels,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}`,
      },
    },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen dark:bg-gray-900">
      {loading && <Loader />}
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
        {/* Students Metric */}
        <Link to="/admin/student" className="block">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-700">
              <PiStudentFill className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Students</span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {students}
                </h4>
              </div>
            </div>
          </div>
        </Link>

        {/* Classes Metric */}
        <Link to="/admin/class" className="block">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-700">
              <HiMiniAcademicCap className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Classes</span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {classes}
                </h4>
              </div>
            </div>
          </div>
        </Link>

        {/* Sections Metric */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-700">
            <BsFillSignIntersectionFill className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Sections</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {sections}
              </h4>
            </div>
          </div>
        </div>

        {/* Payments Metric */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-700">
            <MdPayment className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Payments</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {payments}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Chart for Students, Classes, and Fee Dues */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 mt-10 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Enrollment Overview and Fee Status</h3>
        <Chart options={chartOptions} series={chartData.datasets} type="bar" height={350} />
      </div>
    </div>
  );
};

export default AdminHome;
