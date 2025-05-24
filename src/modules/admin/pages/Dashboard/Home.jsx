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
import { useUserContext } from '../../../../context/UserContext';
const AdminHome = () => {
  const dispatch = useDispatch();
  const { school } = useUserContext();
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem('role');
  // Admin State
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState(0);
  const [payments, setPayments] = useState(4);

  // Super Admin State
  const [superAdminData, setSuperAdminData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {

    dispatch(fetchSubscriptionStatus());
    if (role === 'admin') {
      fetchAdminData();
    } else if (role === 'superadmin') {
      fetchSuperAdminData();
    }
  }, [role]);
  useEffect(() => {
    if (school?._id) {
      getProfileDetails();
    }
  }, [school?._id])
  const getProfileDetails = async () => {
    setLoading(true);
    try {
      const result = await getService(`${apiName.schoolDashboard}${school?._id}`);
      setDashboardData(result?.data);
    } catch (error) {
      showToast('Failed to load profile details', 'error');
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      const studentRes = await getService(apiName.getStudent);
      const classRes = await getService(apiName.getClassList);
      const result = await getService(apiName.getSectionList);
      setStudents(studentRes?.length);
      setClasses(classRes?.length);
      setSections(result?.length);
    } catch (error) {
      console.log('error', error);
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
          <MetricCard icon={<PiStudentFill />} title="Students" count={dashboardData?.counts?.totalStudents} />
        </Link>

        {/* Classes */}
        <Link to="/admin/class">
          <MetricCard icon={<HiMiniAcademicCap />} title="Classes" count={dashboardData?.counts?.totalClasses} />
        </Link>

        {/* Sections */}
        <Link to="/admin/section">
          <MetricCard icon={<BsFillSignIntersectionFill />} title="Sections" count={dashboardData?.counts?.totalSections} />
        </Link>

        {/* Payments */}
        <MetricCard icon={<MdPayment />} title="Payments" count={dashboardData?.counts?.totalPayments} />
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 mt-10 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Student Enrollment
        </h3>
        <Chart
          options={{
            chart: { type: 'area', zoom: { enabled: false }, toolbar: { show: false } },
            xaxis: { categories: dashboardData?.studentGraph.labels },
            fill: {
              type: 'gradient',
              gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.6,
                opacityTo: 0.1,
                stops: [0, 90, 100],
              },
            },
            colors: ['#4F46E5'],
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth' }
          }}
          series={[{ name: 'Students', data: dashboardData?.studentGraph.data }]}
          type="area"
          height={350}
        />

      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 mt-10 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Fee
        </h3>
        <Chart
          options={{
            chart: { type: 'bar', zoom: { enabled: false }, toolbar: { show: false } },
            xaxis: { categories: dashboardData?.paymentGraph.labels },
            colors: ['#10B981'],
            plotOptions: {
              bar: {
                borderRadius: 5,
                columnWidth: '45%',
              }
            },
            dataLabels: { enabled: false }
          }}
          series={[{ name: 'Revenue', data: dashboardData?.paymentGraph.data }]}
          type="bar"
          height={350}
        />


      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 mt-10 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Student Enrollment
        </h3>
        <Chart
          options={{
            chart: { type: 'line', zoom: { enabled: false }, toolbar: { show: false } },
            xaxis: { categories: dashboardData?.classGraph.labels },
            stroke: {
              width: 3,
              dashArray: 5,
              curve: 'straight'
            },
            colors: ['#F59E0B'],
            markers: { size: 5 }
          }}
          series={[{ name: 'Classes', data: dashboardData?.classGraph.data }]}
          type="line"
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Monthly Revenue</h3>
            <span className="text-sm text-gray-500">Last 12 Months</span>
          </div>
          <Chart
            options={{
              chart: {
                type: 'area',
                zoom: { enabled: false },
                toolbar: { show: false },
              },
              xaxis: {
                categories: monthlyRevenueBreakdown.labels,
                labels: { style: { colors: '#6B7280' } },
              },
              fill: {
                type: 'gradient',
                gradient: {
                  shadeIntensity: 1,
                  opacityFrom: 0.4,
                  opacityTo: 0.1,
                  stops: [0, 90, 100],
                },
              },
              stroke: {
                curve: 'smooth',
                width: 3,
                colors: ['#3B82F6'],
              },
              colors: ['#3B82F6'],
              dataLabels: { enabled: false },
              tooltip: {
                theme: 'dark',
                y: {
                  formatter: (val) => `₹${val.toLocaleString()}`,
                },
              },
            }}
            series={[{ name: 'Revenue', data: monthlyRevenueBreakdown.data }]}
            type="area"
            height={350}
          />
        </div>


        {/* Admissions Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 mt-10 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Monthly Admissions
          </h3>
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 mt-10 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Monthly Admissions</h3>
              <span className="text-sm text-gray-500">Year to Date</span>
            </div>
            <Chart
              options={{
                chart: {
                  type: 'bar',
                  toolbar: { show: false },
                },
                plotOptions: {
                  bar: {
                    borderRadius: 6,
                    columnWidth: '50%',
                  },
                },
                xaxis: {
                  categories: monthlyAdmissionGraph.labels,
                  labels: { style: { colors: '#6B7280' } },
                },
                colors: ['#10B981'],
                dataLabels: { enabled: false },
                tooltip: {
                  theme: 'dark',
                  y: {
                    formatter: (val) => `${val} Admissions`,
                  },
                },
              }}
              series={[{ name: 'Admissions', data: monthlyAdmissionGraph.data }]}
              type="bar"
              height={350}
            />
          </div>

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
