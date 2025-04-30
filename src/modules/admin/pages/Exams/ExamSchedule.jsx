import React, { useEffect, useState } from 'react';
import { getService, postService, putService, deleteService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import Loader from '../../../../components/Loader';
import { Modal } from '../../../../components/ui/modal';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../components/ui/table/index';
import Button from '../../../../components/ui/button/Button';
import Input from '../../../../components/form/input/InputField';
import Label from '../../../../components/form/Label';
import { showToast } from '../../../../components/Toast';
import { Link } from 'react-router-dom';
import Select from '../../../../components/form/Select';
// import Flatpickr from "react-flatpickr";
const ExamSchedule = () => {
    const [examsList, setExamsList] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [subjectsList, setSubjectsList] = useState([]);
    const [classes, setClasses] = useState([]);
    const [examSchedules, setExamSchedules] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState('')

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
        console.log('valuevalue', value)
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
        fetchExamSchedules(selectedExam, event);
        setSelectedClass(event);
        getSubjectsByClass(event);
    };

    const handleScheduleExam = async (e) => {
        e.preventDefault()
        if (!selectedExam || !selectedClass) {
            setErrorMessage('Please fill in all fields for each subject');
            return;
        }

        try {
            for (const schedule of examSchedules) {
                console.log('schedule', schedule)
                const result = await postService(apiName.addSchedule, schedule);
                console.log('result ----', result);
            }

            setSelectedClass('');
            setSelectedExam('');
            setSubjectsList([]);
            setExamSchedules([]);
            fetchExamSchedules('', '');
            setShowModal(false);

            setTimeout(() => {
                showToast('Exam scheduled successfully!', 'success');
            }, 1000);
        } catch (error) {
            console.error('Error scheduling exam:', error);
            showToast(error?.response?.data?.error, 'error')
        }
    };


    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-900">
            {/* Add Class Button */}
            <div className='w-full p-4 flex justify-between items-center'>
                <div className='text-3xl font-medium'>Schedule Exams List</div>
                <Button onClick={() => { setShowModal(true), setErrorMessage('') }}>
                    <Link>Schedule Exam</Link>
                </Button>
            </div>

            {/* Table to Show Scheduled Exams */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-4">
                    {examSchedules.length == 0 ?
                        <p style={{ textAlign: 'center', margin: 10 }}>No exams schedule found</p> :
                        <Table className="w-full text-left border-collapse">
                            <TableHeader className='bg-gray-100 dark:bg-gray-800'>
                                <TableRow>
                                    {['Subject Name', 'Exam Date', 'Start Time', 'End Time'].map((header) => (
                                        <th key={header} className="px-5 py-3 font-medium text-gray-500 text-left">{header}</th>
                                    ))}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {examSchedules?.map((schedule) => (
                                    <TableRow className='border-gray-200 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800' key={schedule._id}>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{schedule.subject?.name}</TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{new Date(schedule.date).toLocaleDateString()}</TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{schedule.startTime}</TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{schedule.endTime}</TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>}
                </div>
            </div>
            <Modal isOpen={showModal} onClose={() => {
                setShowModal(false)
                setErrorMessage('')
            }} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Schedule Exam
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Schedule exams here for selected subjects.
                        </p>
                    </div>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                            <div>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div>
                                        <Label >Select Exam</Label>
                                        <Select
                                            placeholder='Select exam'
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
                                            placeholder='Select Class'
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
                                {selectedClass && subjectsList?.length !== 0 ?
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mt-4 mb-4">Subjects for Selected Class</label>
                                        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                                            <Table className="min-w-full table-auto">
                                                <TableHeader>
                                                    <TableRow className="bg-gray-100 text-gray-600">
                                                        <th className="py-3 px-6 text-left text-sm font-semibold">Subject Name</th>
                                                        <th className="py-3 px-6 text-left text-sm font-semibold">Select Date</th>
                                                        <th className="py-3 px-6 text-left text-sm font-semibold">Start Time</th>
                                                        <th className="py-3 px-6 text-left text-sm font-semibold">End Time</th>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {subjectsList?.map((subject, index) => (
                                                        <TableRow key={subject.subjectId} className="border-b hover:bg-gray-50 transition duration-200">
                                                            <TableCell className="py-3 px-6 text-sm text-gray-800">{subject.name}</TableCell>
                                                            <TableCell className="py-3 px-6">
                                                                <Input
                                                                    type="date"
                                                                    onChange={(e) =>
                                                                        handleInputChange(index, "date", e.target.value, subject._id)
                                                                    }
                                                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
                                                                /> 
                                                              
                                                            </TableCell>
                                                            <TableCell className="py-3 px-6">
                                                                <input
                                                                    type="text"
                                                                    value={examSchedules[index]?.startTime || ""}
                                                                    onChange={(e) =>
                                                                        handleInputChange(index, "startTime", e.target.value, subject._id)
                                                                    }
                                                                />
                                                            </TableCell>
                                                            <TableCell className="py-3 px-6">
                                                                <input
                                                                    type="text"
                                                                    value={examSchedules[index]?.endTime || ""}
                                                                    onChange={(e) =>
                                                                        handleInputChange(index, "endTime", e.target.value, subject._id)
                                                                    }
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                    :
                                    selectedClass && <p>No Subjects Found</p>
                                }
                                <div className="mt-4">
                                    <Button
                                        onClick={(e) => {
                                            e.preventDefault()
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
                        </div>
                        <h3 style={{ textAlign: 'start', color: 'red', marginLeft: 10 }}>{ErrorMessage}</h3>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={() => {
                                setShowModal(false), setSelectedClass('');
                                setSelectedExam('');
                                setSubjectsList([]);
                                setExamSchedules([]);
                                fetchExamSchedules('', '')
                            }}>
                                Close
                            </Button>
                            <Button
                                onClick={e => { handleScheduleExam(e) }}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                Schedule Exam
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default ExamSchedule;
