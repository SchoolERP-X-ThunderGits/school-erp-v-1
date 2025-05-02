import React, { useEffect, useState } from 'react';
import { getService, postService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import Loader from '../../../../components/Loader';
import { Modal } from '../../../../components/ui/modal';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../components/ui/table/index';
import Button from '../../../../components/ui/button/Button';
import Select from '../../../../components/form/Select';
import { showToast } from '../../../../components/Toast';
import { Link, useNavigate } from 'react-router-dom';
import { sessionsArray } from '../../../../constants/GlobalConstants';
import { FaDownload } from "react-icons/fa6";
import Input from '../../../../components/form/input/InputField';

const UpgradeRollNo = () => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [students, setStudents] = useState([]);
    const [classFilter, setClassFilter] = useState('');
    const [sectionFilter, setSectionFilter] = useState('');
    const [sessionFilter, setSessionFilter] = useState('');
    const [newRollNo, setNewRollNo] = useState('');
    const [studentRollArray, setStudentRollArray] = useState([]);
    const [studentOldRollArray, setStudentOldRollArray] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const result = await getService(apiName.getClassList);
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
            setSections(classSelected.sections);
        }
    };

    const handleClassFilterChange = (e) => {
        const selectedClass = e;
        setClassFilter(selectedClass);
        setSectionFilter('');
        fetchSectionsForClass(selectedClass);
    };

    const handleSectionFilterChange = (e) => {
        setSectionFilter(e);
        setSessionFilter('');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!classFilter || !sectionFilter || !sessionFilter) {
            showToast('All fields are required', 'error');
            return;
        }
        fetchFilteredStudents();
    };

    const fetchFilteredStudents = async () => {
        try {
            const result = await getService(`${apiName.getStudentByExam}/${classFilter}/${sectionFilter}/${sessionFilter}`);
            setStudentRollArray(result.map(i => ({
                _id: i._id,
                roll_Number: i.roll_Number,
            })));
            setStudentOldRollArray(result.map(i => ({
                _id: i._id,
                roll_Number: i.roll_Number,
            })));
            setStudents(result);
            setLoading(false);
        } catch (error) {
            showToast('Error fetching filtered students', 'error');
            setLoading(false);
        }
    };

    const handleUpgradeStudent = async (e, mode) => {
        e.preventDefault();
        if (!newRollNo && mode === 'auto') {
            setErrorMessage('Please enter new roll number.');
            return;
        }
        const body = {
            updates: studentRollArray,
            type: mode,
        };
        const body2 = {
            classId: classFilter,
            section: sectionFilter,
            startingRollNumber: newRollNo,
            type: mode,
        };
        try {
            const response = await postService(apiName.upgradeStudentRollNo, mode === 'auto' ? JSON.stringify(body2) : JSON.stringify(body));
            fetchFilteredStudents();
            showToast("Roll No Update Successfully", 'success');
            setModalOpen(false);
        } catch (error) {
            setErrorMessage(error?.response?.data?.message);
            console.error('Error posting data:', error);
        }
    };

    const renderStudentList = () => {
        return (
            <div className="container mx-auto p-4">
                <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow-md rounded-lg">
                    {students.length === 0 ? (
                        <p className="text-center text-gray-500 m-2 dark:text-gray-200">No students found</p>
                    ) : (
                        <Table className="w-full text-left border-collapse">
                            <TableHeader className='bg-gray-100 dark:bg-gray-800'>
                                <TableRow>
                                    {['Admission Number', 'Roll Number', 'Name', 'Class', 'Section'].map((header) => (
                                        <th key={header} className="px-5 py-3 font-medium text-gray-500 text-left dark:text-gray-400">{header}</th>
                                    ))}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {students?.map((student) => (
                                    <TableRow className='border-gray-200 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800' key={student._id}>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{student?.admission_Number}</TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center space-x-2">
                                                <Input
                                                    type="number"
                                                    value={(() => {
                                                        const studentObj = studentRollArray.find(obj => obj._id === student?._id);
                                                        return studentObj ? studentObj.roll_Number : '';
                                                    })()}
                                                    onChange={(e) => {
                                                        const updatedArray = studentRollArray.map(obj => {
                                                            if (obj._id === student?._id) {
                                                                return { ...obj, roll_Number: Number(e.target.value) };
                                                            }
                                                            return obj;
                                                        });
                                                        setStudentRollArray(updatedArray);
                                                    }}
                                                    className="border px-0.5 py-1 dark:border-gray-600"
                                                    style={{ borderWidth: 0.5, borderColor: 'gray' }}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                            <button
                                                onClick={() => navigate(`/admin/student/student-details/${student?._id}`)}
                                                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 transition duration-200"
                                            >
                                                {student?.first_Name} {student?.last_Name}
                                            </button>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{student?.class_Id?.name}</TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{student?.section}</TableCell>
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
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-900">
            {/* Add Class Button */}
            <div className='w-full p-4 flex justify-between items-center'>
                <div className='text-3xl font-medium text-gray-800 dark:text-white'>Upgrade Roll Number</div>
            </div>
            {loading ? (
                <Loader />
            ) : (
                <div className="max-w-full overflow-x-auto">
                    {/* Filters */}
                    <div className="grid grid-cols-2 p-4 gap-x-6 gap-y-5 lg:grid-cols-3">
                        <Select
                            placeholder='Filter by Class'
                            options={classes.map((classItem) => ({
                                value: classItem._id,
                                label: classItem.name,
                            }))}
                            value={classFilter}
                            onChange={handleClassFilterChange}
                        />
                        <Select
                            disabled={!classFilter}
                            placeholder='Filter by Section'
                            options={sections.map((section) => ({
                                value: section,
                                label: section,
                            }))}
                            value={sectionFilter}
                            onChange={handleSectionFilterChange}
                        />
                        <Select
                            disabled={!sectionFilter}
                            placeholder='Filter by Session'
                            options={sessionsArray.map((session) => ({
                                value: session,
                                label: session,
                            }))}
                            value={sessionFilter}
                            onChange={(e) => setSessionFilter(e)}
                        />
                    </div>
                    <div className="p-4 mb-4 flex flex-wrap gap-4">
                        <Button onClick={(e) => { handleSearch(e) }}>
                            <Link>Search</Link>
                        </Button>

                        <Button
                            onClick={() => {
                                setClassFilter('');
                                setSectionFilter('');
                                setSessionFilter('');
                                setStudents([]);
                            }}
                             className="px-6 py-3 bg-gray-200 !text-black rounded-lg hover:bg-gray-300 transition duration-300"
                        >
                            Clear Filters
                        </Button>
                        {students.length > 0 && (
                            <Button
                                onClick={() => setModalOpen(true)}
                                className="px-6 py-3 bg-green-500 text-black rounded-lg hover:bg-green-600 transition duration-300"
                            >
                                <FaDownload className="mr-2" /> Upgrade All Students Roll No.
                            </Button>
                        )}
                        {
                            JSON.stringify(studentRollArray) !== JSON.stringify(studentOldRollArray) &&
                            <Button
                                onClick={(e) => handleUpgradeStudent(e, 'manual')}
                                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                            >
                                <FaDownload className="mr-2" /> Save Changes
                            </Button>
                        }
                    </div>

                    <div className="mt-6">{renderStudentList()}</div>

                    {/* Modal for updating class and section */}
                    <Modal isOpen={modalOpen} onClose={() => {
                        setModalOpen(false);
                        setNewRollNo('');
                    }} className="max-w-[700px] m-4">
                        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                            <div className="px-2 pr-14">
                                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                    Starting Roll Number
                                </h4>
                                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                                    Here enter your starting roll number.
                                </p>
                            </div>
                            <form className="flex flex-col">
                                <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                                    <div>
                                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                            <div>
                                                <Input
                                                    type="number"
                                                    className="p-2 border rounded w-full mb-4 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                    value={newRollNo}
                                                    onChange={(e) => setNewRollNo(e.target.value)}
                                                    placeholder="Enter New Starting roll number"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h3 style={{ textAlign: 'start', color: 'red', marginLeft: 10 }}>{ErrorMessage}</h3>
                                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                                    <Button size="sm" variant="outline" onClick={() => {
                                        setModalOpen(false);
                                        setNewRollNo('');
                                    }}>
                                        Close
                                    </Button>
                                    <Button
                                        onClick={(e) => handleUpgradeStudent(e, 'auto')}
                                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default UpgradeRollNo;
