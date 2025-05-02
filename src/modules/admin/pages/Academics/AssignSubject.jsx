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
import { Link } from 'react-router-dom';
import Checkbox from '../../../../components/form/input/Checkbox';

const AssignSubject = () => {
    const [assignList, setAssignList] = useState([]);
    const [classList, setClassList] = useState([]);
    const [subjectList, setSubjectList] = useState([]); // Added to track subjects
    const [selectedClass, setSelectedClass] = useState(''); // Track selected class
    const [selectedSubjects, setSelectedSubjects] = useState([]); // Track selected subjects
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete confirmation modal
    const [subjectToDelete, setSubjectToDelete] = useState(null); // Track subject to delete
    const [ErrorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        setLoading(true);
        getSubjectList();
        getAssignList();
        getClassList()
    }, []);

    const getClassList = async () => {
        try {
            const result = await getService(apiName.getClassList); // Assuming 'class' is the endpoint for classes
            setClassList(result);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };
    const getAssignList = async () => {
        try {
            const result = await getService(apiName.assignSubject); // Assuming 'class' is the endpoint for classes
            setAssignList(result);
            setEditId('')
            setSelectedClass('')
            setSelectedSubjects([])
            setShowModal(false)
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const getSubjectList = async () => {
        try {
            const result = await getService(apiName.subject); // API endpoint for subjects
            setSubjectList(result);

        } catch (error) {
            setLoading(false);
        }
    };

    const handleEdit = (classData) => {
        setShowModal(true);
        setEditMode(true);
        setEditId(classData._id);
        setSelectedClass(classData?.class?._id)
        setSelectedSubjects(classData?.subjects.map(subject => subject?._id));
    };

    const handleDelete = (classId) => {
        setSubjectToDelete(classId); // Store subject ID for deletion
        setShowDeleteModal(true);  // Show confirmation modal
    };

    const handleAddSubject = async (e) => {
        e.preventDefault()
        if (!selectedClass || selectedSubjects.length === 0) {
            setErrorMessage('All fields are required');
            return;
        }

        const body = {
            classId: selectedClass, // Selected class
            subjects: selectedSubjects, // Selected subjects
        };

        if (editMode) {
            try {
                const response = await putService(`${apiName.assignSubject}/${editId}`, body);
                showToast("Subject updated successfully.", 'success');
                getAssignList();
            } catch (error) {
                setErrorMessage(error?.response?.data?.message)
                console.error('Error posting data:', error);
            }
        } else {
            try {
                const response = await postService(apiName.assignSubject, body);
                console.log('lbllbcbc', response, body)
                showToast("Subject assign successfully.", 'success');
                getAssignList();
            } catch (error) {
                console.error('Error posting data:', error);
                setErrorMessage(error?.response?.data?.message)
            }
        }
    };

    const handleConfirmDelete = async () => {
        try {
            // Call delete service with the subject ID
            await deleteService(`${apiName.assignSubject}/${subjectToDelete}`);
            showToast('Subject deleted successfully', 'success');
            getAssignList(); // Refresh the subject list
        } catch (error) {
            showToast('Error deleting subject', 'error');
        }
        setShowDeleteModal(false); // Close the confirmation modal
        setSubjectToDelete(null);    // Clear the subject ID
    };

    // Handle checkbox change for selecting multiple subjects
    const handleSubjectChange = (subjectId) => {
        setSelectedSubjects((prevSelected) =>
            prevSelected.includes(subjectId)
                ? prevSelected.filter((id) => id !== subjectId) // Deselect subject if already selected
                : [...prevSelected, subjectId] // Select subject if not selected
        );
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700">
            {/* Add Class Button */}
            <div className='w-full p-4 flex justify-between items-center'>
                <div className='text-3xl font-medium text-gray-800 dark:text-white'>Assign Subject List</div>
                <Button
                    onClick={() => {
                        if (classList.length === 0) {
                            showToast('No classes found. Please add a class first.', 'error');
                            return;
                        }
                        if (subjectList.length === 0) {
                            showToast('No subjects found. Please add a subject first.', 'error');
                            return;
                        }

                        setShowModal(true);
                        setSelectedClass('');
                        setSelectedSubjects([]);
                        setErrorMessage('');
                        setEditMode(false);
                    }}
                    className="bg-blue-500 text-white hover:bg-blue-600"
                >
                    <Link>Assign Subject</Link>
                </Button>
            </div>
            {

                loading ? <Loader /> :
                    <div className="overflow-x-auto bg-white dark:bg-gray-700 shadow-md rounded-lg">
                        {assignList.length === 0 ?
                            <p style={{ textAlign: 'center', margin: 10 }} className="text-gray-500 dark:text-gray-400">No assign subject list found</p> :
                            <Table className="w-full text-left border-collapse">
                                <TableHeader className='bg-gray-100 dark:bg-gray-800'>
                                    <TableRow>
                                        {['Class Name', 'Subjects Name'].map((header) => (
                                            <th key={header} className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400 text-left">{header}</th>
                                        ))}
                                        <th className='px-5 py-3 font-medium text-gray-500 dark:text-gray-400 text-left'>Action</th>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {assignList?.map((subject) => (
                                        <TableRow className='dark:bg-gray-900 border-gray-200 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800' key={subject._id}>
                                            <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{subject?.class?.name}</TableCell>
                                            <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{subject?.subjects?.map(subject => subject.name)?.join(', ')}</TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className='flex gap-3 justify-start items-center'>
                                                    <button onClick={() => handleEdit(subject)}>
                                                        <MdOutlineModeEdit className='dark:text-white' />
                                                    </button>
                                                    <button onClick={() => handleDelete(subject._id)}>
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
            }
            {/* Add Subject Modal */}
            <Modal isOpen={showModal} onClose={() => {
                setShowModal(false)
                setErrorMessage('')
            }} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Assign Subjects
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Assign subjects to a class and organize your curriculum.
                        </p>
                    </div>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-[200px] overflow-y-auto px-2 pb-3">
                            <div>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div>
                                        <Label >Select Class</Label>
                                        <Select
                                            options={classList.map((classItem) => ({
                                                value: classItem._id,
                                                label: classItem.name,
                                            }))}
                                            value={selectedClass}
                                            onChange={(e) => setSelectedClass(e)}
                                        />
                                    </div>

                                </div>
                                <div className="mt-6">
                                    <Label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Subjects</Label>
                                    <div className="mt-2 flex flex-wrap gap-4">
                                        {subjectList.map((subject) => (
                                            <div key={subject} style={{ flexDirection: 'column' }} className="flex items-center">
                                                <Checkbox
                                                    id={subject}
                                                    checked={selectedSubjects.includes(subject._id)}
                                                    onChange={() => handleSubjectChange(subject._id)}
                                                />
                                                <Label htmlFor={subject} className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                                                    {subject.name}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3 style={{ textAlign: 'start', color: 'red' }}>{ErrorMessage}</h3>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={() => {
                                setShowModal(false); setEditMode(false); setEditId('');
                            }}>
                                Close
                            </Button>
                            <Button
                                onClick={(e) => handleAddSubject(e)}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                {editMode ? 'Update Subjects' : 'Assign Subjects'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

            <Modal isOpen={showDeleteModal} onClose={() => {
                setShowDeleteModal(false)
                setErrorMessage('')
            }} className="max-w-[700px]  m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="bg-white p-8 dark:bg-gray-900">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Are you sure you want to delete this subject?</h2>
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

export default AssignSubject;
