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

const AdminHome = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem('role');
  // Admin State
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [payments, setPayments] = useState(4);

  // Super Admin State
  const [superAdminData, setSuperAdminData] = useState(null);

  useEffect(() => {
    dispatch(fetchSubscriptionStatus());

    if (role === 'admin') {
      fetchAdminData();
    } else if (role === 'superadmin') {
      fetchSuperAdminData();
    }
  }, [role]);

  const fetchAdminData = async () => {
    try {
      const studentRes = await getService(apiName.getStudent);
      const classRes = await getService(apiName.getClassList);

      setStudents(studentRes?.length);
      setClasses(classRes?.length);
      let totalSections = 0;
      classRes.forEach(cls => {
        totalSections += cls.sections.length;
      });
      setSections(totalSections);
    } catch (error) {
      showToast('Error loading admin dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuperAdminData = async () => {
    try {
      const result = await getService(apiName.superAdminDashbaord); // Use correct API endpoint
      setSuperAdminData(result);
    } catch (error) {
      showToast('Error loading super admin dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderAdminDashboard = () => (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
        {/* Metric Cards for Admin */}
        {/* Students */}
        <Link to="/admin/student">
          <MetricCard icon={<PiStudentFill />} title="Students" count={students} />
        </Link>

        {/* Classes */}
        <Link to="/admin/class">
          <MetricCard icon={<HiMiniAcademicCap />} title="Classes" count={classes} />
        </Link>

        {/* Sections */}
        <MetricCard icon={<BsFillSignIntersectionFill />} title="Sections" count={sections} />

        {/* Payments */}
        <MetricCard icon={<MdPayment />} title="Payments" count={payments} />
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 mt-10 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Enrollment Overview and Fee Status
        </h3>
        <Chart
          options={{
            chart: { type: 'bar' },
            xaxis: { categories: ['Students', 'Classes', 'Fee Dues'] },
            dataLabels: { enabled: true },
            colors: ['#FF4560', '#FF9800', '#2196F3']
          }}
          series={[{ name: 'Count', data: [students, classes, payments] }]}
          type="bar"
          height={350}
        />
      </div>
    </>
  );

  const renderSuperAdminDashboard = () => {
    if (!superAdminData) return null;
    const {
      totalSchool,
      totalStudents,
      totalClasses,
      totalSections,
      totalRevenue,
      totalPaymentsThisYear,
      monthlyRevenueBreakdown,
      monthlyAdmissionGraph,
    } = superAdminData;

    return (
      <>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
          <MetricCard title="Schools" count={totalSchool} />
          <MetricCard title="Students" count={totalStudents} />
          <MetricCard title="Classes" count={totalClasses} />
          <MetricCard title="Sections" count={totalSections} />
          <MetricCard title="Total Payments" count={totalPaymentsThisYear} />
          <MetricCard title="Total Revenue" count={`₹${totalRevenue}`} />
        </div>

        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 mt-10 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Monthly Revenue
          </h3>
          <Chart
            options={{ xaxis: { categories: monthlyRevenueBreakdown.labels },chart:{
              zoom:{
                enabled:false
              }
            } }}
            series={[{ name: 'Revenue', data: monthlyRevenueBreakdown.data }]}
            type="line"
            height={350}
          />
        </div>

        {/* Admissions Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 mt-10 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Monthly Admissions
          </h3>
          <Chart
            options={{ xaxis: { categories: monthlyAdmissionGraph.labels } }}
            series={[{ name: 'Admissions', data: monthlyAdmissionGraph.data }]}
            type="bar"
            height={350}
          />
        </div>
      </>
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen dark:bg-gray-900">
      {role === 'admin' ? renderAdminDashboard() : renderSuperAdminDashboard()}
    </div>
  );
};

const MetricCard = ({ icon, title, count }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800/[0.03] md:p-6">
    {icon && (
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-700">
        {icon}
      </div>
    )}
    <div className="mt-5">
      <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
      <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{count}</h4>
    </div>
  </div>
);

export default AdminHome;
