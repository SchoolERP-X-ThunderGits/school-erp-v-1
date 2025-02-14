import React, { useEffect, useState } from 'react';
import { FaSearch, FaDownload } from 'react-icons/fa'; // FontAwesome icons
import { getService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import Loader from '../../../../components/Loader';
import { showToast } from '../../../../components/Toast';

const GenerateAdmitCard = () => {
    const [classes, setClasses] = useState([]);
    const [exams, setExams] = useState([]);
    const sessionOptions = ["2023-2024", "2024-2025", "2025-2026"];
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedSession, setSelectedSession] = useState('');
    const Sections = [
        {
            _id: 1,
            section: 'A',
        },
        {
            _id: 2,
            section: 'B',
        },
        {
            _id: 3,
            section: 'C',
        },
        {
            _id: 4,
            section: 'D',
        },
        {
            _id: 5,
            section: 'E',
        },
        {
            _id: 6,
            section: 'F',
        },
        {
            _id: 7,
            section: 'G',
        },

        {
            _id: 8,
            section: 'H',
        },
        {
            _id: 9,
            section: "I",
        },
        {
            _id: 10,
            section: 'J',
        },


    ]
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            // Fetch classes, exams, and sessions
            const classesData = await getService(apiName.getClassList);
            const examsData = await getService(apiName.exams);
            setClasses(classesData);
            setExams(examsData);
        } catch (error) {
            showToast('Error fetching data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchStudents = async () => {
        if (!selectedClass || !selectedSection || !selectedExam || !selectedSession) {
            showToast('Please select all fields', 'error');
            return;
        }

        setLoading(true);
        try {
            // Call the API to get students based on filters
            const response = await getService(`${apiName.students}?class=${selectedClass}&section=${selectedSection}&exam=${selectedExam}&session=${selectedSession}`);
            setStudents(response);
        } catch (error) {
            showToast('Error fetching students', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateAdmitCard = (studentId) => {
        // Logic to generate admit card for the student
        showToast(`Admit card generated for student ID: ${studentId}`, 'success');
    };

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Generate Admit Cards</h1>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Select Class</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Class</option>
                            {classes.map((classItem) => (
                                <option key={classItem.id} value={classItem.id}>{classItem.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Section</label>
                        <select
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Section</option>
                            {Sections.map((section) => (
                                <option key={section.id} value={section.id}>{section.section}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Exam</label>
                        <select
                            value={selectedExam}
                            onChange={(e) => setSelectedExam(e.target.value)}
                            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Exam</option>
                            {exams.map((exam) => (
                                <option key={exam.id} value={exam.id}>{exam.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Session</label>
                        <select
                            value={selectedSession}
                            onChange={(e) => setSelectedSession(e.target.value)}
                            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Session</option>
                            {sessionOptions.map((session, index) => (
                                <option key={index} value={session}>
                                    {session}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleSearchStudents}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    <FaSearch className="mr-2" /> Search
                </button>
            </div>

            {/* Students List */}
            {loading ? (
                <Loader />
            ) : (
                students.length > 0 && (
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600">
                                    <th className="py-3 px-6 text-left text-sm font-semibold">Student Name</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id} className="border-b hover:bg-gray-50 transition duration-200">
                                        <td className="py-3 px-6 text-sm text-gray-800">{student.name}</td>
                                        <td className="py-3 px-6 text-sm text-gray-800">
                                            <button
                                                onClick={() => handleGenerateAdmitCard(student.id)}
                                                className="text-green-500 hover:text-green-700 transition duration-200"
                                            >
                                                <FaDownload className="mr-2" /> Generate Admit Card
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </div>
    );
};

export default GenerateAdmitCard;
