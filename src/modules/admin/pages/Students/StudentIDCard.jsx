import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash, FaDownload } from 'react-icons/fa'; // Added Download icon
import { deleteService, getService } from '../../../../constants/Service'; // Importing services
import { pdf, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import apiName from '../../../../constants/ApiName'; // Importing API Names
import { showToast } from '../../../../components/Toast'; // Show Toast Notifications
import { useNavigate } from 'react-router-dom';
import Loader from '../../../../components/Loader';
import moment from 'moment';

const StudentIDCard = () => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]); // Classes for dropdown
    const [sections, setSections] = useState([]); // Sections for dropdown based on selected class
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState(null);
    const [classFilter, setClassFilter] = useState('');
    const [sectionFilter, setSectionFilter] = useState('');
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetchClasses();
    }, []);

    // Fetch all students
    const fetchStudents = async () => {
        try {
            const result = await getService(apiName.getStudent); // API to get students
            setStudents(result);
            setLoading(false);
        } catch (error) {
            showToast('Error fetching students', 'error');
        }
    };

    // Fetch classes and their corresponding sections
    const fetchClasses = async () => {
        try {
            const result = await getService(apiName.getClassList); // Get Classes API
            setClasses(result);
            setLoading(false)
        } catch (error) {
            showToast('Error fetching classes', 'error');
        }
    };

    // Fetch sections for a particular class
    const fetchSectionsForClass = (classId) => {
        const classSelected = classes.find(classItem => classItem.name === classId);
        if (classSelected) {
            setSections(classSelected.sections); // sections associated with the selected class
        }
    };

    // Handle class selection to update sections list
    const handleClassFilterChange = (e) => {
        const selectedClass = e.target.value;
        setClassFilter(selectedClass);
        setSectionFilter(''); // Reset section filter
        fetchSectionsForClass(selectedClass); // Fetch sections for the selected class
    };

    // Handle section filter change
    const handleSectionFilterChange = (e) => {
        setSectionFilter(e.target.value);
    };

    // Handle search button click
    const handleSearch = () => {
        fetchFilteredStudents();
    };

    // Fetch filtered students based on filters (Class, Section, and Search Text)
    const fetchFilteredStudents = async () => {
        try {
            setLoading(true);
            const filters = {
                classFilter,
                sectionFilter,
                searchText,
            };
            // Call API or filter locally based on the filters
            const result = await getService(apiName.getStudent, filters); // Pass filters to the API if required
            setStudents(result);
            setLoading(false);
        } catch (error) {
            showToast('Error fetching filtered students', 'error');
        }
    };

    // Handle delete student
    const handleDelete = (studentId) => {
        setStudentId(studentId); // Store student ID for deletion
        setShowDeleteModal(true);  // Show confirmation modal
    };

    // Confirm delete student
    const handleConfirmDelete = async () => {
        try {
            await deleteService(`${apiName.deleteStudent}/${studentId}`);
            showToast('Student deleted successfully', 'success');
            fetchStudents(); // Refresh the student list
        } catch (error) {
            showToast('Error deleting student', 'error');
        }
        setShowDeleteModal(false); // Close the confirmation modal
    };

    const renderStudentList = () => {
        return (
            <div className="container mx-auto p-4">
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600">
                                <th className="py-3 px-6 text-left text-sm font-semibold">Admission Number</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">Roll Number</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">First Name</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">Last Name</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">Class</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">Section</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student._id} className="border-b hover:bg-gray-50 transition duration-200">
                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.admission_Number}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.roll_Number}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.first_Name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.last_Name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.class_Id?.name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.section}</td>
                                    <td className="px-4 py-2 flex space-x-4">
                                        {console.log('lblclblcb',student)}
                                        <button
                                            onClick={() => generateIdCardPdf(student)}
                                            className="text-[#1c2534] hover:text-[#1c2534] transition duration-200"
                                        >
                                            <FaDownload /> 
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };
    const generateIdCardPdf = async (student) => {
        const blob = await pdf(<IDCardPDF student={student} />).toBlob();
        saveAs(blob, `Student_ID_${student.admission_Number}.pdf`);
    };

   
    
    const IDCardPDF = ({ student }) => (
        <Document>
            <Page size="A6" style={styles.page}>
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
    
                    {/* Stylish Divider */}
    {console.log('student11',student)}
                    {/* Student Additional Info */}
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
                 <View style={styles.footer}>
                        <Text>Valid for the Academic Year 2024-2025</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
    return (
        <div className="container mx-auto p-4">
            {loading ? (
                <Loader />
            ) : (
                <div>
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-800">Student Registration</h1>
                    </div>

                    {/* Filters */}
                    <div className="mb-4 flex flex-wrap gap-4">
                        <select
                            className="p-2 border rounded w-full sm:w-auto"
                            value={classFilter}
                            onChange={handleClassFilterChange}
                        >
                            <option value="">Filter by Class</option>
                            {classes.map((classItem) => (
                                <option key={classItem?._id} value={classItem.name}>
                                    {classItem.name}
                                </option>
                            ))}
                        </select>
                        <select
                            className="p-2 border rounded w-full sm:w-auto"
                            value={sectionFilter}
                            onChange={handleSectionFilterChange}
                            disabled={!classFilter}
                        >
                            <option value="">Filter by Section</option>
                            {sections.map((section) => (
                                <option key={section} value={section}>
                                    {section}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="p-2 border rounded w-full sm:w-auto"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Search
                        </button>
                    </div>

                    {/* Students List */}
                    {students.length != 0 &&

                        <div className="mt-6">{renderStudentList()}</div>}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Are you sure you want to delete this student?
                        </h2>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#f4f4f4',
        padding: 20,
    },
    card: {
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: 20,
        borderWidth: 2,
        borderColor: '#0047AB',
        height: '100%',
    },
    header: {
        width:'100%',
        borderWidth:1,
        borderColor:'black',
        backgroundColor: 'black',
        paddingVertical: 10,
        textAlign: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    schoolName: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#fff',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        borderBottom: '2px solid #f0f0f0',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#1c2534',
        marginRight: 20,
    },
    details: {
        flex: 1,
    },
    studentName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 5,
    },
    studentId: {
        fontSize: 14,
        color: '#555',
    },
    studentRoll: {
        fontSize: 14,
        color: '#555',
    },
    divider: {
        height: 2,
        width: '100%',
        backgroundColor: '#FFD700',
        marginVertical: 12,
    },
    extraInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottom: '1px solid #f0f0f0',
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0047AB',
    },
    value: {
        fontSize: 14,
        color: '#222',
    },
    footer: {
        paddingTop: 15,
        textAlign: 'center',
        fontSize: 12,
        color: '#555',
    },
    qrCodePlaceholder: {
        width: 50,
        height: 50,
        backgroundColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        borderRadius: 6,
    },
});

export default StudentIDCard;
