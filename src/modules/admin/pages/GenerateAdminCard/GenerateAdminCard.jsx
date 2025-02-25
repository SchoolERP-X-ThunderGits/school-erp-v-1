import React, { useEffect, useState } from 'react';
import { FaSearch, FaDownload } from 'react-icons/fa'; // FontAwesome icons
import { getService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import Loader from '../../../../components/Loader';
import { showToast } from '../../../../components/Toast';
import { pdf, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import moment from 'moment';

const GenerateAdmitCard = () => {
    const [classes, setClasses] = useState([]);
    const [exams, setExams] = useState([]);
    const sessionOptions = ["2023-2024", "2024-2025", "2025-2026"];
    const [selectedClass, setSelectedClass] = useState('');
    const [examSchedule, setExamSchedule] = useState([]);
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
    const fetchExamSchedule = async () => {
        try {
            const response = await getService(`${apiName?.admitCardByClass}?classId=${selectedClass}&examNameId=${selectedExam}`);
            setExamSchedule(response);
        } catch (error) {
            console.error("Error fetching exam schedule:", error);
        }
    };

    const handleSearchStudents = async () => {
        fetchExamSchedule()
        if (!selectedClass || !selectedSection || !selectedExam || !selectedSession) {
            showToast('Please select all fields', 'error');
            return;
        }

        setLoading(true);
        try {
            // Call the API to get students based on filters
            const response = await getService(`${apiName.getStudentByExam}/${selectedClass}/${selectedSection}`);
            setStudents(response);
        } catch (error) {
            showToast('Error fetching students', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateAdmitCard = async (student) => {
        const blob = await pdf(<StudentAdmitCardPDF student={student} examSchedule={examSchedule} />).toBlob();
        saveAs(blob, `Student_ADMIT_CARD_${student.admission_Number}.pdf`);
    };

    const StudentAdmitCardPDF = ({ student, examSchedule }) => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.card}>
                    {/* Header Section */}
                    <View style={styles.header}>
                        <Text style={styles.schoolName}>Vision Public School</Text>
                    </View>

                    {/* Student Photo & Info */}
                    <View style={styles.infoContainer}>
                        <Image src={student.student_Photo || '/default-photo.jpg'} style={styles.image} />
                        <View style={styles.details}>
                            <Text style={styles.studentName}>{student.first_Name} {student.last_Name}</Text>
                            <Text style={styles.studentId}>ID: {student.admission_Number}</Text>
                            <Text style={styles.studentRoll}>Roll No: {student.roll_Number}</Text>
                        </View>
                    </View>

                    {/* Additional Info */}
                    <View style={styles.extraInfo}>
                        <Text style={styles.label}>Class:</Text>
                        <Text style={styles.value}>{student.class_Id?.name}</Text>
                    </View>
                    <View style={styles.extraInfo}>
                        <Text style={styles.label}>Section:</Text>
                        <Text style={styles.value}>{student.section}</Text>
                    </View>
                    <View style={styles.extraInfo}>
                        <Text style={styles.label}>Address:</Text>
                        <Text style={styles.value}>{student.permanent_Address || 'Not Available'}</Text>
                    </View>
                    <View style={styles.extraInfo}>
                        <Text style={styles.label}>DOB:</Text>
                        <Text style={styles.value}>{moment(student?.date_Of_Birth).format('DD MMMM, YYYY') || 'Not Available'}</Text>
                    </View>

                    {/* Exam Schedule */}
                    {examSchedule?.length > 0 && (
                        <View style={styles.examScheduleContainer}>
                            <Text style={styles.examScheduleHeader}>Exam Schedule:</Text>
                            <View style={styles.examTable}>
                                <View style={styles.examTableRow}>
                                    <Text style={styles.examTableHeader}>Subject</Text>
                                    <Text style={styles.examTableHeader}>Date</Text>
                                    <Text style={styles.examTableHeader}>Start Time</Text>
                                    <Text style={styles.examTableHeader}>End Time</Text>
                                </View>
                                {examSchedule.map((schedule, index) => (
                                    <View key={index} style={styles.examTableRow}>
                                        <Text style={styles.examTableCell}>{schedule.subject.name}</Text>
                                        <Text style={styles.examTableCell}>{moment(schedule.date).format('DD MMMM, YYYY')}</Text>
                                        <Text style={styles.examTableCell}>{schedule.startTime}</Text>
                                        <Text style={styles.examTableCell}>{schedule.endTime}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Footer Section */}
                    <View style={styles.footer}>
                        <Text>Valid for the Academic Year 2024-2025</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );


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
                            onChange={(e) => { setSelectedClass(e.target.value) }}
                            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Class</option>
                            {classes.map((cls) => (
                                <option key={cls._id} value={cls._id}>
                                    {cls.name}
                                </option>
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
                                <option key={exam._id} value={exam._id}>
                                    {exam.name}
                                </option>
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
                students?.length > 0 ? (
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
                                        <td className="py-3 px-6 text-sm text-gray-800">{student.first_Name} {student?.last_Name}</td>
                                        {console.log('sfskfs', student)}
                                        <td className="py-3 px-6 text-sm text-gray-800">
                                            <button
                                                onClick={() => handleGenerateAdmitCard(student)}
                                                className="text-[#1c2534] hover:text-[#1c2534] transition duration-200"
                                            >
                                                <FaDownload className="mr-2" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
                    :
                    <p style={{ textAlign: 'center' }}>No students found</p>
            )}
        </div>
    );
};

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#f4f4f4',
        padding: 30,
    },
    card: {
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: 30,
        borderWidth: 2,
        borderColor: '#0047AB',
        height: '100%',
    },
    header: {
        width: '100%',
        backgroundColor: '#0047AB',
        paddingVertical: 20,
        textAlign: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    schoolName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        borderBottom: '2px solid #f0f0f0',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#1c2534',
        marginRight: 20,
    },
    details: {
        flex: 1,
    },
    studentName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 10,
    },
    studentId: {
        fontSize: 16,
        color: '#555',
    },
    studentRoll: {
        fontSize: 16,
        color: '#555',
    },
    extraInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottom: '1px solid #f0f0f0',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0047AB',
    },
    value: {
        fontSize: 16,
        color: '#222',
    },
    examScheduleContainer: {
        marginTop: 30,
    },
    examScheduleHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 10,
    },
    examTable: {
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    examTableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
    },
    examTableHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0047AB',
        flex: 1,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    examTableCell: {
        fontSize: 14,
        color: '#555',
        flex: 1,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    footer: {
        paddingTop: 30,
        textAlign: 'center',
        fontSize: 14,
        color: '#555',
    },
});

export default GenerateAdmitCard;
