import React, { useEffect, useState, useRef } from 'react';
import { HiMiniAcademicCap } from 'react-icons/hi2';
import { FaCalendarAlt, FaClock, FaBook, FaChalkboardTeacher, FaDownload } from 'react-icons/fa';
import { getService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import moment from 'moment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const pdfRef = useRef();
  const studentData = JSON.parse(localStorage.getItem("studentData"));

  useEffect(() => {
    fetchExamList();
  }, []);

  const fetchExamList = async () => {
    try {
      const result = await getService(`${apiName.studentExams}/${studentData?._id}`);
      setExams(result);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };


  return (
    <main className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 flex items-center gap-3">
            <HiMiniAcademicCap className="size-7" />
            Exam Schedule
          </h1>
        </header>

        {exams.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300 text-lg mt-10">No exams found.</p>
        ) : (
          <section
            ref={pdfRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {exams.map((exam, index) => (
              <article
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-shadow p-5 space-y-4"
              >
                <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-300">
                  {exam.examName?.name} ({exam.examName?.session})
                </h2>

                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p className="flex items-center gap-2">
                    <FaBook className="text-blue-500" />
                    <span><strong>Subject:</strong> {exam.subject?.name}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FaChalkboardTeacher className="text-green-500" />
                    <span><strong>Class:</strong> {exam.class?.name} ({exam.class?.sections?.join(', ')})</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FaCalendarAlt className="text-red-500" />
                    <span><strong>Date:</strong> {moment(exam.date).format('dddd, DD MMMM YYYY')}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FaClock className="text-yellow-500" />
                    <span><strong>Time:</strong> {exam.startTime} - {exam.endTime}</span>
                  </p>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
};

export default ExamList;
