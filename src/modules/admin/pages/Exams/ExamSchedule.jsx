import React, { useState, useEffect } from 'react';
import { getService, postService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import { showToast } from '../../../../components/Toast';
const ExamSchedule = () => {
    const [examsList, setExamsList] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [subjectsList, setSubjectsList] = useState([]);
    const [classes, setClasses] = useState([]);
    const [examSchedules, setExamSchedules] = useState([]);
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
    const fetchExamSchedules = async (examId, classId) => {
        const result = await getService(`${apiName.addSchedule}?examId=${examId}&classId=${classId}`)
        setExamSchedules(result)

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
            classId: selectedClass
        };
        setExamSchedules(updatedSchedules);
    };

    const getSubjectsByClass = async (classId) => {
        // Fetch subjects based on class selection
        try {
            const result = await getService(`${apiName.getSubjectByClass}`);
            const mapping = result.find((item) => item.class._id === classId);
            setSubjectsList(mapping?.subjects);
        } catch (error) {
            showToast('Error fetching subjects', 'error');
        }
    };

    const handleClassChange = (event) => {
        fetchExamSchedules(selectedExam, event.target.value)
        setSelectedClass(event.target.value);
        getSubjectsByClass(event.target.value);  // Fetch subjects based on selected class
    };

    const handleScheduleExam = () => {
        if (!selectedExam || !selectedClass) {
            showToast('Please fill in all fields for each subject', 'error');
            return;
        }

        // Handle the submission of scheduled exams
        examSchedules.forEach(async (schedule) => {
            const result = await postService(apiName.addSchedule, schedule)
            setSelectedClass('')
            setSelectedExam('')
            setSubjectsList([])
            setExamSchedules([])

        });
        setTimeout(() => {

            showToast('Exam scheduled successfully!', 'success');
        }, 1000);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Schedule Exam</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg">
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
                        disabled={!selectedExam} // Disable class selection if no exam is selected
                    >
                        <option value="">Select Class</option>
                        {classes?.map((cls) => (
                            <option key={cls._id} value={cls._id}>
                                {cls.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Clear Filter Button */}
                <div className="mb-4">
                    <button
                        onClick={() => {
                            setSelectedExam('');  // Reset selected exam
                            setSelectedClass(''); // Reset selected class
                            fetchExamSchedules('', '');  // Optionally reset the exam schedules or any associated data
                        }}
                        className="px-6 py-3 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition duration-300"
                    >
                        Clear Filters
                    </button>
                </div>


                {selectedClass && subjectsList?.length != 0 ?
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
                    selectedClass &&
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
