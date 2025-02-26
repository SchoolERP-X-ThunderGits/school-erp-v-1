import React, { useEffect, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import { pdf, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import apiName from '../../../../constants/ApiName'; // Importing API Names
import { showToast } from '../../../../components/Toast'; // Show Toast Notifications
import Loader from '../../../../components/Loader';
import moment from 'moment';
import { getService } from '../../../../constants/Service';

// Template Modal Component
const TemplateModal = ({ open, onClose, onSelectTemplate, selectedTemplate }) => {
    return (
        <div
            className={`fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 transform transition-transform duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">Select Template</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800 transition duration-200"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="flex justify-around gap-6">
                    <div
                        onClick={() => onSelectTemplate('portrait')}
                        className="flex flex-col items-center cursor-pointer hover:scale-105 transition transform"
                    >
                        <img
                            src="https://i.pinimg.com/736x/6a/ed/d0/6aedd06a7fb902f163d3c0ae1ccb6a29.jpg"
                            alt="Portrait Template"
                            className="w-40 h-60 object-cover rounded-lg shadow-md transition-transform duration-300"
                        />
                        {selectedTemplate == 'portrait' && <div style={{ backgroundColor: 'green', width: 30, height: 30, borderRadius: 100 }}></div>}
                        <p className="mt-2 text-sm font-semibold text-gray-700">Portrait</p>
                    </div>

                    <div
                        onClick={() => onSelectTemplate('landscape')}
                        className="flex flex-col items-center cursor-pointer hover:scale-105 transition transform"
                    >
                        <img
                            src="https://www.shutterstock.com/image-vector/yellow-identity-id-card-design-260nw-2523030265.jpg"
                            alt="Landscape Template"
                            className="w-60 h-40 object-cover rounded-lg shadow-md transition-transform duration-300"
                        />
                        {selectedTemplate == 'landscape' && <div style={{ backgroundColor: 'green', width: 30, height: 30, borderRadius: 100 }}></div>}
                        <p className="mt-2 text-sm font-semibold text-gray-700">Landscape</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


// Main StudentIDCard Component
const StudentIDCard = () => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [students, setStudents] = useState([]);
    const [classFilter, setClassFilter] = useState('');
    const [sectionFilter, setSectionFilter] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [templateModalOpen, setTemplateModalOpen] = useState(false); // Modal visibility
    const [selectedTemplate, setSelectedTemplate] = useState(); // Default to portrait template

    useEffect(() => {
        setLoading(true);
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const result = await getService(apiName.getClassList); // Get Classes API
            setClasses(result);
            setLoading(false);
        } catch (error) {
            showToast('Error fetching classes', 'error');
            setLoading(false);
        }
    };

    const fetchSectionsForClass = (classId) => {
        const classSelected = classes.find(classItem => classItem._id === classId);
        if (classSelected) {
            setSections(classSelected.sections); // sections associated with the selected class
        }
    };

    const handleClassFilterChange = (e) => {
        const selectedClass = e.target.value;
        setClassFilter(selectedClass);
        setSectionFilter('');
        fetchSectionsForClass(selectedClass);
    };

    const handleSectionFilterChange = (e) => {
        setSectionFilter(e.target.value);
    };

    const handleSearch = () => {
        if (!classFilter || !sectionFilter) {
            showToast('Please select both class and section', 'error');
            return;
        }
        if (!selectedTemplate) {
            showToast('Please select a template first', 'error');
            return;
        }
        fetchFilteredStudents();
    };

    const fetchFilteredStudents = async () => {
        try {
            setLoading(true);
            const result = await getService(`${apiName.getStudentByExam}/${classFilter}/${sectionFilter}`);
            setStudents(result);
            setLoading(false);
        } catch (error) {
            showToast('Error fetching filtered students', 'error');
            setLoading(false);
        }
    };

    const handleStudentSelect = (e, studentId) => {
        if (e.target.checked) {
            setSelectedStudents([...selectedStudents, studentId]);
        } else {
            setSelectedStudents(selectedStudents.filter(id => id !== studentId));
        }
    };

    const renderStudentList = () => {
        const handleSelectAll = (e) => {
            if (e.target.checked) {
                // Select all students
                setSelectedStudents(students.map((student) => student._id));
            } else {
                // Deselect all students
                setSelectedStudents([]);
            }
        };

        const isAllSelected = students.length > 0 && selectedStudents.length === students.length;

        return (
            <div className="container mx-auto p-4">
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600">
                                <th className="py-3 px-6 text-left text-sm font-semibold">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                        className="form-checkbox"
                                    />
                                </th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">Admission Number</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">Roll Number</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">First Name</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">Last Name</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">Class</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">Section</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student._id} className="border-b hover:bg-gray-50 transition duration-200">
                                    <td className="px-4 py-2 text-sm text-gray-800">
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.includes(student._id)}
                                            onChange={(e) => handleStudentSelect(e, student._id)}
                                            className="form-checkbox"
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.admission_Number}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.roll_Number}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.first_Name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.last_Name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.class_Id?.name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.section}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };


    const generateMultipleIdCardPdf = async () => {
        const selectedStudentData = students.filter(student => selectedStudents.includes(student._id));
        const blob = await pdf(
            <Document>
                {selectedStudentData.map((student, index) => (
                    <Page
                        size={selectedTemplate === 'portrait' ? 'A6' : 'A6'}
                        orientation={selectedTemplate === 'portrait' ? 'portrait' : 'landscape'}
                        key={index}
                        style={selectedTemplate === 'portrait' ? styles.portraitPage : styles.landscapePage}
                    >
                        <View style={styles.card}>
                            {/* Header */}
                            <View style={styles.header}>
                                <Text style={styles.schoolName}>Vision Public School</Text>
                            </View>

                            {/* Profile and Student Details Section */}
                            <View style={styles.body}>
                                <View style={styles.profileSection}>
                                    <Image
                                        src={student.student_Photo || '/default-photo.jpg'}
                                        style={styles.profileImage}
                                    />
                                    <View style={styles.detailsSection}>
                                        <Text style={styles.studentName}>{student.first_Name} {student.last_Name}</Text>
                                        <Text style={styles.studentId}>ID: {student.admission_Number}</Text>
                                        <Text style={styles.studentRoll}>Roll No: {student.roll_Number}</Text>
                                    </View>
                                </View>

                                {/* Class, Section, Address, and DOB */}
                                <View style={styles.extraInfo}>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Class:</Text>
                                        <Text style={styles.value}>{student.class_Id?.name}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Section:</Text>
                                        <Text style={styles.value}>{student.section}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Address:</Text>
                                        <Text style={styles.value}>{student.permanent_Address || 'Not Available'}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>DOB:</Text>
                                        <Text style={styles.value}>{moment(student?.date_Of_Birth).format('DD MMMM, YYYY') || 'Not Available'}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Footer */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Valid for the Academic Year 2024-2025</Text>
                            </View>
                        </View>
                    </Page>
                ))}
            </Document>
        ).toBlob();

        saveAs(blob, `Student_ID_Cards_${moment().format('YYYYMMDD')}.pdf`);
    };


    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setTemplateModalOpen(false); // Close the modal
    };

    return (
        <div className="container mx-auto p-4">
            {loading ? (
                <Loader />
            ) : (
                <div>
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-800">Student IdCard</h1>
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
                                <option key={classItem?._id} value={classItem._id}>
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
                        <button
                            onClick={() => setTemplateModalOpen(true)} // Open the template selection modal
                            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300"
                        >
                            Select Template
                        </button>

                        <button
                            onClick={handleSearch}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Search
                        </button>

                        <button
                            onClick={() => {
                                setClassFilter('');
                                setSectionFilter('');
                                setSearchText('');
                            }}
                            className="px-6 py-3 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition duration-300"
                        >
                            Clear Filters
                        </button>

                        {/* Select Template Button */}

                    </div>

                    {/* Student List */}
                    {students.length !== 0 && (
                        <div className="mt-6">{renderStudentList()}</div>
                    )}

                    {selectedStudents.length > 0 && (
                        <button
                            onClick={generateMultipleIdCardPdf}
                            className="px-6 py-3 mt-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                        >
                            <FaDownload className="mr-2" /> Download Selected ID Cards
                        </button>
                    )}
                </div>
            )}

            {/* Template Modal */}
            <TemplateModal
                selectedTemplate={selectedTemplate}
                open={templateModalOpen}
                onClose={() => setTemplateModalOpen(false)}
                onSelectTemplate={handleTemplateSelect}
            />
        </div>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        border: '1px solid #ccc',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        height: '100%',
        width: '100%',
    },
    header: {
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    schoolName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    body: {
        marginTop: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileSection: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        border: '3px solid #2C3E50',
        marginRight: 20,
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    },
    detailsSection: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    studentName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    studentId: {
        fontSize: 14,
        color: '#7F8C8D',
    },
    studentRoll: {
        fontSize: 14,
        color: '#7F8C8D',
    },
    extraInfo: {
        marginTop: 15,
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        width: '100%',
    },
    label: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#34495E',
    },
    value: {
        fontSize: 14,
        color: '#7F8C8D',
    },
    footer: {
        marginTop: 20,
        textAlign: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#BDC3C7',
    },

    // Styles for portrait layout
    portraitPage: {
        width: '100%',
        padding: 10,
    },
    // Styles for landscape layout
    landscapePage: {
        width: '100%',
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
    },

    // Ensuring full width usage in landscape
    landscapeCard: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        border: '1px solid #ccc',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
});

export default StudentIDCard;
