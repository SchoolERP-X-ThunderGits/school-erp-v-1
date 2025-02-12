import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // FontAwesome icons for Edit, Delete, and Add
import { getService, postService, putService, deleteService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import Loader from '../../../../components/Loader';
import { showToast } from '../../../../components/Toast';

const Exams = () => {
    const [feeTypeList, setFeeTypeList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [feeName, setFeeName] = useState('');
    const [description, setDescription] = useState();
    const [editId, setEditId] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete confirmation modal
    const [classToDelete, setClassToDelete] = useState(null); // Track fee to delete

    const sections = ['A', 'B', 'C', 'D', 'E', 'F'];

    useEffect(() => {
        setLoading(true);
        getFeeTypeList();
    }, []);

    const getFeeTypeList = async () => {
        try {
            const result = await getService(apiName.getFeeList); // API endpoint (e.g. '/posts')
            setEditMode(false);
            setEditId('');
            setFeeTypeList(result);
            setFeeName('');
            setDescription('')
            setShowModal(false);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const handleEdit = (classData) => {
        setShowModal(true);
        setEditMode(true);
        setEditId(classData._id);
        setFeeName(classData.name);
        setDescription(classData.description)
    };

    const handleDelete = (classId) => {
        setClassToDelete(classId); // Store fee ID for deletion
        setShowDeleteModal(true);  // Show confirmation modal
    };

    const handleAddClass = async () => {
        if (!feeName || !description) {
            showToast('All fields are required', 'error');
            return;
        }
        const body = {
            name: feeName,
            description: description,
        };

        if (editMode) {
            try {
                const response = await putService(`${apiName.updateFee}/${editId}`, body);
                showToast("Fee updated successfully.",'success');
                getFeeTypeList();
            } catch (error) {
                console.error('Error posting data:', error);
            }
        } else {
            try {
                const response = await postService(apiName.addFee, body);
                console.log('respofdfnse',response)
                showToast("Fee added successfully.",'success');
                getFeeTypeList();
            } catch (error) {
                console.error('Error posting data:', error);
            }
        }
    };

    const handleConfirmDelete = async () => {
        try {
            // Call delete service with the fee ID
            await deleteService(`${apiName.deleteFee}/${classToDelete}`);
            showToast('Fee deleted successfully', 'success');
            getFeeTypeList(); // Refresh the fee list
        } catch (error) {
            showToast('Error deleting fee', 'error');
        }
        setShowDeleteModal(false); // Close the confirmation modal
        setClassToDelete(null);    // Clear the fee ID
    };

    return (
        <div className="container mx-auto p-4">
            {/* Add Fee Button */}
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-800">FeeType List</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    <FaPlus className="mr-2" /> Add FeeType
                </button>
            </div>
{
    loading ? <Loader/>
    :

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600">
                            <th className="py-3 px-6 text-left text-sm font-semibold">Fee Name</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold">Fee Description</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feeTypeList.map((classItem) => (
                            <tr key={classItem.id} className="border-b hover:bg-gray-50 transition duration-200">
                                <td className="py-3 px-6 text-sm text-gray-800">{classItem.name}</td>
                                {console.log('blvlblvb',classItem)}
                                <td className="py-3 px-6 text-sm text-gray-800">
                                    {classItem.description}
                                </td>
                                <td className="py-3 px-6 flex space-x-4">
                                    <button
                                        onClick={() => handleEdit(classItem)}
                                        className="text-blue-500 hover:text-blue-700 transition duration-200"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(classItem._id)} // Pass fee ID to delete
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

            {/* Add Fee Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-sm">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add FeeType</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Fee Name</label>
                            <input
                                type="text"
                                value={feeName}
                                onChange={(e) => setFeeName(e.target.value)}
                                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter fee name"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Fee Description</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter fee description"
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
                                onClick={handleAddClass}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                {editMode?'Update fee':'Add feetype'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to delete this fee?</h2>
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
