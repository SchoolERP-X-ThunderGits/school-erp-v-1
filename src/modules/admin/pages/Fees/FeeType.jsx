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

const FeeType = () => {
    const [feeTypeList, setFeeTypeList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [feeName, setFeeName] = useState('');
    const [description, setDescription] = useState();
    const [ErrorMessage, setErrorMessage] = useState('')
    const [editId, setEditId] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete confirmation modal
    const [classToDelete, setClassToDelete] = useState(null); // Track fee to delete

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
        setErrorMessage('')
        setEditMode(true);
        setEditId(classData._id);
        setFeeName(classData.name);
        setDescription(classData.description)
    };

    const handleDelete = (classId) => {
        setClassToDelete(classId); // Store fee ID for deletion
        setShowDeleteModal(true);  // Show confirmation modal
    };

    const handleAddClass = async (e) => {
        e.preventDefault()
        if (!feeName ) {
            setErrorMessage('All fields are required');
            return;
        }
        const body = {
            name: feeName,
            description: description,
        };

        if (editMode) {
            try {
                const response = await putService(`${apiName.updateFee}/${editId}`, body);
                showToast("Fee updated successfully.", 'success');
                getFeeTypeList();
            } catch (error) {
                setErrorMessage(error?.response?.data?.message)
                console.error('Error posting data:', error);
            }
        } else {
            try {
                const response = await postService(apiName.addFee, body);
                showToast("Fee added successfully.", 'success');
                getFeeTypeList();
            } catch (error) {
                // showToast(error.response.data?.error, 'error');
                setErrorMessage(error.response.data?.error)
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
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-900">
            {/* Add Class Button */}
            <div className='w-full p-4 flex justify-between items-center'>
                <div className='text-3xl font-medium'>FeeType List</div>
                <Button onClick={() => { setShowModal(true), setFeeName(''), setDescription(''), setErrorMessage('') }}>
                    <Link>Add FeeType</Link>
                </Button>
            </div>
            {
                loading ? <Loader />
                    :

                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        {feeTypeList.length == 0 ?
                            <p style={{ textAlign: 'center', margin: 10 }}>No fee type found</p> :
                            <Table className="w-full text-left border-collapse">
                                <TableHeader className='bg-gray-100 dark:bg-gray-800'>
                                    <TableRow>
                                        {['Fee Name', 'Fee Description'].map((header) => (
                                            <th key={header} className="px-5 py-3 font-medium text-gray-500 text-left">{header}</th>
                                        ))}
                                        <th className='px-5 py-3 font-medium text-gray-500 text-left'>Action</th>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {feeTypeList?.map((feeItem) => (
                                        <TableRow className='border-gray-200 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800' key={feeItem._id}>
                                            <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{feeItem?.name}</TableCell>
                                            <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{feeItem.description?feeItem.description:'N/A'}</TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className='flex gap-3 justify-start items-center'>
                                                    <Link onClick={() => handleEdit(feeItem)}>
                                                        <MdOutlineModeEdit className='dark:text-white' />
                                                    </Link>
                                                    <Link onClick={() => handleDelete(feeItem._id)}>
                                                        <MdDelete className='dark:text-white' />
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>}
                    </div>
            }

            {/* Add Fee Modal */}
            <Modal isOpen={showModal} onClose={() => {
                setShowModal(false)
                setErrorMessage('')
            }} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Add FeeType
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Here we are adding diffrent feetypes.
                        </p>
                    </div>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                            <div>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div>
                                        <Label >Fee Name</Label>
                                        <Input
                                            type="text"
                                            value={feeName}
                                            onChange={(e) => setFeeName(e.target.value)}
                                            placeholder="Enter fee name"
                                        />
                                    </div>
                                    <div>
                                        <Label >Fee Description</Label>
                                        <Input
                                            type="text"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Enter fee description"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                        <h3 style={{ textAlign: 'start', color: 'red', marginLeft: 10 }}>{ErrorMessage}</h3>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={() => { setShowModal(false); setEditMode(false); setEditId(''); }}>
                                Close
                            </Button>
                            <Button
                                onClick={e => { handleAddClass(e) }}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                {editMode ? 'Update Fee' : 'Add feeType'}
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
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to delete this feetype?</h2>
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

export default FeeType;
