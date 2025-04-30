import React, { useEffect, useState } from 'react';
import { MdDelete, MdOutlineModeEdit } from "react-icons/md";
import { getService, postService, putService, deleteService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import Loader from '../../../../components/Loader';
import { Modal } from '../../../../components/ui/modal';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../components/ui/table/index';
import Button from '../../../../components/ui/button/Button';
import Label from '../../../../components/form/Label';
import Select from '../../../../components/form/Select';
import { showToast } from '../../../../components/Toast';
import { Link, useNavigate } from 'react-router-dom';
import { sessionsArray } from '../../../../constants/GlobalConstants';
import { FaDownload, FaTimeline } from "react-icons/fa6";
import Input from '../../../../components/form/input/InputField';
const Students = () => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]); // Classes for dropdown
    const [sections, setSections] = useState([]); // Sections for dropdown based on selected class
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState(null);
    const [classFilter, setClassFilter] = useState('');
    const [sectionFilter, setSectionFilter] = useState('');
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        setLoading(true);
        fetchClasses();
        fetchStudents();
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
        const selectedClass = e;
        setClassFilter(selectedClass);
        setSectionFilter(''); // Reset section filter
        fetchSectionsForClass(selectedClass); // Fetch sections for the selected class
    };

    // Handle section filter change
    const handleSectionFilterChange = (e) => {
        setSectionFilter(e);
    };

    const handleDelete = (studentId) => {
        setStudentId(studentId); // Store student ID for deletion
        setShowDeleteModal(true);  // Show confirmation modal
    };

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

    // Filter students based on class, section, and search text
    const filteredStudents = students.filter((student) => {
        const matchesClass = classFilter ? student.class_Id?.name === classFilter : true;
        const matchesSection = sectionFilter ? student.section === sectionFilter : true;
        const matchesSearchText = searchText
            ? student.first_Name.toLowerCase().includes(searchText.toLowerCase()) ||
            student.last_Name.toLowerCase().includes(searchText.toLowerCase()) ||
            student.date_Of_Birth.toLowerCase().includes(searchText.toLowerCase()) ||
            student.gender.toLowerCase().includes(searchText.toLowerCase()) ||
            student.permanent_Address.toLowerCase().includes(searchText.toLowerCase()) ||
            student.email.toLowerCase().includes(searchText.toLowerCase()) ||
            student.contact_Number.toLowerCase().includes(searchText.toLowerCase()) ||
            student.admission_Number.toLowerCase().includes(searchText.toLowerCase())
            : true;

        return matchesClass && matchesSection && matchesSearchText;
    });

    const renderStudentList = () => {
        return (
            <div className="container mx-auto ">
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    {filteredStudents.length == 0 ?
                        <p style={{ textAlign: 'center', margin: 10 }}>No students found</p> :
                        <Table className="w-full text-left border-collapse">
                            <TableHeader className='bg-gray-100 dark:bg-gray-800'>
                                <TableRow>
                                    {['Admission Number', 'Roll Number', 'Name', 'Class', 'Section'].map((header) => (
                                        <th key={header} className="px-5 py-3 font-medium text-gray-500 text-left">{header}</th>
                                    ))}
                                    <th className='px-5 py-3 font-medium text-gray-500 text-left'>Action</th>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredStudents?.map((student) => (
                                    <TableRow className='border-gray-200 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800' key={student._id}>
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
                                        <TableCell className="px-5 py-4">
                                            <div className='flex gap-3 justify-start items-center'>
                                                <button onClick={() => navigate(`/admin/edit-student/${student?._id}`)}>
                                                    <MdOutlineModeEdit className='dark:text-white' />
                                                </button>
                                                <button onClick={() => handleDelete(student?._id)}>
                                                    <MdDelete className='dark:text-white' />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    }
                </div>
            </div>
        );
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-900">
            {/* Add Class Button */}
            <div className='w-full p-4 flex justify-between items-center'>
                <div className='text-3xl font-medium'>Students List</div>
                <Button onClick={() => {
                    if (classes.length == 0) {
                        showToast('Please create a class first.', 'error')
                    } else {
                        navigate('/admin/add-student')
                    }
                }}>
                    <Link>Add Student</Link>
                </Button>
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
                                value: classItem.name,
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
                        <Input
                            type="text"
                            placeholder="Search"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <Button
                            onClick={() => {
                                setClassFilter('');
                                setSectionFilter('');
                                setSearchText('');
                            }}
                            className="px-6 py-3 bg-gray-200 !text-black rounded-lg hover:bg-gray-300 transition duration-300"
                        >
                            Clear Filters
                        </Button>
                    </div>



                    <div className="mt-6">{renderStudentList()}</div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal isOpen={showDeleteModal} onClose={() => {
                setShowDeleteModal(false)
            }} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="bg-white p-8 ">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to delete this student?</h2>
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

export default Students;
