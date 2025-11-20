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
import { sessionsArray } from '../../../../constants/GlobalConstants';
import Select from '../../../../components/form/Select';

const Exams = () => {
    const [examsList, setExamsList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [examName, setExamName] = useState('');
    const [examSession, setExamSession] = useState();
    const [editId, setEditId] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete confirmation modal
    const [examToDelete, setExamToDelete] = useState(null); // Track exam to delete
    const [ErrorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        setLoading(true);
        getExamsList();
    }, []);

    const getExamsList = async () => {
        try {
            const result = await getService(apiName.exams); // API endpoint (e.g. '/posts')
            setEditMode(false);
            setEditId('');
            setExamsList(result?.data || []);
            setExamName('');
            setExamSession('');
            setShowModal(false);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const handleEdit = (examData) => {
        setShowModal(true);
        setEditMode(true);
        setEditId(examData._id);
        setExamName(examData.name);
        setExamSession(examData.session)
    };

    const handleDelete = (examId) => {
        setExamToDelete(examId); // Store exam ID for deletion
        setShowDeleteModal(true);  // Show confirmation modal
    };

    const handleAddExam = async (e) => {
        e.preventDefault();
        if (!examName || !examSession) {
            setErrorMessage('All fields are required');
            return;
        }
        const body = {
            name: examName,
            session: examSession,
        };

        if (editMode) {
            try {
                const response = await putService(`${apiName.exams}/${editId}`, body);
                showToast("Exam updated successfully.", 'success');
                getExamsList();
            } catch (error) {
                setErrorMessage(error?.response?.data?.message)
            }
        } else {
            try {
                const response = await postService(apiName.exams, body);
                showToast("Exam added successfully.", 'success');
                getExamsList();
            } catch (error) {
                showToast("Error adding exam", 'error');
            }
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteService(`${apiName.exams}/${examToDelete}`);
            showToast('Exam deleted successfully', 'success');
            getExamsList(); // Refresh the exam list
        } catch (error) {
            showToast('Error deleting exam', 'error');
        }
        setShowDeleteModal(false); // Close the confirmation modal
        setExamToDelete(null);    // Clear the exam ID
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-900">
            {/* Add Exam Button */}
            <div className='w-full p-4 flex justify-between items-center'>
                <div className='text-3xl font-medium text-gray-700 dark:text-white'>Exams List</div>
                <Button
                    onClick={() => {
                        setShowModal(true);
                        setErrorMessage('');
                        setEditMode(false);
                        setEditId('');
                        setExamName('');
                    }}
                    className="bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
                >
                    <Link>Add Exam</Link>
                </Button>
            </div>

            {loading ? <Loader /> :
                <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow-md rounded-lg">
                    {examsList.length === 0 ?
                        <p style={{ textAlign: 'center', margin: 10 }} className="text-gray-700 dark:text-white">No exams found</p> :
                        <Table className="w-full text-left border-collapse">
                            <TableHeader className='bg-gray-100 dark:bg-gray-800'>
                                <TableRow>
                                    {['Exam Name', 'Session'].map((header) => (
                                        <th key={header} className="px-5 py-3 font-medium text-gray-500 text-left dark:text-gray-400">{header}</th>
                                    ))}
                                    <th className='px-5 py-3 font-medium text-gray-500 text-left dark:text-white'>Action</th>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {examsList?.map((examItem) => (
                                    <TableRow className='border-gray-200 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800' key={examItem._id}>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{examItem?.name}</TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{examItem.session}</TableCell>
                                        <TableCell className="px-5 py-4">
                                            <div className='flex gap-3 justify-start items-center'>
                                                <Link onClick={() => handleEdit(examItem)}>
                                                    <MdOutlineModeEdit className='text-gray-700 dark:text-white hover:text-blue-500 dark:hover:text-blue-400' />
                                                </Link>
                                                <Link onClick={() => handleDelete(examItem._id)}>
                                                    <MdDelete className='text-gray-700 dark:text-white hover:text-red-500 dark:hover:text-red-400' />
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>}
                </div>
            }

            <Modal isOpen={showModal} onClose={() => {
                setShowModal(false);
                setErrorMessage('');
            }} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Add Exam</h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">Add new exam here for students.</p>
                    </div>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                            <div>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div>
                                        <Label>Exam Name</Label>
                                        <Input
                                            type="text"
                                            value={examName}
                                            onChange={(e) => setExamName(e.target.value)}
                                            placeholder="Enter exam name"
                                        />
                                    </div>

                                    <div>
                                        <Label>Select Session</Label>
                                        <Select
                                            placeholder='Select session'
                                            options={sessionsArray.map((session) => ({
                                                value: session,
                                                label: session,
                                            }))}
                                            value={examSession}
                                            onChange={(e) => setExamSession(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3 style={{ textAlign: 'start', color: 'red', marginLeft: 10 }}>{ErrorMessage}</h3>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={() => {
                                setShowModal(false);
                                setErrorMessage('');
                                setEditMode(false);
                                setEditId('');
                            }}>
                                Close
                            </Button>
                            <Button
                                onClick={e => { handleAddExam(e) }}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                {editMode ? 'Update exam' : 'Add exam'}
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
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to delete this exam?</h2>
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

export default Exams;
