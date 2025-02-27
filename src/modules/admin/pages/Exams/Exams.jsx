import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // FontAwesome icons for Edit, Delete, and Add
import { getService, postService, putService, deleteService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import Loader from '../../../../components/Loader';
import { showToast } from '../../../../components/Toast';

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
    const [sessions, setSessions] = useState(['2024-2025', '2025-2026', '2026-2027']);
    useEffect(() => {
        setLoading(true);
        getExamsList();
    }, []);

    const getExamsList = async () => {
        try {
            const result = await getService(apiName.exams); // API endpoint (e.g. '/posts')
            setEditMode(false);
            setEditId('');
            setExamsList(result);
            setExamName('');
            setExamSession('')
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

    const handleAddExam = async () => {
        if (!examName || !examSession) {
            showToast('All fields are required', 'error');
            return;
        }
        const body = {
            name: examName,
            session: examSession,
        };

        if (editMode) {
            try {
                const response = await putService(`${apiName.exams}/${editId}`, body);
                console.log('blvcbkcvkbk', response)
                showToast("Exam updated successfully.", 'success');
                getExamsList();
            } catch (error) {
                console.error('Error posting data:', error);
            }
        } else {
            try {
                const response = await postService(apiName.exams, body);
                console.log('respofdfnse', response)
                showToast("Exam added successfully.", 'success');
                getExamsList();
            } catch (error) {
                console.error('Error posting data:', error);
            }
        }
    };

    const handleConfirmDelete = async () => {
        try {
            // Call delete service with the exam ID
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
        <div className="container mx-auto p-4">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-800">Exams List</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    <FaPlus className="mr-2" /> Add Exam
                </button>
            </div>
            {
                loading ? <Loader />
                    :

                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600">
                                    <th className="py-3 px-6 text-left text-sm font-semibold">Exam Name</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold">Session</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {examsList.map((examItem) => (
                                    <tr key={examItem.id} className="border-b hover:bg-gray-50 transition duration-200">
                                        <td className="py-3 px-6 text-sm text-gray-800">{examItem.name}</td>
                                        <td className="py-3 px-6 text-sm text-gray-800">
                                            {examItem.session}
                                        </td>
                                        <td className="py-3 px-6 flex space-x-4">
                                            <button
                                                onClick={() => handleEdit(examItem)}
                                                className="text-blue-500 hover:text-blue-700 transition duration-200"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(examItem._id)} // Pass exam ID to delete
                                                className="text-red-500 hover:text-red-700 transition duration-200"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
            }

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-sm">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Exam</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Exam Name</label>
                            <input
                                type="text"
                                value={examName}
                                onChange={(e) => setExamName(e.target.value)}
                                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter exam name"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Exam Session</label>
                            <select
                                name="session"
                                value={examSession}
                                onChange={(e) => setExamSession(e.target.value)}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            >
                                <option value="">Select Session</option>
                                {sessions?.map((section) => (
                                    <option key={section} value={section}>
                                        {section}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => { setShowModal(false); setEditMode(false); setEditId(''); }}
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddExam}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                {editMode ? 'Update exam' : 'Add exam'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to delete this exam?</h2>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)} // Close the confirmation modal
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete} // Confirm deletion
                                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Exams;
