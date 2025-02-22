import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // FontAwesome icons for Edit, Delete, and Add
import { getService, postService, putService, deleteService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import Loader from '../../../../components/Loader';
import { showToast } from '../../../../components/Toast';

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

    const handleAddSubject = async () => {
        if (!selectedClass || selectedSubjects.length === 0) {
            showToast('All fields are required', 'error');
            return;
        }

        const body = {
            classId: selectedClass, // Selected class
            subjects: selectedSubjects, // Selected subjects
        };

        if (editMode) {
            try {
                const response = await putService(`${apiName.assignSubject}/${editId}`, body);
                showToast("Subject updated successfully.",'success');
                getAssignList();
            } catch (error) {
                console.error('Error posting data:', error);
            }
        } else {
            try {
                const response = await postService(apiName.assignSubject, body);
                console.log('lbllbcbc',response,body)
                showToast("Subject assign successfully.",'success');
                getAssignList();
            } catch (error) {
                console.error('Error posting data:', error);
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
        <div className="container mx-auto p-4">
            {/* Add Subject Button */}
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-800">Assign List</h1>
                <button
                    onClick={() => {setShowModal(true),setSelectedClass(''),setSelectedSubjects([])}}
                    className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    <FaPlus className="mr-2" /> Assign Subject
                </button>
            </div>
            {

loading?<Loader/>:
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600">
                            <th className="py-3 px-6 text-left text-sm font-semibold">Class Name</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold">Subjects Name</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignList.map((subject) => (
                            <tr key={subject.id} className="border-b hover:bg-gray-50 transition duration-200">
                                <td className="py-3 px-6 text-sm text-gray-800">{subject?.class?.name}</td>
                                <td className="py-3 px-6 text-sm text-gray-800">{subject?.subjects?.map(subject => subject.name)?.join(', ')}</td>
                                <td className="py-3 px-6 flex space-x-4">
                                    <button
                                        onClick={() => handleEdit(subject)}
                                        className="text-blue-500 hover:text-blue-700 transition duration-200"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(subject._id)} // Pass subject ID to delete
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
            {/* Add Subject Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-sm">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Assign Subjects</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Select Class</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select a class</option>
                                {classList.map((classItem) => (
                                    <option  key={classItem._id} value={classItem._id}>
                                        {classItem.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Select Subjects</label>
                            <div className="space-y-2">
                                {subjectList.map((subject) => (
                                    <div key={subject._id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`subject-${subject._id}`}
                                            value={subject._id}
                                            checked={selectedSubjects.includes(subject._id)}
                                            onChange={() => handleSubjectChange(subject._id)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`subject-${subject._id}`} className="text-sm">{subject.name}</label>
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
                                onClick={handleAddSubject}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                {editMode ? 'Update Subjects' : 'Assign Subjects'}
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

export default AssignSubject;
