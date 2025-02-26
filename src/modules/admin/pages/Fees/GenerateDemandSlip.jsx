import React, { useEffect, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import { getService } from '../../../../constants/Service';
import { pdf, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import apiName from '../../../../constants/ApiName';
import { showToast } from '../../../../components/Toast';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../../components/Loader';
import moment from 'moment';

const GenerateDemandSlip = () => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]); // Classes for dropdown
    const [sections, setSections] = useState([]); // Sections for dropdown based on selected class
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]); // For tracking selected students
    const [classFilter, setClassFilter] = useState('');
    const [sectionFilter, setSectionFilter] = useState('');
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetchClasses();
    }, []);

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
        const classSelected = classes.find(classItem => classItem._id === classId);
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
            const result = await getService(`${apiName.getStudentByExam}/${classFilter}/${sectionFilter}`);
            setStudents(result);
            setLoading(false);
        } catch (error) {
            showToast('Error fetching filtered students', 'error');
        }
    };

    // Toggle selection of a student
    const toggleStudentSelection = (studentId) => {
        setSelectedStudents((prevSelected) =>
            prevSelected.includes(studentId)
                ? prevSelected.filter((id) => id !== studentId)
                : [...prevSelected, studentId]
        );
    };

    // Generate PDF for all selected students
    const generateSelectedStudentsPdf = async () => {
        const selectedStudentData = students.filter((student) =>
            selectedStudents.includes(student._id)
        );
        const blob = await pdf(
            <Document>
                {selectedStudentData.map((student) => (
                    <Page key={student._id} size="A4" style={styles.page}>
                        <View style={styles.container}>
                            <View style={styles.header}>
                                <Text style={styles.schoolName}>Vision Public School</Text>
                                <Text style={styles.subHeader}>Fee Demand Slip</Text>
                            </View>
                            <View style={styles.detailsContainer}>
                                <View style={styles.row}><Text style={styles.label}>SID:</Text><Text>{student.admission_Number}</Text></View>
                                <View style={styles.row}><Text style={styles.label}>Name:</Text><Text>{student.first_Name} {student.last_Name}</Text></View>
                                <View style={styles.row}><Text style={styles.label}>Father:</Text><Text>{student.father_Name}</Text></View>
                                <View style={styles.row}><Text style={styles.label}>Mobile:</Text><Text>{student.mobile_Number}</Text></View>
                                <View style={styles.row}><Text style={styles.label}>Class:</Text><Text>{student.class_Id?.name}</Text></View>
                                <View style={styles.row}><Text style={styles.label}>Section:</Text><Text>{student.section}</Text></View>
                                <View style={styles.row}><Text style={styles.label}>Date:</Text><Text>{moment().format('DD MMM YYYY')}</Text></View>
                            </View>
                            <View style={styles.feeContainer}>
                                <Text style={styles.feeHeader}>Due Months:</Text>
                                <Text style={styles.months}>Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec, Jan, Feb, Mar</Text>
                                <View style={styles.feeRow}><Text style={styles.feeLabel}>Transport Fee (Kasimabad):</Text><Text>5500</Text></View>
                                <View style={styles.feeRow}><Text style={styles.feeLabel}>Total Fee Due:</Text><Text>5500</Text></View>
                            </View>
                            <View style={styles.reminder}>
                                <Text>Rs. Five Thousand, Five Hundred only</Text>
                                <Text>Kindly pay the fee before 15th of this month</Text>
                            </View>
                            <View style={styles.footer}>
                                <Image src="/school-stamp.png" style={styles.stamp} />
                                <Text style={styles.sign}>School’s Sign & Stamp</Text>
                            </View>
                        </View>
                    </Page>
                ))}
            </Document>
        ).toBlob();
        saveAs(blob, `Demand_Slips_${selectedStudentData.length}Students.pdf`);
    };

    // Render student list with checkboxes for selection
    const renderStudentList = () => {
        return (
            <div className="container mx-auto p-4">
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600">
                                <th className="py-3 px-6 text-left text-sm font-semibold">Select</th>
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
                                            onChange={() => toggleStudentSelection(student._id)}
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

    return (
        <div className="container mx-auto p-4">
            {loading ? (
                <Loader />
            ) : (
                <div>
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-800">Generate Demand Slip</h1>
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
                            onClick={handleSearch}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Search
                        </button>

                        {/* Clear Filter Button */}
                        <button
                            onClick={() => {
                                // Reset filters
                                setClassFilter('');   // Reset class filter
                                setSectionFilter(''); // Reset section filter
                                // You can reset any other related states here
                            }}
                            className="px-6 py-3 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition duration-300"
                        >
                            Clear Filters
                        </button>
                    </div>


                    {/* Students List */}
                    {students.length !== 0 && (
                        <div className="mt-6">{renderStudentList()}</div>
                    )}

                    {/* Download Button */}
                    {selectedStudents.length > 0 && (
                        <button
                            onClick={generateSelectedStudentsPdf}
                            className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                        >
                            Download Selected Demand Slips
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

const styles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: '#eaf1f9'
    },
    container: {
        padding: 25,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#1c2534',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    },
    header: {
        textAlign: 'center',
        padding: 15,
        backgroundColor: '#0047AB',
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        borderRadius: 8,
    },
    subHeader: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
        letterSpacing: 1.2
    },
    detailsContainer: {
        marginVertical: 15,
        paddingLeft: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
        fontSize: 16,
    },
    label: {
        fontWeight: 'bold',
        color: '#1c2534'
    },
    feeContainer: {
        marginVertical: 15,
        padding: 12,
        borderWidth: 1,
        borderColor: '#1c2534',
        borderRadius: 8
    },
    feeHeader: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#0047AB',
        marginBottom: 8,
    },
    months: {
        color: '#ff4f58',
        fontSize: 14,
        marginBottom: 10
    },
    feeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        fontSize: 16
    },
    feeLabel: {
        fontWeight: 'bold',
    },
    reminder: {
        marginVertical: 12,
        textAlign: 'center',
        fontSize: 14,
        color: '#1c2534',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
    },
    stamp: {
        width: 60,
        height: 60,
        objectFit: 'contain'
    },
    sign: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0047AB',
    }
});

export default GenerateDemandSlip;
