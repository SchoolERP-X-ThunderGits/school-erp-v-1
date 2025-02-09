import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // Icons for Edit, Delete, Add
import { getService, deleteService, postService, putService } from '../../../../constants/Service'; // Importing services
import apiName from '../../../../constants/ApiName'; // Importing API Names
import Loader from '../../../../components/Loader'; // Assuming you have a loader component
import { showToast } from '../../../../components/Toast'; // Show Toast Notifications

const FeeStructure = () => {
    const [feeStructures, setFeeStructures] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false); // Modal state for adding fee structure
    const [expandedFees, setExpandedFees] = useState({});
    const [showFeeGroupModal, setShowFeeGroupModal] = useState(false); // Modal state for fee group
    const [classes, setClasses] = useState([]); // Classes for dropdown
    const [editMode, setEditMode] = useState(false);
    const [feeTypes, setFeeTypes] = useState([]); // Fee Types for dropdown
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete confirmation modal
    const [feeToDelete, setFeeToDelete] = useState(null); // Track class to delete
    const [formData, setFormData] = useState({
        name: '',
        class: '',
        feeGroups: [{ feeType: '', amount: '', dueDate: '' }]
    });
    const [selectedFeeGroup, setSelectedFeeGroup] = useState(null); // State to store selected fee group for edit/delete

    useEffect(() => {
        setLoading(true);
        setEditMode(false);
        fetchFeeStructures();
        fetchClasses();
        fetchFeeTypes();
    }, []);

    const toggleExpandFeeStructure = (id) => {
        setExpandedFees(prevState => ({
            ...prevState,
            [id]: !prevState[id],  // Toggle the current expanded state for this ID
        }));
    };

    
    // Fetch Fee Structures from API
    const fetchFeeStructures = async () => {
        try {
            const result = await getService(apiName.getFeeStructure); // Get Fee Structures API
            setFeeStructures(result); // Set fee structures in the state
            setLoading(false);
        } catch (error) {
            showToast('Error fetching fee structures', 'error');
            setLoading(false);
        }
    };

    // Fetch Classes from API
    const fetchClasses = async () => {
        try {
            const result = await getService(apiName.getClassList); // Get Classes API
            setClasses(result); // Set classes in state
        } catch (error) {
            showToast('Error fetching classes', 'error');
        }
    };

    // Fetch Fee Types from API
    const fetchFeeTypes = async () => {
        try {
            const result = await getService(apiName.getFeeList); // Get Fee Types API
            setFeeTypes(result); // Set fee types in state
        } catch (error) {
            showToast('Error fetching fee types', 'error');
        }
    };

    // Handle Add Fee Structure
    const handleAddFeeStructure = async () => {
        console.log('Form Data for New Fee Structure:', formData);
        if (!formData.name || !formData.class || formData.feeGroups.some((group) => !group.feeType || !group.amount || !group.dueDate)) {
            showToast("Please fill all the fields.", 'error');
            return;
        }

        // If editing, call PUT service to update the fee structure
        if (editMode) {
            try {
                const response = await putService(`${apiName.updateClass}/${feeToDelete}`, formData);
                showToast("Fee structure updated successfully.", 'success');
                fetchFeeStructures();
            } catch (error) {
                console.error('Error posting data:', error);
            }
        } else {
            try {
                const response = await postService(apiName.addFeeStructure, formData);
                showToast("Fee structure added successfully.", 'success');
                fetchFeeStructures();
            } catch (error) {
                console.error('Error posting data:', error);
            }
        }

        setShowModal(false);
    };

    const handleEditFeeStructure = (feeData) => {
        setShowModal(true);
        setEditMode(true);
        setFeeToDelete(feeData._id);
        setFormData({
            name: feeData.name,
            class: feeData.class?._id,
            feeGroups: feeData.feeGroups.map(group => ({
                feeType: group.feeType,
                amount: group.amount,
                dueDate: group.dueDate.split('T')[0] // Removing everything after the 'T' from the dueDate
            }))
        });
    };

    const handleDeleteFeeStructure = (classId) => {
        setFeeToDelete(classId); // Store class ID for deletion
        setShowDeleteModal(true);  // Show confirmation modal
    };

    // Handle Input Change for Form Data
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleConfirmDelete = async () => {
        try {
            // Call delete service with the class ID
            const response = await deleteService(`${apiName.deleteFeeStructure}/${feeToDelete}`);
            console.log('blvblvlblv', response)
            showToast('Fee structure deleted successfully', 'success');
            fetchFeeStructures(); // Refresh the class list
        } catch (error) {
            console.log('errorerror', error)
            showToast('Error deleting Fee structure', 'error');
        }
        setShowDeleteModal(false); // Close the confirmation modal
        setFeeToDelete(null);    // Clear the class ID
    };

    // Handle Fee Type Change
    const handleFeeGroupChange = (e, index) => {
        const { name, value } = e.target;
        const updatedFeeGroups = [...formData.feeGroups];

        if (name === 'feeType') {
            // When feeType is selected, find the selected feeType by ID from the feeTypes list
            const selectedFeeType = feeTypes.find(fee => fee.name === value);
            updatedFeeGroups[index][name] = selectedFeeType ? selectedFeeType.name : ''; // Store the name of the feeType
        } else {
            updatedFeeGroups[index][name] = value;
        }

        setFormData({ ...formData, feeGroups: updatedFeeGroups });
    };

    // Handle Add Fee Type
    const handleAddFeeGroup = () => {
        setFormData((prevData) => ({
            ...prevData,
            feeGroups: [...prevData.feeGroups, { feeType: '', amount: '', dueDate: '' }]
        }));
    };

    const handleDeleteFeeGroup = (index) => {
        const updatedFeeGroups = formData.feeGroups.filter((_, i) => i !== index);
        setFormData({ ...formData, feeGroups: updatedFeeGroups });
    };

    return (
        <div className="container mx-auto p-4">
            {/* Fee Structure Table */}
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-800">Fee Structures</h1>
                <button
                    onClick={() => {setShowModal(true),setEditMode(false)}} // Show modal when clicking Add Fee Structure button
                    className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    <FaPlus className="mr-2" /> Add Fee Structure
                </button>
            </div>

            {loading ? (
                <Loader /> // Show loading spinner if data is being fetched
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600">
                                <th className="py-3 px-6 text-left text-sm font-semibold">Name</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">Class</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                    <tbody>
    {feeStructures.map((structure) => (
        <React.Fragment key={structure._id}>
            <tr
                className="border-b hover:bg-gray-50 transition duration-200 cursor-pointer"
                onClick={() => toggleExpandFeeStructure(structure._id)} // Toggle expansion on row click
            >
                <td className="py-3 px-6 text-sm text-gray-800">{structure.name}</td>
                <td className="py-3 px-6 text-sm text-gray-800">
                    {structure.class ? structure.class.name : 'No Class Assigned'}
                </td>
                <td className="py-3 px-6 flex space-x-4">
                    <button
                        onClick={() => handleEditFeeStructure(structure)}
                        className="text-blue-500 hover:text-blue-700 transition duration-200"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => handleDeleteFeeStructure(structure?._id)}
                        className="text-red-500 hover:text-red-700 transition duration-200"
                    >
                        <FaTrash />
                    </button>
                </td>
            </tr>

            {/* Conditionally render fee groups for the expanded row */}
            {expandedFees[structure._id] && structure.feeGroups && structure.feeGroups.length > 0 && (
 <tr>
 <td colSpan="3" className="px-6 py-4">
     <div className="space-y-2">
         {structure.feeGroups.map((group) => (
             <div key={group._id} className="flex flex-col bg-gray-100 p-3 rounded-md">
                 <div className="flex justify-between">
                     <span className="font-semibold text-gray-700">Fee Type:</span>
                     <span className="text-gray-600">{group.feeType}</span>
                 </div>
                 <div className="flex justify-between">
                     <span className="font-semibold text-gray-700">Amount:</span>
                     <span className="text-gray-600">{group.amount}</span>
                 </div>
                 <div className="flex justify-between">
                     <span className="font-semibold text-gray-700">Due Date:</span>
                     <span className="text-gray-600">
                         {new Date(group.dueDate).toLocaleDateString()}
                     </span>
                 </div>
             </div>
         ))}
     </div>
 </td>
</tr>
            )}
        </React.Fragment>
    ))}
</tbody>

                    </table>
                </div>
            )}

            {/* Fee Structure Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2  max-h-[85vh] overflow-y-auto">
                        <h2 className="text-2xl font-semibold mb-4">Create Fee Structure</h2>

                        <div className="mb-4">
                            <label className="block text-gray-700">Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700">Class:</label>
                            <select
                                name="class"
                                value={formData.class}
                                onChange={handleInputChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            >
                                <option value="">Select Class</option>
                                {classes.map((cls) => (
                                    <option key={cls._id} value={cls._id}>
                                        {cls.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700">Fee Types:</label>
                            {formData.feeGroups.map((feeGroup, index) => (
                                <div key={index} className="mb-4">
                                    <div className="flex space-x-4">
                                        <select
                                            name="feeType"
                                            value={feeGroup.feeType} // This will display the name of the fee type
                                            onChange={(e) => handleFeeGroupChange(e, index)}
                                            className="p-2 border border-gray-300 rounded-md w-full"
                                        >
                                            <option value="">Select Fee Type</option>
                                            {feeTypes.map((fee) => (
                                                <option key={fee._id} value={fee.name}> {/* Use the name for the value */}
                                                    {fee.name} {/* Display the fee name */}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            name="amount"
                                            value={feeGroup.amount}
                                            onChange={(e) => handleFeeGroupChange(e, index)}
                                            placeholder="Amount"
                                            className="p-2 border border-gray-300 rounded-md w-full"
                                        />
                                        <input
                                            type="date"
                                            name="dueDate"
                                            value={feeGroup.dueDate}
                                            onChange={(e) => handleFeeGroupChange(e, index)}
                                            className="p-2 border border-gray-300 rounded-md w-full"
                                        />
                                        <button
                                        type="button"
                                        onClick={() => handleDeleteFeeGroup(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash />
                                    </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={handleAddFeeGroup}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Add Fee Type
                            </button>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => {
                                    setShowModal(false), setFormData({
                                        name: '',
                                        class: '',
                                        feeGroups: [{ feeType: '', amount: '', dueDate: '' }]
                                    })
                                }}
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddFeeStructure}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Fee Type Modal (Edit/Delete) */}
            {showFeeGroupModal && selectedFeeGroup && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                        <h2 className="text-2xl font-semibold mb-4">Edit Fee Type</h2>

                        <div className="mb-4">
                            <label className="block text-gray-700">Fee Type:</label>
                            <input
                                type="text"
                                value={selectedFeeGroup.feeType}
                                onChange={(e) =>
                                    setSelectedFeeGroup((prev) => ({ ...prev, feeType: e.target.value }))
                                }
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700">Amount:</label>
                            <input
                                type="number"
                                value={selectedFeeGroup.amount}
                                onChange={(e) =>
                                    setSelectedFeeGroup((prev) => ({ ...prev, amount: e.target.value }))
                                }
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700">Due Date:</label>
                            {console.log('selectedFeeGroup', selectedFeeGroup)}
                            <input
                                type="date"
                                value={selectedFeeGroup.dueDate?.split('T')[0]}
                                onChange={(e) =>
                                    setSelectedFeeGroup((prev) => ({ ...prev, dueDate: e.target.value }))
                                }
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setShowFeeGroupModal(false)}
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteFeeGroup(selectedFeeGroup._id)}
                                className="px-6 py-3 bg-red-500 text-white rounded-lg"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setShowFeeGroupModal(false)} // Implement save logic if needed
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to delete this fee structure?</h2>
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

export default FeeStructure;
