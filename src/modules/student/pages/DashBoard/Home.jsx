import React, { useEffect, useState } from 'react';
import { MdPayment, MdOutlineToday } from 'react-icons/md';
import { HiMiniAcademicCap } from 'react-icons/hi2';
import { HiBookOpen } from 'react-icons/hi';
import { FaFileDownload } from 'react-icons/fa';
import { getService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import { useNavigate } from 'react-router-dom';
import moment from 'moment/moment';
import { pdf, Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import images from '../../../../constants/Images';
import { useUserContext } from '../../../../context/UserContext';
import { generateMultipleIdCardPdf } from '../../../../components/generateIdCardPdf';
import { GenerateAdmitCardPdf } from '../../../../components/GenerateAdmitCardPdf';
import { GenerateDemandSlipPdf } from '../../../../components/GenerateDemandSlipPdf';
import { showToast } from '../../../../components/Toast';
const StudentHome = () => {
  const { school } = useUserContext();
  const navigate = useNavigate()
  const [data, setData] = useState()
  useEffect(() => {
    getDashboardData()
  }, [])
  const studentData = JSON.parse(localStorage.getItem("studentData"));

  const getDashboardData = async () => {
    try {
      const result = await getService(`${apiName.studentDashboard}/${studentData?._id}`);
      console.log('kfskkresultresult', result)
      setData(result)
    } catch (error) {
      console.log('fetchStudents error', error);
      showToast('Error fetching students data', 'error');
    }
  };


  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">

          {/* Subjects */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 md:p-6 shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-xl">
              <HiBookOpen className="text-indigo-700 dark:text-indigo-300 size-6" />
            </div>
            <div className="mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">Subjects</span>
              <h4 className="mt-2 font-bold text-gray-800 dark:text-white text-title-sm">{data?.subjectCount}</h4>
            </div>
          </div>

          {/* Fees Paid */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 md:p-6 shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-xl">
              <MdPayment className="text-indigo-700 dark:text-indigo-300 size-6" />
            </div>
            <div className="mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">Fees Paid</span>
              <h4 className="mt-2 font-bold text-gray-800 dark:text-white text-title-sm">₹{data?.feeSummary?.totalPaid || 0}</h4>
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
              <p><span className="font-semibold text-gray-600 dark:text-gray-300">Total Fees:</span> {data?.feeSummary?.totalFees || 0}</p>
              <p><span className="font-semibold text-gray-600 dark:text-gray-300">Paid:</span> {data?.feeSummary?.totalPaid || 0}</p>
              <p className="text-red-600 dark:text-red-400"><span className="font-semibold">Due:</span> {data?.feeSummary?.totalDue || 0}</p>
              <p className="text-red-600 dark:text-red-400"><span className="font-semibold">Due Date:</span> 05-May-2025</p>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => {
                navigate('/student/payment-summary');
              }} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">Pay Now</button>
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
            {
              data?.upcomingExam?.length == 0 ?
                <p>No Exams</p>
                :

                <div className="space-y-2 text-gray-700 dark:text-gray-200">
                  <p><span className="font-semibold text-gray-600 dark:text-gray-300">Next Exam:</span> {data?.upcomingExam[0]?.examName?.name}</p>
                  <p><span className="font-semibold text-gray-600 dark:text-gray-300">Date:</span> {moment(data?.upcomingExam[0]?.date).format("DD-MMM-YYYY").toLowerCase()}</p>
                  <p><span className="font-semibold text-gray-600 dark:text-gray-300">Time:</span> {data?.upcomingExam[0]?.startTime} AM</p>
                  <p className="mt-2">
                    <a onClick={() => {
                      navigate('/student/exams-list');
                    }} className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-800 dark:hover:text-indigo-300">📅 View Full Schedule</a>
                  </p>
                </div>
            }
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
            <button onClick={()=>{
               generateMultipleIdCardPdf({
                student:data?.studentInfo,
                school,
                selectedTemplate: 'visionSchool',
              });
            }} className="bg-indigo-100 dark:bg-indigo-700 dark:text-white text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-600 transition">Download ID Card</button>
            <button onClick={()=>{
              GenerateDemandSlipPdf({student:data?.studentInfo,school})
            }} className="bg-indigo-100 dark:bg-indigo-700 dark:text-white text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-600 transition">Download on demand slip</button>
            <button onClick={()=>{
              GenerateAdmitCardPdf({student:data?.studentInfo,school,examSchedule:data?.upcomingExam})
            }} className="bg-indigo-100 dark:bg-indigo-700 dark:text-white text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-600 transition">Download Admit Card</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentHome;

