import React, { useEffect, useState, useRef } from 'react';
import { HiMiniAcademicCap } from 'react-icons/hi2';
import { FaCalendarAlt, FaClock, FaBook, FaChalkboardTeacher, FaDownload } from 'react-icons/fa';
import { getService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import moment from 'moment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../components/ui/table';

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
          <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <Table className="min-w-full table-auto">
              <TableHeader>
                <TableRow className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
                  <th className="py-3 px-6 text-left text-sm font-semibold">Exam Name (Session)</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold">Subject</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold">Class (Sections)</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold">Date</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold">Time</th>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam, index) => (
                  <TableRow
                    key={index}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
                  >
                    <TableCell className="py-3 px-6 text-sm text-gray-800 dark:text-gray-200">
                      {exam.examName?.name} ({exam.examName?.session})
                    </TableCell>
                    <TableCell className="py-3 px-6 text-sm text-gray-800 dark:text-gray-200">
                      {exam.subject?.name}
                    </TableCell>
                    <TableCell className="py-3 px-6 text-sm text-gray-800 dark:text-gray-200">
                      {exam.class?.name} ({exam.class?.sections?.join(', ')})
                    </TableCell>
                    <TableCell className="py-3 px-6 text-sm text-gray-800 dark:text-gray-200">
                      {moment(exam.date).format('dddd, DD MMMM YYYY')}
                    </TableCell>
                    <TableCell className="py-3 px-6 text-sm text-gray-800 dark:text-gray-200">
                      {exam.startTime} - {exam.endTime}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

      </div>
    </main>
  );
};

export default ExamList;
