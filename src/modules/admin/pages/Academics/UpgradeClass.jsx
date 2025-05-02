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
import Checkbox from '../../../../components/form/input/Checkbox';

const UpgradeClass = () => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [sessionFilter, setSessionFilter] = useState('');
    const [sections, setSections] = useState([]);
    const [students, setStudents] = useState([]);
    const [classFilter, setClassFilter] = useState('');
    const [sectionFilter, setSectionFilter] = useState('');
    const [selectedStudentsId, setSelectedStudentsId] = useState([]);
    const [newClass, setNewClass] = useState('');
    const [newSection, setNewSection] = useState('');
    const [newSession, setNewSession] = useState('');
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
        setSessionFilter('');
        fetchSectionsForClass(selectedClass);
    };

    const handleSectionFilterChange = (e) => {
        setSectionFilter(e);
        setSessionFilter('');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!classFilter || !sectionFilter || !sessionFilter) {
            showToast('Please select all fields', 'error');
            return;
        }
        fetchFilteredStudents();
    };

    const fetchFilteredStudents = async () => {
        try {
            const result = await getService(`${apiName.getStudentByExam}/${classFilter}/${sectionFilter}/${sessionFilter}`);
            setStudents(result);
            setSelectedStudentsId([]);
            setLoading(false);
        } catch (error) {
            showToast('Error fetching filtered students', 'error');
            setLoading(false);
        }
    };

    const handleStudentSelect = (e, studentId) => {
        if (e) {
            setSelectedStudentsId([...selectedStudentsId, studentId]);
        } else {
            setSelectedStudentsId(selectedStudentsId.filter(id => id !== studentId));
        }
    };

    const renderStudentList = () => {
        const handleSelectAll = (e) => {
            if (e) {
                setSelectedStudentsId(students.map((student) => student._id));
            } else {
                setSelectedStudentsId([]);
            }
        };

        const isAllSelected = students.length > 0 && selectedStudentsId.length === students.length;

        return (
            <div className="container mx-auto p-4">
                <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
                    {students.length === 0 ? (
                        <p className="text-center text-gray-500 m-2 dark:text-gray-400">No students found</p>
                    ) : (
                        <Table className="w-full text-left border-collapse">
                            <TableHeader className='bg-gray-100 dark:bg-gray-800'>
                                <TableRow>
                                    <th className='px-5 py-3 font-medium text-gray-500 text-left'>
                                        <Checkbox
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                        />
                                    </th>

                                    {['Admission Number', 'Roll Number', 'Name', 'Class', 'Section'].map((header) => (
                                        <th key={header} className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400 text-left">{header}</th>
                                    ))}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {students?.map((student) => (
                                    <TableRow className='border-gray-200 dark:border-gray-900 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800' key={student._id}>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                            <Checkbox
                                                id={student}
                                                checked={selectedStudentsId.includes(student._id)}
                                                onChange={(e) => handleStudentSelect(e, student._id)}
                                            />
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{student?.admission_Number}</TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{student?.roll_Number}</TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                            <button
                                                onClick={() => navigate(`/admin/student/student-details/${student?._id}`)} // Navigate to student details page
                                                className="text-blue-500 hover:text-blue-700 transition duration-200"
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

    const handleUpgradeStudent = async (e) => {
        e.preventDefault();
        if (!newClass || !newSection || !newSession) {
            setErrorMessage('Please select all fields');
            return;
        }
        setLoading(true);
        const body = {
            _id: selectedStudentsId,
            class_Id: newClass,
            section: newSection,
            session: newSession,
        };
        try {
            const response = await postService(apiName.upgradeStudentSessionSectionClass, JSON.stringify(body));
            setClassFilter('');
            setSectionFilter('');
            setSessionFilter('');
            setStudents([]);
            setSelectedStudentsId([]);
            setNewClass('');
            setNewSection('');
            setNewSession('');
            showToast("Details updated successfully", 'success');
            setModalOpen(false);
            setLoading(false);
        } catch (error) {
            setErrorMessage(error?.response?.data?.message);
            console.error('Error posting data:', error);
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-900">
            {/* Add Class Button */}
            <div className='w-full p-4 flex justify-between items-center'>
                <div className='text-3xl font-medium text-gray-800 dark:text-white'>Upgrade Class, Section and Session</div>
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
                        {selectedStudentsId.length > 0 && (
                            <Button
                                onClick={() => setModalOpen(true)}
                                className="px-6 py-3 bg-green-500 text-black rounded-lg hover:bg-green-600 transition duration-300"
                            >
                                <FaDownload className="mr-2" /> Upgrade Students
                            </Button>
                        )}
                    </div>

                    <div className="mt-6">{renderStudentList()}</div>

                    {/* Modal for updating class and section */}
                    <Modal isOpen={modalOpen} onClose={() => {
                        setModalOpen(false);
                        setNewClass('');
                        setNewSection('');
                        setNewSession('');
                        setErrorMessage('');
                    }} className="max-w-[700px] m-4">
                        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                            <div className="px-2 pr-14">
                                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                    Upgrade Class & Section
                                </h4>
                                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                                    Upgrade Here Students Class, Section and Session
                                </p>
                            </div>
                            <form className="flex flex-col">
                                <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                                    <div>
                                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                            <div>
                                                <Select
                                                    placeholder='Select New Class'
                                                    options={classes.map((classItem) => ({
                                                        value: classItem._id,
                                                        label: classItem.name,
                                                    }))}
                                                    value={newClass}
                                                    onChange={(e) => {
                                                        setNewClass(e);
                                                        fetchSectionsForClass(e);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 mt-3 mb-3 gap-x-6 gap-y-5 lg:grid-cols-2">
                                            <div>
                                                <Select
                                                    value={newSection}
                                                    onChange={(e) => setNewSection(e)}
                                                    disabled={!newClass}
                                                    placeholder='Select New Section'
                                                    options={sections.map((section) => ({
                                                        value: section,
                                                        label: section,
                                                    }))}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                            <div>
                                                <Select
                                                    value={newSession}
                                                    onChange={(e) => setNewSession(e)}
                                                    disabled={!newSection}
                                                    placeholder='Select New Session'
                                                    options={sessionsArray.map((session) => ({
                                                        value: session,
                                                        label: session,
                                                    }))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h3 style={{ textAlign: 'start', color: 'red', marginLeft: 10 }}>{ErrorMessage}</h3>
                                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                                    <Button size="sm" variant="outline" onClick={() => {
                                        setModalOpen(false);
                                        setNewClass('');
                                        setNewSection('');
                                        setNewSession('');
                                        setErrorMessage('');
                                    }}>
                                        Close
                                    </Button>
                                    <Button
                                        onClick={(e) => handleUpgradeStudent(e)}
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

export default UpgradeClass;
