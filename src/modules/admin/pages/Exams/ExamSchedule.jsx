import React, { useState, useEffect } from 'react';
import { getService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import { showToast } from '../../../../components/Toast';

const ExamSchedule = () => {
    const [examsList, setExamsList] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [subjectsList, setSubjectsList] = useState([]);
    const [classes, setClasses] = useState([]);
    const [examDetails, setExamDetails] = useState([]); // Store subject-related exam details
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch exams list when component mounts
        getExamsList();
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const result = await getService(apiName.getClassList); // Get Classes API
            setClasses(result);
        } catch (error) {
            // showToast('Error fetching classes', 'error');
        }
    };

    const getExamsList = async () => {
        setLoading(true);
        try {
            const result = await getService(apiName.exams);
            setExamsList(result);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            showToast('Error fetching exams', 'error');
        }
    };

    const getSubjectsByClass = async (classId) => {
        // Fetch subjects based on class selection
        try {
            const result = await getService(`${apiName.getSubjectByClass}`);
            const mapping = result.find((item) => item.class._id === classId);
            setSubjectsList(mapping?.subjects);
            setExamDetails(
                mapping?.subjects?.map((subject) => ({
                    subjectId: subject._id,
                    subjectName: subject.name,
                    examDate: '',
                    startTime: '',
                    endTime: '',
                }))
            );
        } catch (error) {
            showToast('Error fetching subjects', 'error');
        }
    };

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
        getSubjectsByClass(event.target.value);  // Fetch subjects based on selected class
    };

    const handleExamDetailsChange = (e, subjectId, field) => {
        const updatedDetails = examDetails?.map((exam) =>
            exam.subjectId === subjectId ? { ...exam, [field]: e.target.value } : exam
        );
        setExamDetails(updatedDetails);
    };

    const handleScheduleExam = () => {
        if (!selectedExam || !selectedClass || !examDetails?.every((details) => details.examDate && details.startTime && details.endTime)) {
            showToast('Please fill in all fields for each subject', 'error');
            return;
        }

        const examSchedule = {
            exam: selectedExam,
            class: selectedClass,
            subjects: examDetails,
        };

        // Make API call to schedule the exam (you can use a POST service here)
        showToast('Exam scheduled successfully!', 'success');
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Schedule Exam</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">Select Exam</label>
                    <select
                        value={selectedExam}
                        onChange={(e) => setSelectedExam(e.target.value)}
                        className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Select Exam</option>
                        {examsList?.map((exam) => (
                            <option key={exam._id} value={exam._id}>
                                {exam.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">Select Class</label>
                    <select
                        value={selectedClass}
                        onChange={handleClassChange}
                        className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
                        disabled={!selectedExam}
                    >
                        <option value="">Select Class</option>
                        {classes?.map((cls) => (
                            <option key={cls._id} value={cls._id}>
                                {cls.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedClass && examDetails?.length != 0 ?
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Subjects for Selected Class</label>
                        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-600">
                                        <th className="py-3 px-6 text-left text-sm font-semibold">Subject Name</th>
                                        <th className="py-3 px-6 text-left text-sm font-semibold">Select Date</th>
                                        <th className="py-3 px-6 text-left text-sm font-semibold">Start Time</th>
                                        <th className="py-3 px-6 text-left text-sm font-semibold">End Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {examDetails?.map((examDetail) => (
                                        <tr key={examDetail.subjectId} className="border-b hover:bg-gray-50 transition duration-200">
                                            <td className="py-3 px-6 text-sm text-gray-800">{examDetail.subjectName}</td>
                                            <td className="py-3 px-6">
                                                <input
                                                    type="date"
                                                    value={examDetail.examDate}
                                                    onChange={(e) => handleExamDetailsChange(e, examDetail.subjectId, 'examDate')}
                                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
                                                />
                                            </td>
                                            <td className="py-3 px-6">
                                                <input
                                                    type="time"
                                                    value={examDetail.startTime}
                                                    onChange={(e) => handleExamDetailsChange(e, examDetail.subjectId, 'startTime')}
                                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
                                                />
                                            </td>
                                            <td className="py-3 px-6">
                                                <input
                                                    type="time"
                                                    value={examDetail.endTime}
                                                    onChange={(e) => handleExamDetailsChange(e, examDetail.subjectId, 'endTime')}
                                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    :
                    selectedClass&&
                    <p>No Subjects Found</p>
                }

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleScheduleExam}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Schedule Exam
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExamSchedule;
