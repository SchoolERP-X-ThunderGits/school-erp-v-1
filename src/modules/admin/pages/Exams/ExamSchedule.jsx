import React, { useState, useEffect } from 'react';
import { getService, postService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import { showToast } from '../../../../components/Toast';
import { FaPlus } from 'react-icons/fa';

const ExamSchedule = () => {
    const [examsList, setExamsList] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [subjectsList, setSubjectsList] = useState([]);
    const [classes, setClasses] = useState([]);
    const [examSchedules, setExamSchedules] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchExamSchedules('', '');
        getExamsList();
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const result = await getService(apiName.getClassList);
            setClasses(result);
        } catch (error) {
            // showToast('Error fetching classes', 'error');
        }
    };

    const fetchExamSchedules = async (examId, classId) => {
        const result = await getService(`${apiName.addSchedule}?examId=${examId}&classId=${classId}`);
        console.log('resultresult', result);
        setExamSchedules(result);
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

    const handleInputChange = (index, field, value, subjectId) => {
        const updatedSchedules = [...examSchedules];
        updatedSchedules[index] = {
            ...updatedSchedules[index],
            [field]: value,
            subjectId: subjectId,
            examNameId: selectedExam,
            classId: selectedClass,
        };
        setExamSchedules(updatedSchedules);
    };

    const getSubjectsByClass = async (classId) => {
        try {
            const result = await getService(`${apiName.getSubjectByClass}`);
            const mapping = result.find((item) => item.class._id === classId);
            setSubjectsList(mapping?.subjects);
        } catch (error) {
            showToast('Error fetching subjects', 'error');
        }
    };

    const handleClassChange = (event) => {
        fetchExamSchedules(selectedExam, event.target.value);
        setSelectedClass(event.target.value);
        getSubjectsByClass(event.target.value);
    };

    const handleScheduleExam = () => {
        if (!selectedExam || !selectedClass) {
            showToast('Please fill in all fields for each subject', 'error');
            return;
        }

        examSchedules.forEach(async (schedule) => {
            const result = await postService(apiName.addSchedule, schedule);
            console.log('resuit ----', result);
            setSelectedClass('');
            setSelectedExam('');
            setSubjectsList([]);
            setExamSchedules([]);
            fetchExamSchedules('','')
            setShowModal(false);
        });

        setTimeout(() => {
            showToast('Exam scheduled successfully!', 'success');
        }, 1000);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-800">Exams Schedule</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    <FaPlus className="mr-2" /> Schedule Exam
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg sm:max-w-md md:max-w-lg">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Select Exam</label>
                            <select
                                value={selectedExam}
                                onChange={(e) => {
                                    setSelectedExam(e.target.value);
                                    fetchExamSchedules(e.target.value, selectedClass);
                                }}
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

                        <div className="mb-4">
                            <button
                                onClick={() => {
                                    setSelectedExam('');
                                    setSelectedClass('');
                                    fetchExamSchedules('', '');
                                }}
                                className="px-6 py-3 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition duration-300"
                            >
                                Clear Filters
                            </button>
                        </div>

                        {selectedClass && subjectsList?.length !== 0 ?
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
                                            {subjectsList?.map((subject, index) => (
                                                <tr key={subject.subjectId} className="border-b hover:bg-gray-50 transition duration-200">
                                                    <td className="py-3 px-6 text-sm text-gray-800">{subject.name}</td>
                                                    <td className="py-3 px-6">
                                                        <input
                                                            type="date"
                                                            onChange={(e) =>
                                                                handleInputChange(index, "date", e.target.value, subject._id)
                                                            }
                                                            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-6">
                                                        <input
                                                            type="text"
                                                            value={examSchedules[index]?.startTime || ""}
                                                            onChange={(e) =>
                                                                handleInputChange(index, "startTime", e.target.value, subject._id)
                                                            }
                                                        />
                                                    </td>
                                                    <td className="py-3 px-6">
                                                        <input
                                                            type="text"
                                                            value={examSchedules[index]?.endTime || ""}
                                                            onChange={(e) =>
                                                                handleInputChange(index, "endTime", e.target.value, subject._id)
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            :
                            selectedClass && <p>No Subjects Found</p>
                        }

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => { setShowModal(false) }}
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleScheduleExam}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                Schedule Exam
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* Table to Show Scheduled Exams */}
            <div className="mt-6 overflow-x-auto">
                <h2 className="text-xl font-semibold text-gray-800">Scheduled Exams</h2>
                <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-4">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600">
                                <th className="py-3 px-6 text-left text-sm font-semibold">Subject Name</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">Exam Date</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">Start Time</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">End Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {examSchedules.map((schedule) => (
                                <tr key={schedule._id} className="border-b hover:bg-gray-50 transition duration-200">
                                    <td className="py-3 px-6 text-sm text-gray-800">{schedule.subject?.name}</td>
                                    <td className="py-3 px-6">{new Date(schedule.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-6">{schedule.startTime}</td>
                                    <td className="py-3 px-6">{schedule.endTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExamSchedule;
