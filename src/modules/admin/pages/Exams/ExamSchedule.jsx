import React, { useEffect, useState } from 'react';
import { getService, postService, putService, deleteService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import { Modal } from '../../../../components/ui/modal';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../components/ui/table/index';
import Button from '../../../../components/ui/button/Button';
import Input from '../../../../components/form/input/InputField';
import Label from '../../../../components/form/Label';
import { showToast } from '../../../../components/Toast';
import { Link } from 'react-router-dom';
import Select from '../../../../components/form/Select';
import "flatpickr/dist/themes/material_blue.css";
import DatePicker from "../../../../components/form/date-picker.tsx";
import moment from 'moment';
import { FaDownload } from 'react-icons/fa';
import { pdf, Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { useUserContext } from '../../../../context/UserContext.jsx';
const ExamSchedule = () => {
    const [examsList, setExamsList] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [subjectsList, setSubjectsList] = useState([]);
    const [classes, setClasses] = useState([]);
    const [examSchedules, setExamSchedules] = useState([]);
    const [examSchedulesList, setExamSchedulesList] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [examToDelete, setExamToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const { school } = useUserContext();
    const [editId, setEditId] = useState(null); // to track the schedule being edited

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
        setExamSchedulesList(result);
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
            const mapping = result.find((item) => item.class?._id === classId);
            setSubjectsList(mapping?.subjects);
        } catch (error) {
            showToast('Error fetching subjects', 'error');
        }
    };

    const handleClassChange = (event) => {
        fetchExamSchedules(selectedExam, event);
        setSelectedClass(event);
        getSubjectsByClass(event);
    };

    const handleEdit = async (schedule) => {
        setIsEditMode(true);
        setEditId(schedule._id);

        const examId = schedule.examName?._id || schedule.examNameId;
        const classId = schedule.class?._id || schedule.classId;

        setSelectedExam(examId);
        setSelectedClass(classId);

        await getSubjectsByClass(classId);

        // Pre-fill with this single schedule
        const prefilledSchedule = [{
            subjectId: schedule.subject?._id || schedule.subjectId,
            examNameId: examId,
            classId: classId,
            date: new Date(schedule.date),
            startTime: schedule.startTime,
            endTime: schedule.endTime
        }];

        setExamSchedules(prefilledSchedule);
        setShowModal(true);
    };


    const handleDelete = (examId) => {
        setExamToDelete(examId);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteService(`${apiName.addSchedule}/${examToDelete}`);
            showToast('Exam schedule deleted successfully', 'success');
            fetchExamSchedules(); // Refresh the exam list
        } catch (error) {
            showToast('Error deleting exam', 'error');
        }
        setShowDeleteModal(false); // Close the confirmation modal
        setExamToDelete(null);    // Clear the exam ID
    };


    const handleScheduleExam = async (e) => {
        e.preventDefault();

        if (!selectedExam || !selectedClass) {
            setErrorMessage('Please fill in all fields for each subject');
            return;
        }

        try {
            if (isEditMode) {
                // Update mode
                const updated = examSchedules[0]; // only one item during edit
                await putService(`${apiName.addSchedule}/${editId}`, updated);
                showToast('Exam schedule updated successfully!', 'success');
            } else {
                // Create mode
                console.log('skdfskfsfs', examSchedules)
                // for (const schedule of examSchedules) {
                await postService(apiName.addSchedule, { schedules: examSchedules });
                // }
                showToast('Exam scheduled successfully!', 'success');
            }

            // Reset modal and state
            setShowModal(false);
            setSelectedClass('');
            setSelectedExam('');
            setSubjectsList([]);
            setExamSchedules([]);
            fetchExamSchedules('', '');
            setIsEditMode(false);
            setEditId(null);
        } catch (error) {
            console.error('Error saving schedule:', error);
            showToast(error?.response?.data?.error || 'Something went wrong', 'error');
        }
    };
    const handleDateChange = (date) => {
        console.log('bcklvbcklbc', date)
        // setDateOfBirth(date[0].toLocaleDateString()); // Handle selected date and format it
    };
    const [expandedScheduleId, setExpandedScheduleId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedScheduleId(prevId => (prevId === id ? null : id));
    };
    const downloadExamSchedule = async (schedule) => {

        const blob = await pdf(
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={[styles.header, { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'black', justifyContent: 'space-between' }]}>
                        <View style={{ width: '10%' }}>
                            <Image style={{ width: 50, height: 50 }} src={school?.logo} />
                        </View>
                        <View style={{ width: '80%' }}>

                            <Text style={styles.title}>{school?.name}</Text>
                            <Text style={{ fontFamily: 'RobotoR', fontSize: 14, marginTop: 5 }}>{school?.address}</Text>
                            {console.log('examSchedule', schedule.exam)}
                            <Text style={{ fontFamily: 'RobotoR', fontSize: 14 }}>{schedule.exam[0]?.examName?.name}, {schedule.exam[0]?.examName?.session}</Text>
                        </View>
                        <View style={{ width: '8%' }}>
                            <Image style={{ width: 50, height: 50 }} src={school?.qrCodeUrl} />
                        </View>
                    </View>
                    <View>

                        <Text style={[styles.lable, { marginVertical: 5 }]}>Class:    <Text style={styles.bold}>{schedule.class?.name}</Text></Text>
                        <Text style={[styles.lable, { marginVertical: 5 }]}>Section:    <Text style={styles.bold}>{schedule.class?.sections.map(i => i.name).join(', ')}</Text></Text>
                    </View>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Subject</Text>
                            <Text style={styles.tableCell}>Date</Text>
                            <Text style={styles.tableCell}>Start Time</Text>
                            <Text style={styles.tableCell}>End Time</Text>
                        </View>
                        {schedule.exam.length == 0 ?
                            <Text style={{ textAlign: 'center', fontFamily: 'RobotoB' }}>No Exams</Text> :
                            schedule.exam.map((exam, index) => (
                                <View style={styles.tableRow} key={index}>
                                    <Text style={styles.tableCell}>{exam.subject?.name}</Text>
                                    <Text style={styles.tableCell}>{moment(exam.date).format('DD/MM/YYYY')}</Text>
                                    <Text style={styles.tableCell}>{exam.startTime}</Text>
                                    <Text style={styles.tableCell}>{exam.endTime}</Text>
                                </View>
                            ))}
                    </View>
                </Page>
            </Document>
        ).toBlob();
        saveAs(blob, `Exam_schedule${moment().format('DD-MM-YYYY')}.pdf`);
        generateUrl(blob)
    };
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-900">
            <div className='w-full p-4 flex justify-between items-center'>
                <div className='text-3xl font-medium text-gray-800 dark:text-white'>Schedule Exams List</div>
                <Button onClick={() => {
                    setShowModal(true), setErrorMessage(''),
                        setSelectedClass('');
                    setSelectedExam('');
                    setSubjectsList([]);
                    setExamSchedules([]);
                    fetchExamSchedules('', '');
                    setIsEditMode(false);
                    setEditId(null);
                }} className="text-white bg-blue-500 hover:bg-blue-600">
                    <Link>Schedule Exam</Link>
                </Button>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow-md rounded-lg">
                <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg mt-4">
                    {examSchedulesList.length === 0 ?
                        <p style={{ textAlign: 'center', margin: 10 }} className="text-gray-700 dark:text-gray-300">No exams schedule found</p> :
                        <Table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 dark:bg-gray-800">
                                <tr>
                                    {['Exam Name', 'Subjects', 'Class', 'Action'].map((header) => (
                                        <th key={header} className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400 text-left">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {examSchedulesList.map((schedule) => (
                                    <React.Fragment key={schedule.class._id}>
                                        <tr
                                            className="border-gray-200 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                                            onClick={() => toggleExpand(schedule.class._id)}
                                        >
                                            <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                                                {schedule.exam[0]?.examName?.name}
                                            </td>
                                            <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                                                {schedule.exam.map((e) => e.subject.name).join(', ')}
                                            </td>
                                            <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                                                {schedule.class?.name}
                                            </td>
                                            <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                                                {/* Action can be edit/delete buttons if needed */}
                                                <Link onClick={() => downloadExamSchedule(schedule)}>
                                                    <FaDownload className='text-gray-700 dark:text-white hover:text-red-500 dark:hover:text-red-400' />
                                                </Link>
                                            </td>
                                        </tr>

                                        {/* Expanded section */}
                                        {expandedScheduleId === schedule.class._id && (
                                            <tr>
                                                <td colSpan={4} className="bg-gray-50 dark:bg-gray-700 px-5 py-4">
                                                    <table className="min-w-full table-auto bg-white dark:bg-gray-600">
                                                        <thead className="bg-gray-200 dark:bg-gray-800">
                                                            <tr>
                                                                {['Exam Date', 'Start Time', 'End Time', 'Subject', 'Session'].map((header) => (
                                                                    <th
                                                                        key={header}
                                                                        className="px-5 py-3 font-medium text-gray-500 dark:text-gray-300 text-left"
                                                                    >
                                                                        {header}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {schedule.exam.map((examItem) => (
                                                                <tr
                                                                    key={examItem._id}
                                                                    className="border-t border-gray-200 dark:border-gray-900"
                                                                >
                                                                    <td className="px-5 py-2 text-gray-700 dark:text-gray-300">
                                                                        {new Date(examItem.date).toLocaleDateString()}
                                                                    </td>
                                                                    <td className="px-5 py-2 text-gray-700 dark:text-gray-300">
                                                                        {examItem.startTime}
                                                                    </td>
                                                                    <td className="px-5 py-2 text-gray-700 dark:text-gray-300">
                                                                        {examItem.endTime}
                                                                    </td>
                                                                    <td className="px-5 py-2 text-gray-700 dark:text-gray-300">
                                                                        {examItem.subject.name}
                                                                    </td>
                                                                    <td className="px-5 py-2 text-gray-700 dark:text-gray-300">
                                                                        {examItem.examName.session}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </Table>}
                </div>
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setErrorMessage('');
                    fetchExamSchedules('', '');
                }}
                className="max-w-[1000px] m-4"
            >
                <div className={`relative w-full max-w-[1000px] ${selectedClass ? 'h-[90vh]' : 'h-auto'} flex flex-col rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11`}>
                    {/* Header */}
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Schedule Exam
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Schedule exams here for selected subjects.
                        </p>
                    </div>

                    {/* Scrollable Content */}
                    <form className="flex flex-col flex-1 overflow-hidden">
                        <div className="custom-scrollbar flex-1 overflow-y-auto px-2 pb-3">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Select Exam</Label>
                                    <Select
                                        placeholder="Select exam"
                                        options={examsList.map((exam) => ({
                                            value: exam?._id,
                                            label: exam?.name,
                                        }))}
                                        value={selectedExam}
                                        onChange={(e) => {
                                            setSelectedExam(e);
                                            fetchExamSchedules(e, selectedClass);
                                        }}
                                    />
                                </div>
                                <div className="mt-6">
                                    <Select
                                        placeholder="Select Class"
                                        options={classes.map((cls) => ({
                                            value: cls?._id,
                                            label: cls?.name,
                                        }))}
                                        value={selectedClass}
                                        onChange={handleClassChange}
                                        disabled={!selectedExam}
                                    />
                                </div>
                            </div>

                            {/* Subjects Table */}
                            {selectedClass && subjectsList?.length !== 0 ? (
                                <div className="mb-4">
                                    <Label className="block text-sm font-medium text-gray-600 mt-4 mb-4">
                                        Subjects for Selected Class
                                    </Label>
                                    <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
                                        <Table className="min-w-full table-auto">
                                            <TableHeader>
                                                <TableRow className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
                                                    <th className="py-3 px-6 text-left text-sm font-semibold">Subject Name</th>
                                                    <th className="py-3 px-6 text-left text-sm font-semibold">Select Date</th>
                                                    <th className="py-3 px-6 text-left text-sm font-semibold">Start Time</th>
                                                    <th className="py-3 px-6 text-left text-sm font-semibold">End Time</th>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {subjectsList?.map((subject, index) => (
                                                    <TableRow
                                                        key={subject.subjectId}
                                                        className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
                                                    >
                                                        <TableCell className="py-3 px-6 text-sm text-gray-800 dark:text-gray-200">
                                                            {subject.name}
                                                        </TableCell>
                                                        <TableCell className="py-3 px-6">
                                                            <DatePicker
                                                                id="startDate"
                                                                placeholder="Select a date"
                                                                onChange={(date) => {
                                                                    handleInputChange(
                                                                        index,
                                                                        'date',
                                                                        moment(date[0]).format('DD/MM/YYYY'),
                                                                        subject._id
                                                                    );
                                                                }}
                                                                mode="single"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="py-3 px-6">
                                                            <Input
                                                                placeholder="HH:MM"
                                                                type="time"
                                                                value={examSchedules[index]?.startTime || ''}
                                                                onChange={(e) =>
                                                                    handleInputChange(
                                                                        index,
                                                                        'startTime',
                                                                        e.target.value,
                                                                        subject._id
                                                                    )
                                                                }
                                                                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-900 dark:text-gray-200"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="py-3 px-6">
                                                            <Input
                                                                placeholder="HH:MM"
                                                                type="time"
                                                                value={examSchedules[index]?.endTime || ''}
                                                                onChange={(e) =>
                                                                    handleInputChange(
                                                                        index,
                                                                        'endTime',
                                                                        e.target.value,
                                                                        subject._id
                                                                    )
                                                                }
                                                                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-900 dark:text-gray-200"
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            ) : (
                                selectedClass && <p>No Subjects Found</p>
                            )}

                            {/* Clear Filters Button */}
                            <div className="mt-4">
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedExam('');
                                        setSelectedClass('');
                                        fetchExamSchedules('', '');
                                    }}
                                    className="px-6 py-3 bg-gray-200 !text-black rounded-lg hover:bg-gray-300 transition duration-300"
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        </div>

                        {/* Error Message */}
                        <h3 className="text-red-600 text-left ml-2 mt-2">{ErrorMessage}</h3>

                        {/* Footer Buttons */}
                        <div className="flex items-center gap-3 px-2 mt-4 lg:justify-end">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedClass('');
                                    setSelectedExam('');
                                    setSubjectsList([]);
                                    setExamSchedules([]);
                                    fetchExamSchedules('', '');
                                }}
                            >
                                Close
                            </Button>
                            <Button
                                onClick={(e) => {
                                    handleScheduleExam(e);
                                }}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                Schedule Exam
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={showDeleteModal} onClose={() => {
                setShowDeleteModal(false);
                setErrorMessage('');
            }} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="bg-white p-8 dark:bg-gray-900">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Are you sure you want to delete this exam schedule?</h2>
                        <div className="flex justify-end space-x-4">
                            <Button
                                onClick={() => setShowDeleteModal(false)} // Close the confirmation modal
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmDelete} // Confirm deletion
                                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
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
export default ExamSchedule;
