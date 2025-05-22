import React, { useEffect, useState } from 'react';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import apiName from '../../../../constants/ApiName'; // Importing API Names
import { showToast } from '../../../../components/Toast'; // Show Toast Notifications
import Loader from '../../../../components/Loader';
import moment from 'moment';
import { getService } from '../../../../constants/Service';
import { BASE_URL } from '../../../../constants/Config';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../components/ui/table/index';
import Select from '../../../../components/form/Select';
import Button from '../../../../components/ui/button/Button';
import Checkbox from '../../../../components/form/input/Checkbox';
import { useUserContext } from '../../../../context/UserContext';
import DatePicker from '../../../../components/form/date-picker';
const GenerateDemandSlip = () => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]); // Classes for dropdown
    const [sections, setSections] = useState([]); // Sections for dropdown based on selected class
    const { school } = useUserContext();
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]); // For tracking selected students
    const [classFilter, setClassFilter] = useState('');
    const [sectionFilter, setSectionFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectAll, setSelectAll] = useState(false); // New state for "Select All" checkbox
    const [feeDetails, setFeeDetails] = useState([]);
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
        const selectedClass = e;
        setClassFilter(selectedClass);
        setSectionFilter(''); // Reset section filter
        fetchSectionsForClass(selectedClass); // Fetch sections for the selected class
    };

    // Handle section filter change
    const handleSectionFilterChange = (e) => {
        setSectionFilter(e);
    };

    // Handle search button click
    const handleSearch = (e) => {
        e.preventDefault()
        if (!classFilter || !sectionFilter || !startDate || !endDate) {
            showToast('Please select all fields', 'error')
            return
        }
        fetchFilteredStudents();
        getStudentFeeByClass()
    };
    // Fetch filtered students based on filters (Class, Section, and Search Text)
    const fetchFilteredStudents = async () => {
        try {
            const result = await getService(`${apiName.getStudentByExam}/${classFilter}/${sectionFilter}`);
            setStudents(result);
            setLoading(false);
        } catch (error) {
            showToast('Error fetching filtered students', 'error');
        }
    };
    const getStudentFeeByClass = async () => {
        try {
            const result = await getService(`${apiName.dueFees}/${classFilter}/${sectionFilter}/${endDate}`);
            console.log('bckvbkcbc', result)
            setFeeDetails(result)
        } catch (error) {
            showToast('Error fetching filtered students', 'error');
        }
    };

    const toggleStudentSelection = (studentId) => {
        setSelectedStudents((prevSelected) =>
            prevSelected.includes(studentId)
                ? prevSelected.filter((id) => id !== studentId)
                : [...prevSelected, studentId]
        );
    };

    // Toggle select all checkbox
    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(students.map(student => student._id));
        }
        setSelectAll(!selectAll);
    };

    // Generate PDF for all selected students
    const generateSelectedStudentsPdf = async () => {
        const selectedStudentData = feeDetails.filter((student) =>
            selectedStudents.includes(student.studentId)
        );
        { console.log('selectedStudentData', selectedStudentData) }
        const blob = await pdf(
            <Document>
                {selectedStudentData.map((student) => (
                    <Page key={student.studentId} size="A4" style={styles.page}>
                        <View style={styles.container}>
                            {/* Header Section */}
                            <View style={styles.header}>
                                <Text style={styles.headerText}>{school?.name}</Text>
                                <Text style={styles.subHeaderText}>Fee Demand Slip</Text>
                            </View>

                            {/* Introduction */}
                            <Text style={styles.introText}>Please deposit the following fee for your child</Text>

                            {/* Student Details Section */}
                            <View style={styles.detailsContainer}>
                                <View style={{ width: '50%' }}>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>SID:</Text>
                                        <Text style={styles.value}>{student.studentDetails?.admission_Number}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Name:</Text>
                                        <Text style={styles.value}>{student?.studentDetails?.first_Name} {student?.studentDetails.last_Name}</Text>
                                    </View>
                                    {student?.studentDetails?.father_Name && (
                                        <View style={styles.row}>
                                            <Text style={styles.label}>Father:</Text>
                                            <Text style={styles.value}>{student?.studentDetails?.father_Name}</Text>
                                        </View>
                                    )}
                                    {student?.studentDetails?.contact_Number && (
                                        <View style={styles.row}>
                                            <Text style={styles.label}>Mobile:</Text>
                                            <Text style={styles.value}>{student?.studentDetails?.contact_Number}</Text>
                                        </View>
                                    )}
                                </View>

                                <View style={{ width: '50%' }}>
                                    {student?.studentDetails?.roll_Number && (
                                        <View style={styles.row}>
                                            <Text style={styles.label}>Roll:</Text>
                                            <Text style={styles.value}>{student?.studentDetails?.roll_Number}</Text>
                                        </View>
                                    )}
                                    {student?.studentDetails?.class_Id?.name && (
                                        <View style={styles.row}>
                                            <Text style={styles.label}>Class:</Text>
                                            <Text style={styles.value}>{student?.studentDetails?.class_Id?.name}</Text>
                                        </View>
                                    )}
                                    {student?.studentDetails?.section && (
                                        <View style={styles.row}>
                                            <Text style={styles.label}>Section:</Text>
                                            <Text style={styles.value}>{student?.studentDetails?.section}</Text>
                                        </View>
                                    )}
                                    {student?.studentDetails?.date_Of_Admission && (
                                        <View style={styles.row}>
                                            <Text style={styles.label}>Date:</Text>
                                            <Text style={styles.value}>{moment(student?.studentDetails?.date_Of_Admission).format('DD/MM/YYYY')}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Fee Details Table */}
                            <View style={styles.feeTable}>
                                {/* Table Header */}
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <Text style={{ width: '50%', fontFamily: 'RobotoB', textAlign: 'center', borderTopWidth: 1, borderLeftWidth: 1, fontSize: 17, paddingVertical: 5, borderBottomWidth: 1, }}>
                                        Details
                                    </Text>
                                    <Text style={{ width: '50%', fontFamily: 'RobotoB', textAlign: 'center', borderTopWidth: 1, borderLeftWidth: 1, fontSize: 17, paddingVertical: 5, borderBottomWidth: 1, borderRightWidth: 1 }}>
                                        Amount
                                    </Text>
                                </View>
                                {console.log('feeDetails?.dueFees', student)}
                                {/* Table Rows */}
                                {
                                    student?.dueFees?.length == 0 ?

                                        <View style={{ width: '100%', fontFamily: 'RobotoR', textAlign: 'center', borderLeftWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, fontSize: 15, paddingVertical: 5 }}>
                                            <Text>No dues</Text>
                                        </View>
                                        :
                                        student?.dueFees?.map((item, index) => (
                                            <View key={index} style={{ flexDirection: 'row' }}>
                                                <Text style={{ width: '50%', fontFamily: 'RobotoR', textAlign: 'center', borderLeftWidth: 1, borderBottomWidth: 1, fontSize: 15, paddingVertical: 5 }}>
                                                    {item.feeType}
                                                </Text>
                                                <Text style={{ width: '50%', fontFamily: 'RobotoR', textAlign: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, fontSize: 15, paddingVertical: 5 }}>
                                                    Rs. {item.amountDue}
                                                </Text>
                                            </View>
                                        ))
                                }
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ width: '50%', fontFamily: 'RobotoB', textAlign: 'center', borderLeftWidth: 1, borderBottomWidth: 1, fontSize: 15, paddingVertical: 5 }}>
                                        Total Fee Due
                                    </Text>
                                    <Text style={{ width: '50%', fontFamily: 'RobotoB', textAlign: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, fontSize: 15, paddingVertical: 5 }}>
                                        Rs. {student?.totalDue}
                                    </Text>
                                </View>
                            </View>


                            {/* Reminder */}
                            <View style={styles.reminder}>
                                <Text style={styles.reminderText}>Kindly pay the fee before the 15th of this month</Text>
                            </View>

                            {/* Footer */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>School’s Sign & Stamp</Text>
                            </View>
                        </View>
                    </Page>
                ))}
            </Document>

        ).toBlob();
        saveAs(blob, `Demand_Slips_${selectedStudentData.length}Students.pdf`);
        generateUrl(blob)
    };

    const generateUrl = async (blob) => {
        console.log('Uploading Blob', blob);

        // Prepare FormData to send the blob to the server
        const formData = new FormData();
        formData.append('file', blob, 'Demand_Slips.pdf');  // 'file' matches the multer field name

        try {
            // Post the FormData to the server's /upload-pdf endpoint
            const response = await fetch(`${BASE_URL}${apiName.uploadCard}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload PDF');
            }
            const responseData = await response.json();
            window.ReactNativeWebView.postMessage(responseData.pdfUrl);
            console.log('Uploaded successfully:', responseData);
        } catch (error) {
            console.error('Error uploading PDF:', error);
        }
    };

    // Render student list with checkboxes for selection
    const renderStudentList = () => {
        return (
            <div className="container mx-auto p-4">
                <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow-md rounded-lg">
                    {students.length === 0 ? (
                        <p style={{ textAlign: 'center', margin: 10 }} className="text-gray-700 dark:text-white">No students found</p>
                    ) : (
                        <Table className="w-full text-left border-collapse">
                            <TableHeader className='bg-gray-100 dark:bg-gray-800'>
                                <TableRow>
                                    <th className='px-5 py-3 font-medium text-gray-500 text-left'>
                                        <Checkbox
                                            checked={selectAll}
                                            onChange={toggleSelectAll}
                                        />
                                    </th>
                                    {['Admission Number', 'Roll Number', 'Name', 'Class', 'Section'].map((header) => (
                                        <th key={header} className="px-5 py-3 font-medium text-gray-500 text-left dark:text-white">{header}</th>
                                    ))}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {students?.map((student) => (
                                    <TableRow
                                        className='border-gray-200 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800'
                                        key={student._id}
                                    >
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                            <Checkbox
                                                id={student}
                                                checked={selectedStudents.includes(student._id)}
                                                onChange={() => toggleStudentSelection(student._id)}
                                            />
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                            {student?.admission_Number}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                            {student?.roll_Number}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                            <button
                                                onClick={() => navigate(`/admin/student/student-details/${student?._id}`)} // Navigate to student details page
                                                className="text-blue-500 hover:text-blue-700 transition duration-200 dark:text-blue-400 dark:hover:text-blue-500"
                                            >
                                                {student?.first_Name} {student?.last_Name}
                                            </button>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                            {student?.class_Id?.name}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                            {student?.section}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        );
    };


    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700">
            <div className='w-full p-4 flex justify-between items-center'>
                <div className='text-3xl font-medium text-gray-800 dark:text-white'>Generate Demand Slips</div>
            </div>
            {loading ? (
                <Loader />
            ) : (
                <div>
                    {/* Filters */}
                    <div className="grid grid-cols-2 p-4 gap-x-6 gap-y-5 lg:grid-cols-4">
                        <Select
                            placeholder='Filter by Class'
                            options={classes.map((classItem) => ({
                                value: classItem._id,
                                label: classItem.name,
                            }))}
                            value={classFilter}
                            onChange={handleClassFilterChange}
                            className="bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600"
                        />
                        <Select
                            placeholder='Filter by Section'
                            options={sections.map((section) => ({
                                value: section,
                                label: section,
                            }))}
                            value={sectionFilter}
                            onChange={handleSectionFilterChange}
                            disabled={!classFilter}
                            className="bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600"
                        />
                        {/* <Input
                        type="date"
                        onChange={(e) =>
                            handleStartDateChange(e.target.value)
                        }
                        className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-700 text-black dark:text-white dark:border-gray-600"
                    /> */}
                        <DatePicker
                            id="startDate"
                            placeholder="Select a date"
                            onChange={(date) => {
                                // handleStartDateChange(moment(date[0]).format('YYYY/MM/DD'))
                                setStartDate(date[0]).format('YYYY/MM/DD');
                            }}
                            // defaultDate={formData.date_Of_Birth !== '' ? formData.date_Of_Birth.split('T')[0] : new Date().toISOString().split('T')[0]}
                            mode="single" // or "range", "multiple", "time"
                            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-700 text-black dark:text-white dark:border-gray-600"
                        />
                        <DatePicker
                            id="startDate"
                            placeholder="Select a date"
                            onChange={(date) => {
                                setEndDate(date[0]).format('YYYY/MM/DD');
                                // handleEndDateChange(moment(date[0]).format('YYYY/MM/DD'))
                            }}
                            // defaultDate={formData.date_Of_Birth !== '' ? formData.date_Of_Birth.split('T')[0] : new Date().toISOString().split('T')[0]}
                            mode="single" // or "range", "multiple", "time"
                            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-700 text-black dark:text-white dark:border-gray-600"
                        />
                        {/* <Input
                        type="date"
                        onChange={(e) =>
                            handleEndDateChange(e.target.value)
                        }
                        className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-700 text-black dark:text-white dark:border-gray-600"
                    /> */}

                        <Button
                            onClick={handleSearch}
                            className="bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Search
                        </Button>
                        <Button
                            onClick={() => {
                                setClassFilter('');   // Reset class filter
                                setSectionFilter(''); // Reset section filter
                                setStudents([])
                                setStartDate('')
                                setEndDate('')
                            }}
                            className="px-6 py-3 bg-gray-200 !text-black rounded-lg hover:bg-gray-300 transition duration-300"
                        >
                            Clear Filters
                        </Button>
                        {selectedStudents.length > 0 && (
                            <Button
                                onClick={generateSelectedStudentsPdf}
                                className="bg-green-500 text-white rounded-lg hover:bg-gray-300 dark:bg-green-600 dark:hover:bg-green-500"
                            >
                                Download Demand Slips
                            </Button>
                        )}
                    </div>

                    {/* Students List */}
                    <div className="mt-6">{renderStudentList()}</div>

                    {/* Download Button */}
                </div>
            )}
        </div>

    );
};

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#fff',
    },
    container: {
        padding: 15,
        borderColor: '#ddd',
        borderWidth: 1,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    },
    header: {
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'black',
        paddingVertical: 25,
        paddingHorizontal: 30,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontFamily: 'RobotoB',
        fontSize: 30,
        color: 'black',
        letterSpacing: 2,
    },
    subHeaderText: {
        fontFamily: 'RobotoM',
        fontSize: 20,
        color: '#F5A623',
        fontWeight: 'bold',
        marginTop: 10,
        letterSpacing: 1.5,
    },
    introText: {
        textAlign: 'center',
        fontFamily: 'RobotoR',
        fontSize: 16,
        marginVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 10,
    },
    detailsContainer: {
        flexDirection: 'row',
        marginVertical: 15,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    label: {
        width: '35%',
        fontFamily: 'RobotoB',
        color: '#1c2534',
        fontSize: 16,
    },
    value: {
        width: '65%',
        fontFamily: 'RobotoR',
        marginLeft: 10,
        fontSize: 16,
    },
    feeContainer: {
        flexDirection: 'row',
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    feeHeader: {
        width: '20%',
        fontFamily: 'RobotoB',
        fontSize: 16,
        color: '#333',
    },
    months: {
        width: '75%',
        fontFamily: 'RobotoB',
        fontSize: 14,
        color: '#ff4f58',
    },
    feeTable: {
        marginVertical: 20,
        paddingHorizontal: 15,
    },
    feeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    feeLabel: {
        fontFamily: 'RobotoB',
        fontSize: 17,
        textAlign: 'left',
    },
    feeAmount: {
        fontFamily: 'RobotoR',
        fontSize: 17,
        textAlign: 'right',
    },
    amountInWords: {
        fontFamily: 'RobotoR',
        fontSize: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    reminder: {
        backgroundColor: '#f0f4f8',
        paddingVertical: 15,
        marginVertical: 20,
        alignItems: 'center',
    },
    reminderText: {
        fontFamily: 'RobotoR',
        fontSize: 15,
        color: '#1c2534',
    },
    footer: {
        alignItems: 'flex-end',
        marginTop: 40,
        marginRight: 20,
    },
    footerText: {
        fontFamily: 'RobotoB',
        fontSize: 14,
        color: '#333',
    },
});


export default GenerateDemandSlip;
