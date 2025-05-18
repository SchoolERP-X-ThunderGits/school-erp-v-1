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
import Select from '../../../../components/form/Select';
import { FaTrash } from 'react-icons/fa';
const FeeStructure = () => {
    const [feeStructures, setFeeStructures] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false); // Modal state for adding fee structure
    const [ErrorMessage, setErrorMessage] = useState('')
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
    const handleAddFeeStructure = async (e) => {
        e.preventDefault()
        console.log('Form Data for New Fee Structure:', formData);
        if (!formData.name || !formData.class || formData.feeGroups.some((group) => !group.feeType || !group.amount || !group.dueDate)) {
            setErrorMessage("Please fill all the fields.");
            return;
        }

        // If editing, call PUT service to update the fee structure
        if (editMode) {
            try {
                const response = await putService(`${apiName.updateFeeStructure}/${feeToDelete}`, formData);
                showToast("Fee structure updated successfully.", 'success');
                setShowModal(false);
                setFormData({
                    name: '',
                    class: '',
                    feeGroups: [{ feeType: '', amount: '', dueDate: '' }]
                });
                fetchFeeStructures();
            } catch (error) {
                setErrorMessage(error?.response?.data?.message)
                showToast(error?.response?.data?.error, 'error')
                console.error('Error posting data:', error);
            }
        } else {
            try {
                const response = await postService(apiName.addFeeStructure, formData);
                showToast("Fee structure added successfully.", 'success');
                fetchFeeStructures();
                setShowModal(false);
                setFormData({
                    name: '',
                    class: '',
                    feeGroups: [{ feeType: '', amount: '', dueDate: '' }]
                });
            } catch (error) {
                showToast(error?.response?.data?.error, 'error')
                console.error('Error posting data:', error);
            }
        }


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


    const handleConfirmDelete = async () => {
        try {
            // Call delete service with the class ID
            const response = await deleteService(`${apiName.deleteFeeStructure}/${feeToDelete}`);
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
    const handleFeeTypeGroupChange = (e, index) => {
        // const { name, value } = e.target;
        const updatedFeeGroups = [...formData.feeGroups];


        const selectedFeeType = feeTypes.find(fee => fee._id === e);
        updatedFeeGroups[index]['feeType'] = selectedFeeType ? selectedFeeType.name : ''; // Store the name of the feeType
        setFormData({ ...formData, feeGroups: updatedFeeGroups });
    };

    // Handle Add Fee Type
    const handleAddFeeGroup = (e) => {
        e.preventDefault()
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
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700">
            {/* Add Class Button */}
            <div className="w-full p-4 flex justify-between items-center">
                <div className="text-3xl font-medium text-gray-800 dark:text-white">Fee Structures List</div>
                <Button onClick={() => {
                    if (classes.length == 0) {
                        showToast('Please add a class first.', 'error')
                    } else if (feeTypes.length == 0) {
                        showToast('Please add a fee type.', 'error')
                    } else {
                        setShowModal(true), setEditMode(false)
                    }
                     setFormData({
                                    name: '',
                                    class: '',
                                    feeGroups: [{ feeType: '', amount: '', dueDate: '' }]
                                })
                }}>
                    <Link>Add Fee Structures</Link>
                </Button>
            </div>

            {loading ? (
                <Loader /> // Show loading spinner if data is being fetched
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg dark:bg-gray-900">
                    {feeStructures.length == 0 ?
                        <p style={{ textAlign: 'center', margin: 10 }} className="text-gray-700 dark:text-gray-300">No fee structures found</p> :
                        <Table className="w-full text-left border-collapse">
                            <TableHeader className="bg-gray-100 dark:bg-gray-800">
                                <TableRow>
                                    {['Name', 'Class'].map((header) => (
                                        <th key={header} className="px-5 py-3 font-medium text-gray-500 text-left dark:text-gray-400">
                                            {header}
                                        </th>
                                    ))}
                                    <th className="px-5 py-3 font-medium text-gray-500 text-left dark:text-gray-400">Action</th>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {feeStructures?.map((structure) => (
                                    <React.Fragment key={structure._id}>
                                        {/* Main Row */}
                                        <tr
                                            onClick={() => toggleExpandFeeStructure(structure._id)}
                                            className="border-gray-200 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800"
                                        >
                                            <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                                {structure?.name}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                                {structure.class ? structure.class.name : 'No Class Assigned'}
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className="flex gap-3 justify-start items-center">
                                                    <Link onClick={() => handleEditFeeStructure(structure)}>
                                                        <MdOutlineModeEdit className="dark:text-white" />
                                                    </Link>
                                                    <Link onClick={() => handleDeleteFeeStructure(structure?._id)}>
                                                        <MdDelete className="dark:text-white" />
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </tr>

                                        {/* Expanded Table Below Main Row */}
                                        {expandedFees[structure._id] && structure.feeGroups && structure.feeGroups.length > 0 && (
                                            <tr>
                                                <td colSpan="3">
                                                    <Table className="min-w-full table-auto bg-gray-50 dark:bg-gray-600">
                                                        <TableHeader className='bg-gray-100 dark:bg-gray-800'>
                                                            <TableRow>
                                                                {['Fee Type', 'Amount', 'Due Date'].map((header) => (
                                                                    <th key={header} className="px-5 py-3 font-medium text-gray-500 text-left dark:text-gray-200">
                                                                        {header}
                                                                    </th>
                                                                ))}
                                                            </TableRow>
                                                        </TableHeader>

                                                        <TableBody>
                                                            {structure.feeGroups.map((group) => (
                                                                <TableRow
                                                                    key={group._id}
                                                                    className="border-gray-200 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800"
                                                                >
                                                                    <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                                                        {group.feeType}
                                                                    </TableCell>
                                                                    <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                                                        {group.amount}
                                                                    </TableCell>
                                                                    <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                                                        {new Date(group.dueDate).toLocaleDateString()}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    }
                </div>
            )}

            {/* Fee Structure Modal */}
            <Modal isOpen={showModal} onClose={() => {
                setShowModal(false);
                setErrorMessage('');
            }} className="max-w-[700px] m-4">
                <div className="w-full max-w-[700px] max-h-[90vh] bg-white dark:bg-gray-900 rounded-3xl p-4 lg:p-11 flex flex-col">
                    {/* Header */}
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Create Fee Structure
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Here we are creating fee structure.
                        </p>
                    </div>

                    {/* Scrollable form section */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-3">
                        <form className="flex flex-col space-y-4">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Name</Label>
                                    <Input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData((prevData) => ({
                                            ...prevData,
                                            name: e.target?.value
                                        }))}
                                        placeholder="Enter name"
                                        className="bg-gray-50 dark:bg-gray-700"
                                    />
                                </div>
                                <div>
                                    <Label>Class</Label>
                                    <Select
                                        placeholder='Select class'
                                        options={classes.map((cls) => ({
                                            value: cls?._id,
                                            label: cls.name,
                                        }))}
                                        defaultValue={formData.class}
                                        onChange={(e) => {
                                            console.log('sfkdsfksf',e,formData.class)
                                            setFormData((prevData) => ({
                                            ...prevData,
                                            class: e
                                        }))}}
                                        className="bg-gray-50 dark:bg-gray-700"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="block text-gray-700 mb-2 dark:text-gray-300">Fee Types:</Label>
                                {formData.feeGroups.map((feeGroup, index) => (
                                    <div key={index} className="mb-4">
                                        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                                            <div className="w-full sm:w-55">
                                                <Select
                                                    placeholder="Select fee type"
                                                    options={feeTypes.map((fee) => ({
                                                        value: fee?._id,
                                                        label: fee.name,
                                                    }))}
                                                    value={feeTypes.map((fee) => ({
                                                        value: fee?._id,
                                                        label: fee.name,
                                                    })).find(option => option.label === feeGroup.feeType)?.value}
                                                    onChange={(e) => handleFeeTypeGroupChange(e, index)}
                                                    className="bg-gray-50 dark:bg-gray-700"
                                                />
                                            </div>
                                            <Input
                                                type="number"
                                                name="amount"
                                                value={feeGroup.amount}
                                                onChange={(e) => handleFeeGroupChange(e, index)}
                                                placeholder="Amount"
                                                className="bg-gray-50 dark:bg-gray-700"
                                            />
                                            <Input
                                                type="date"
                                                name="dueDate"
                                                value={feeGroup.dueDate}
                                                onChange={(e) => handleFeeGroupChange(e, index)}
                                                className="bg-gray-50 dark:bg-gray-700"
                                            />
                                            <button
                                                disabled={formData.feeGroups.length === 1}
                                                onClick={() => handleDeleteFeeGroup(index)}
                                                className="bg-red text-red-500 hover:text-red-700 mt-2 sm:mt-0"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    onClick={handleAddFeeGroup}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-2"
                                >
                                    Add Fee Type
                                </Button>
                            </div>
                            <h3 className="text-red-500 ml-2">{ErrorMessage}</h3>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-3 px-2 mt-4 lg:justify-end">
                        <Button size="sm" variant="outline" onClick={() => {
                            setShowModal(false);
                            setFormData({
                                name: '',
                                class: '',
                                feeGroups: [{ feeType: '', amount: '', dueDate: '' }]
                            });
                            setErrorMessage('');
                            setEditMode(false);
                        }}>
                            Close
                        </Button>
                        <Button
                            onClick={(e) => {
                                handleAddFeeStructure(e)
                            }}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                            {editMode ? 'Update fee structures' : 'Add fee structures'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={showDeleteModal} onClose={() => {
                setShowDeleteModal(false)
                setErrorMessage('')
            }} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="bg-white p-8 dark:bg-gray-800">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Are you sure you want to delete this fee structure?</h2>
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

export default FeeStructure;
