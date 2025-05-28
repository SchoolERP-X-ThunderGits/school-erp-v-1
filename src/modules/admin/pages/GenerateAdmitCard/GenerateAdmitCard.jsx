import React, { useEffect, useState } from 'react';
import { FaDownload, FaCheckCircle } from 'react-icons/fa';
import { pdf, Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import apiName from '../../../../constants/ApiName'; // Importing API Names
import { showToast } from '../../../../components/Toast'; // Show Toast Notifications
import Loader from '../../../../components/Loader';
import moment from 'moment';
import { getService, postService } from '../../../../constants/Service';
import { useUserContext } from '../../../../context/UserContext';
import { BASE_URL } from '../../../../constants/Config';
import images from '../../../../constants/Images';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../../../components/ui/modal';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../components/ui/table/index';
import Select from '../../../../components/form/Select';
import Button from '../../../../components/ui/button/Button';
import Checkbox from '../../../../components/form/input/Checkbox';
import { sessionsArray } from '../../../../constants/GlobalConstants';

const GenerateAdmitCard = () => {
    const [classes, setClasses] = useState([]);
    const [exams, setExams] = useState([]);
    const { school } = useUserContext();
    const [selectedClass, setSelectedClass] = useState('');
    const [examSchedule, setExamSchedule] = useState([]);
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedSession, setSelectedSession] = useState('');
    const [students, setStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([])
    const [selectedStudents, setSelectedStudents] = useState([]);  // Track selected students
    const [loading, setLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false)
    const [sections, setSections] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        fetchStudents()
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
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
    const fetchStudents = async () => {
        try {
            const result = await getService(apiName.getStudent); // API to get students
            setAllStudents(result);
            setLoading(false);
        } catch (error) {
            showToast('Error fetching students', 'error');
        }
    };

    const handleSearchStudents = async (e) => {
        e.preventDefault()
        fetchExamSchedule();
        if (!selectedClass || !selectedSection || !selectedExam || !selectedSession) {
            showToast('Please select all fields', 'error');
            return;
        }
        try {
            const response = await getService(`${apiName.getStudentByExam}/${selectedClass}/${selectedSection}/${selectedSession}`);
            console.log('responsemvmbmvbmvmb', response)
            setStudents(response);
        } catch (error) {
            console.log('lbvlbvlb', error)
            showToast('Error fetching students', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectStudent = (studentId) => {
        setSelectedStudents((prev) => {
            if (prev.includes(studentId)) {
                return prev.filter(id => id !== studentId);
            } else {
                return [...prev, studentId];
            }
        });
    };

    const handleSelectAllStudents = () => {
        if (selectedStudents.length === students.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(students.map(student => student._id));
        }
    };

    const fetchSectionsForClass = (classId) => {
        const classSelected = classes.find(classItem => classItem._id === classId);
        if (classSelected) {
            setSections(classSelected.sections); // sections associated with the selected class
        }
    };

    const handleGenerateAdmitCardForSelected = async (forAll) => {
        setDownloadLoading(true)
        const selectedStudentData = forAll ? allStudents : students.filter(student => selectedStudents.includes(student._id));
        if (!forAll && selectedStudentData.length === 0) {
            showToast('No students selected', 'error');
            return;
        }
        const blob = await pdf(
            <Document>
                {selectedStudentData.map((student) => (
                    <Page size="A4" style={styles.page} key={student._id}>
                        <View style={[styles.header, { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'black', justifyContent: 'space-between' }]}>
                            <View style={{ width: '10%' }}>
                                <Image style={{ width: 50, height: 50 }} src={school?.logo} />
                            </View>
                            <View style={{ width: '80%' }}>

                                <Text style={styles.title}>{school?.name}</Text>
                                <Text style={{ fontFamily: 'RobotoR', fontSize: 14, marginTop: 5 }}>{school?.address}</Text>
                                {console.log('examSchedule', examSchedule)}
                                <Text style={{ fontFamily: 'RobotoR', fontSize: 14 }}>{examSchedule[0]?.examName?.name}, {examSchedule[0]?.examName?.session}</Text>
                            </View>
                            <View style={{ width: '8%' }}>
                                <Image style={{ width: 50, height: 50 }} src={school?.qrCodeUrl} />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
                            <View>

                                <Text style={styles.lable}>Roll Number:   <Text style={styles.bold}>{student.roll_Number}</Text></Text>
                                <Text style={[styles.lable, { marginVertical: 5 }]}>Name:    <Text style={styles.bold}>{student.first_Name} {student?.last_Name}</Text></Text>
                                <Text style={styles.lable}>Father's Name:    <Text style={styles.bold}>{student?.father_Name}</Text></Text>
                            </View>
                            <View>

                                <Text style={styles.lable}>Admission Number:    <Text style={styles.bold}>{student.admission_Number}</Text></Text>
                                <Text style={[styles.lable, { marginVertical: 5 }]}>Class:    <Text style={styles.bold}>{student.class_Id?.name}</Text></Text>
                                <Text style={styles.lable}>D.O.B :    <Text style={styles.bold}>{moment(student.date_Of_Birth).format('DD/MM/YYYY')}</Text></Text>
                            </View>
                        </View>
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>Subject</Text>
                                <Text style={styles.tableCell}>Date</Text>
                                <Text style={styles.tableCell}>Start Time</Text>
                                <Text style={styles.tableCell}>End Time</Text>
                            </View>
                            {examSchedule.length == 0 ?
                                <Text style={{ textAlign: 'center', fontFamily: 'RobotoB' }}>No Exams</Text> :
                                examSchedule.map((exam, index) => (
                                    <View style={styles.tableRow} key={index}>
                                        {console.log('examSchedule', exam)}
                                        <Text style={styles.tableCell}>{exam.subject?.name}</Text>
                                        <Text style={styles.tableCell}>{moment(exam.date).format('DD/MM/YYYY')}</Text>
                                        <Text style={styles.tableCell}>{exam.startTime}</Text>
                                        <Text style={styles.tableCell}>{exam.endTime}</Text>
                                    </View>
                                ))}
                        </View>
                    </Page>
                ))}
            </Document>
        ).toBlob();
        saveAs(blob, `Admit_Cards_${moment().format('YYYY-MM-DD')}.pdf`);
        generateUrl(blob)
    };

    const generateUrl = async (blob) => {
        console.log('Uploading Blob', blob);
        setDownloadLoading(false)
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
            setDownloadLoading(false)
        } catch (error) {
            setDownloadLoading(false)
            console.error('Error uploading PDF:', error);
        }
    };


    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-900">
            <div className='w-full p-4 flex justify-between items-center'>
                <div className='text-3xl font-medium'>Generate Admit Cards</div>
            </div>
            {
                downloadLoading &&
                <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
                </div>
            }

            <div className="grid grid-cols-2 p-4 gap-x-6 gap-y-5 lg:grid-cols-4">
                <Select
                    placeholder='Select Class'
                    options={classes.map((classItem) => ({
                        value: classItem._id,
                        label: classItem.name,
                    }))}
                    value={selectedClass}
                    onChange={(e) => { setSelectedClass(e), fetchSectionsForClass(e) }}
                />
                <Select
                    disabled={!selectedClass}
                    placeholder='Select Section'
                    options={sections.map((section) => ({
                        value: section,
                        label: section,
                    }))}
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e)}
                />
                <Select
                    disabled={!selectedSection}
                    placeholder='Select Exam'
                    options={exams.map((exam) => ({
                        value: exam?._id,
                        label: exam?.name,
                    }))}
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e)}
                />
                <Select
                    disabled={!selectedExam}
                    placeholder='Select Session'
                    options={sessionsArray.map((session) => ({
                        value: session,
                        label: session,
                    }))}
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e)}
                />
                <Button onClick={handleSearchStudents}>
                    Search
                </Button>
                <Button
                    onClick={() => {
                        setSelectedClass('');
                        setSelectedSection('');
                        setSelectedExam('');
                        setSelectedSession('');
                        setStudents([]);
                        setSelectedStudents([]);
                    }}
                    className="px-6 py-3 bg-gray-200 !text-black rounded-lg hover:bg-gray-300 transition duration-300"
                >
                    Clear Filters
                </Button>
                <Button
                    onClick={() => {
                        handleGenerateAdmitCardForSelected(true)
                    }}
                    className=" bg-green-500 text-white text-xs rounded-lg hover:bg-gray-300 transition duration-300"
                >
                    <FaDownload className="mr-2" /> Download All Admit Cards
                </Button>
                {selectedStudents.length > 0 && (
                    <Button
                        onClick={() => {
                            handleGenerateAdmitCardForSelected()
                        }}
                        className=" bg-green-500 text-white rounded-lg hover:bg-gray-300 transition duration-300"
                    >
                        <FaDownload className="mr-2" /> Download Admit Cards
                    </Button>
                )}
            </div>

            {loading ? (
                <Loader />
            ) : (
                students.length > 0 ? (
                    <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow-md rounded-lg">
                        <Table className="w-full text-left border-collapse">
                            <TableHeader className="bg-gray-100 dark:bg-gray-800">
                                <TableRow>
                                    <th className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400 text-left">
                                        <Checkbox
                                            checked={selectedStudents.length === students.length}
                                            onChange={handleSelectAllStudents}
                                        />
                                    </th>
                                    {['Roll Number', 'Name'].map((header) => (
                                        <th
                                            key={header}
                                            className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400 text-left"
                                        >
                                            {header}
                                        </th>
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
                                                id={student._id}
                                                checked={selectedStudents.includes(student._id)}
                                                onChange={() => handleSelectStudent(student._id)}
                                            />
                                        </TableCell>

                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                            {student?.roll_Number}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                            <button
                                                onClick={() => navigate(`/admin/student/student-details/${student?._id}`)}
                                                className="text-blue-500 hover:text-blue-700 transition duration-200"
                                            >
                                                {student?.first_Name} {student?.last_Name}
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                ) : (
                    <p className="text-center text-gray-500 m-2 dark:text-gray-200">No students found</p>
                )
            )}
        </div>

    );
};

const styles = StyleSheet.create({
    page: { padding: 20 },
    header: { textAlign: 'center', marginBottom: 10 },
    title: { fontSize: 18, fontFamily: 'RobotoB', textAlign: 'center' },
    table: { display: 'table', width: '100%', borderStyle: 'solid', borderWidth: 1, marginTop: 10 },
    tableRow: { flexDirection: 'row' },
    tableCell: { flex: 1, borderWidth: 1, padding: 5, fontSize: 10 },
    lable: { fontFamily: 'RobotoR', fontSize: 14 },
    bold: { fontFamily: 'RobotoB', fontSize: 14 },
});

export default GenerateAdmitCard;
