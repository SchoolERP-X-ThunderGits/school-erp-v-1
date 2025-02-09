import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // FontAwesome icons for Edit, Delete, and Add
import { getService, postService, putService, deleteService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import Loader from '../../../../components/Loader';
import { showToast } from '../../../../components/Toast';

const Class = () => {
    const [classList, setClassList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newClassName, setNewClassName] = useState('');
    const [selectedSections, setSelectedSections] = useState([]); // array to store selected sections
    const [editId, setEditId] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete confirmation modal
    const [classToDelete, setClassToDelete] = useState(null); // Track class to delete

    const sections = ['A', 'B', 'C', 'D', 'E', 'F'];

    useEffect(() => {
        setLoading(true);
        getClassList();
    }, []);

    const getClassList = async () => {
        try {
            const result = await getService(apiName.getClassList); // API endpoint (e.g. '/posts')
            setEditMode(false);
            setEditId('');
            setClassList(result);
            setNewClassName('');
            setSelectedSections([]);
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
        setNewClassName(classData.name);
        setSelectedSections(classData.sections);
    };

    const handleDelete = (classId) => {
        setClassToDelete(classId); // Store class ID for deletion
        setShowDeleteModal(true);  // Show confirmation modal
    };

    const handleSectionChange = (section) => {
        setSelectedSections((prevSelectedSections) =>
            prevSelectedSections.includes(section)
                ? prevSelectedSections.filter((sec) => sec !== section) // deselect if already selected
                : [...prevSelectedSections, section] // select the section
        );
    };

    const handleAddClass = async () => {
        if (!newClassName || selectedSections.length === 0) {
            showToast('All fields are required', 'error');
            return;
        }
        const body = {
            name: newClassName,
            sections: selectedSections,
        };

        if (editMode) {
            try {
                const response = await putService(`${apiName.updateClass}/${editId}`, body);
                showToast("Class updated successfully.",'success');
                getClassList();
            } catch (error) {
                console.error('Error posting data:', error);
            }
        } else {
            try {
                const response = await postService(apiName.addClass, body);
                showToast("Class added successfully.",'success');
                getClassList();
            } catch (error) {
                console.error('Error posting data:', error);
            }
        }
    };

    const handleConfirmDelete = async () => {
        try {
            // Call delete service with the class ID
            await deleteService(`${apiName.deleteClass}/${classToDelete}`);
            showToast('Class deleted successfully', 'success');
            getClassList(); // Refresh the class list
        } catch (error) {
            showToast('Error deleting class', 'error');
        }
        setShowDeleteModal(false); // Close the confirmation modal
        setClassToDelete(null);    // Clear the class ID
    };

    return (
        <div className="container mx-auto p-4">
            {/* Add Class Button */}
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-800">Class List</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    <FaPlus className="mr-2" /> Add Class
                </button>
            </div>
            {

loading?<Loader/>:
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600">
                            <th className="py-3 px-6 text-left text-sm font-semibold">Class Name</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold">Sections</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classList.map((classItem) => (
                            <tr key={classItem.id} className="border-b hover:bg-gray-50 transition duration-200">
                                <td className="py-3 px-6 text-sm text-gray-800">{classItem.name}</td>
                                <td className="py-3 px-6 text-sm text-gray-800">
                                    {classItem.sections.join(', ')}
                                </td>
                                <td className="py-3 px-6 flex space-x-4">
                                    <button
                                        onClick={() => handleEdit(classItem)}
                                        className="text-blue-500 hover:text-blue-700 transition duration-200"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(classItem._id)} // Pass class ID to delete
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

            {/* Add Class Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-sm">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Class</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Class Name</label>
                            <input
                                type="text"
                                value={newClassName}
                                onChange={(e) => setNewClassName(e.target.value)}
                                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter class name"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-600">Sections</label>
                            <div className="mt-2 flex flex-wrap gap-4">
                                {sections.map((section) => (
                                    <div key={section} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={section}
                                            checked={selectedSections.includes(section)}
                                            onChange={() => handleSectionChange(section)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={section} className="text-sm text-gray-600">
                                            {section}
                                        </label>
                                    </div>
                                ))}
                            </div>
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
                                {editMode?'Update class':'Add class'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to delete this class?</h2>
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

export default Class;
