import React, { useEffect, useState } from 'react';
import { MdPayment, MdOutlineToday } from 'react-icons/md';
import { HiMiniAcademicCap } from 'react-icons/hi2';
import { HiBookOpen } from 'react-icons/hi';
import { FaFileDownload } from 'react-icons/fa';
import { getService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';

const StudentHome = () => {

  const [data, setData] = useState()
  useEffect(() => {
    getDashboardData()
  }, [])
  const studentData = JSON.parse(localStorage.getItem("studentData"));
  console.log('dfskdskff', studentData)

  const getDashboardData = async () => {
    try {
      const result = await getService(`${apiName.studentDashboard}/${studentData?._id}`);
      console.log('kfskkresultresult', result)
      setData(result)
      // setStudents(result?.length);
      // setLoading(false);
    } catch (error) {
      console.log('fetchStudents error', error);
      showToast('Error fetching students data', 'error');
    }
  };
  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
          {/* Attendance */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 md:p-6 shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-xl">
              <MdOutlineToday className="text-indigo-700 dark:text-indigo-300 size-6" />
            </div>
            <div className="mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">Attendance</span>
              <h4 className="mt-2 font-bold text-gray-800 dark:text-white text-title-sm">95%</h4>
            </div>
          </div>

          {/* Subjects */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 md:p-6 shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-xl">
              <HiBookOpen className="text-indigo-700 dark:text-indigo-300 size-6" />
            </div>
            <div className="mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">Subjects</span>
              <h4 className="mt-2 font-bold text-gray-800 dark:text-white text-title-sm">6</h4>
            </div>
          </div>

          {/* Fees Paid */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 md:p-6 shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-xl">
              <MdPayment className="text-indigo-700 dark:text-indigo-300 size-6" />
            </div>
            <div className="mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">Fees Paid</span>
              <h4 className="mt-2 font-bold text-gray-800 dark:text-white text-title-sm">₹40,000</h4>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center rounded-xl">
                <MdPayment className="text-indigo-700 dark:text-indigo-300 size-6" />
              </div>
              <h2 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">Fees Summary</h2>
            </div>
            <div className="space-y-2 text-gray-700 dark:text-gray-200">
              <p><span className="font-semibold text-gray-600 dark:text-gray-300">Total Fees:</span> {data?.feeSummary?.totalAssigned}</p>
              <p><span className="font-semibold text-gray-600 dark:text-gray-300">Paid:</span> {data?.feeSummary?.totalPaid}</p>
              <p className="text-red-600 dark:text-red-400"><span className="font-semibold">Due:</span> {data?.feeSummary?.totalDue}</p>
              <p className="text-red-600 dark:text-red-400"><span className="font-semibold">Due Date:</span> 05-May-2025</p>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">Pay Now</button>
              <button className="bg-indigo-100 dark:bg-indigo-700 dark:text-white text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-600 transition">Download Receipt</button>
            </div>
          </div>
          {/* Upcoming Exams */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center rounded-xl">
                <HiMiniAcademicCap className="text-indigo-700 dark:text-indigo-300 size-6" />
              </div>
              <h2 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">Upcoming Exams</h2>
            </div>
            <div className="space-y-2 text-gray-700 dark:text-gray-200">
              <p><span className="font-semibold text-gray-600 dark:text-gray-300">Next Exam:</span> Mathematics</p>
              <p><span className="font-semibold text-gray-600 dark:text-gray-300">Date:</span> 12-May-2025</p>
              <p><span className="font-semibold text-gray-600 dark:text-gray-300">Time:</span> 10:00 AM</p>
              <p className="mt-2">
                <a href="#" className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-800 dark:hover:text-indigo-300">📅 View Full Schedule</a>
              </p>
              <p className="mt-3">
                <span className="font-semibold text-gray-600 dark:text-gray-300">Admit Card:</span> ✅ Available
                &nbsp;&nbsp;
                <a href="#" className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-800 dark:hover:text-indigo-300">Download</a>
              </p>
            </div>
          </div>
        </div>



        {/* Quick Downloads */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow mt-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center rounded-xl">
              <FaFileDownload className="text-indigo-700 dark:text-indigo-300 size-6" />
            </div>
            <h2 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">Quick Downloads</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="bg-indigo-100 dark:bg-indigo-700 dark:text-white text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-600 transition">Download ID Card</button>
            <button className="bg-indigo-100 dark:bg-indigo-700 dark:text-white text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-600 transition">Download Admission Receipt</button>
            <button className="bg-indigo-100 dark:bg-indigo-700 dark:text-white text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-600 transition">Download Latest Fee Receipt</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentHome;
