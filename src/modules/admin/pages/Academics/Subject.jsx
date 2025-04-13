import React, { useEffect, useState } from 'react';
import { MdDelete, MdOutlineModeEdit } from "react-icons/md";
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
const Subject = () => {
    const [subjectList, setSubjectList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [editId, setEditId] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete confirmation modal
    const [ErrorMessage, setErrorMessage] = useState('')
    const [subjectToDelete, setSubjectToDelete] = useState(null); // Track subject to delete

    useEffect(() => {
        setLoading(true);
        getSubjectList();
    }, []);

    const getSubjectList = async () => {
        try {
            const result = await getService(apiName.subject); // API endpoint (e.g. '/posts')
            setLoading(false)
            setEditMode(false);
            setEditId('');
            setSubjectList(result);
            setNewSubjectName('');
            setShowModal(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const handleEdit = (classData) => {
        setShowModal(true);
        setEditMode(true);
        setEditId(classData._id);
        setNewSubjectName(classData.name);
    };

    const handleDelete = (classId) => {
        setSubjectToDelete(classId); // Store subject ID for deletion
        setShowDeleteModal(true);  // Show confirmation modal
    };

    const handleAddSubject = async (e) => {
        e.preventDefault();
        if (!newSubjectName) {
            setErrorMessage('Name is required');
            return;
        }
        const body = {
            name: newSubjectName,
        };

        if (editMode) {
            try {
                const response = await putService(`${apiName.subject}/${editId}`, body);
                showToast("Subject updated successfully.", 'success');
                getSubjectList();
            } catch (error) {
                setErrorMessage(error?.response?.data?.error)
                console.error('Error posting data:', error);
            }
        } else {
            try {
                const response = await postService(apiName.subject, body);
                showToast("Subject added successfully.", 'success');
                getSubjectList();
            } catch (error) {
                setErrorMessage(error?.response?.data?.error)
                console.error('Error posting data:', error);
            }
        }
    };

    const handleConfirmDelete = async () => {
        try {
            // Call delete service with the subject ID
            await deleteService(`${apiName.subject}/${subjectToDelete}`);
            showToast('Subject deleted successfully', 'success');
            getSubjectList(); // Refresh the subject list
        } catch (error) {
            showToast(error?.response?.data?.error, 'error')
        }
        setShowDeleteModal(false); // Close the confirmation modal
        setSubjectToDelete(null);    // Clear the subject ID
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-900">
            {/* Add Subject Button */}
            <div className='w-full p-4 flex justify-between items-center'>
                <div className='text-3xl font-medium'>Subjects List</div>
                <Button onClick={() => { setShowModal(true), setNewSubjectName(''), setErrorMessage(''), setEditMode(false); }}>
                    <Link>Add Subject</Link>
                </Button>
            </div>

            {

                loading ? <Loader /> :
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        {subjectList.length == 0 ?
                            <p style={{ textAlign: 'center', margin: 10 }}>No subjects found</p> :
                            <Table className="w-full text-left border-collapse">
                                <TableHeader className='bg-gray-100 dark:bg-gray-800'>
                                    <TableRow>
                                        <th className="px-5 py-3 font-medium text-gray-500 text-left">Subject Name</th>

                                        <th className='px-5 py-3 font-medium text-gray-500 text-left'>Action</th>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {subjectList?.map((subjectItem) => (
                                        <TableRow className='border-gray-200 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800' key={subjectItem._id}>
                                            <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{subjectItem.name}</TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className='flex gap-3 justify-start items-center'>
                                                    <Link onClick={() => handleEdit(subjectItem)}>
                                                        <MdOutlineModeEdit className='dark:text-white' />
                                                    </Link>
                                                    <button onClick={() => handleDelete(subjectItem._id)}>
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

            <Modal isOpen={showModal} onClose={() => {
                setShowModal(false)
                setErrorMessage('')
            }} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Add Subject
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Add new Subject here for classes.
                        </p>
                    </div>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-[100px] overflow-y-auto px-2 pb-3">
                            <div>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div>
                                        <Label >Subject Name</Label>
                                        <Input
                                            type="text"
                                            value={newSubjectName}
                                            onChange={(e) => setNewSubjectName(e.target.value)}
                                            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter subject name"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3 style={{ textAlign: 'start', color: 'red' }}>{ErrorMessage}</h3>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={() => {
                                setShowModal(false)
                                setErrorMessage('')
                            }}>
                                Close
                            </Button>
                            <Button
                                onClick={(e) => handleAddSubject(e)}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                {editMode ? 'Update subject' : 'Add subject'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={showDeleteModal} onClose={() => {
                setShowDeleteModal(false)
                setErrorMessage('')
            }} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="bg-white p-8 ">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to delete this subject?</h2>
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

export default Subject;
