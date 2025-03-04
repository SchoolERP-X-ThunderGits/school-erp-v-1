import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // FontAwesome icons for Edit, Delete, and Add
import { getService, postService, putService, deleteService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import Loader from '../../../../components/Loader';
import { showToast } from '../../../../components/Toast';

const Subject = () => {
    const [subjectList, setSubjectList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [editId, setEditId] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete confirmation modal
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

    const handleAddSubject = async () => {
        if (!newSubjectName) {
            showToast('Name is required', 'error');
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
                console.error('Error posting data:', error);
            }
        } else {
            try {
                const response = await postService(apiName.subject, body);
                showToast("Subject added successfully.", 'success');
                getSubjectList();
            } catch (error) {
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
            showToast('Error deleting subject', 'error');
        }
        setShowDeleteModal(false); // Close the confirmation modal
        setSubjectToDelete(null);    // Clear the subject ID
    };

    return (
        <div className="container mx-auto p-4">
            {/* Add Subject Button */}
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-800">Subject List</h1>
                <button
                    onClick={() => { setShowModal(true), setNewSubjectName('') }}
                    className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    <FaPlus className="mr-2" /> Add Subject
                </button>
            </div>

            {

                loading ? <Loader /> :
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        {

                            subjectList.length == 0 ?
                                <p style={{ textAlign: 'center', margin: 10 }}>No Subject found</p> :

                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-100 text-gray-600">
                                            <th className="py-3 px-6 text-left text-sm font-semibold">Subject Name</th>
                                            <th className="py-3 px-6 text-left text-sm font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subjectList.map((subjectItem) => (
                                            <tr key={subjectItem.id} className="border-b hover:bg-gray-50 transition duration-200">
                                                <td className="py-3 px-6 text-sm text-gray-800">{subjectItem.name}</td>
                                                <td className="py-3 px-6 flex space-x-4">
                                                    <button
                                                        onClick={() => handleEdit(subjectItem)}
                                                        className="text-blue-500 hover:text-blue-700 transition duration-200"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(subjectItem._id)} // Pass subject ID to delete
                                                        className="text-red-500 hover:text-red-700 transition duration-200"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                        }
                    </div>
            }

            {/* Add Subject Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-sm">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Subject</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Subject Name</label>
                            <input
                                type="text"
                                value={newSubjectName}
                                onChange={(e) => setNewSubjectName(e.target.value)}
                                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter subject name"
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => { setShowModal(false); setEditMode(false); setEditId(''); }}
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddSubject}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                {editMode ? 'Update subject' : 'Add subject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to delete this subject?</h2>
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

export default Subject;
