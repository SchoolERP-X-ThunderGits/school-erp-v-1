import React, { useEffect, useState } from 'react';
import { MdDelete, MdOutlineModeEdit } from "react-icons/md";
import { getService, postService, putService, deleteService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import Loader from '../../../../components/Loader';
import { Modal } from '../../../../components/ui/modal';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../components/ui/table/index';
import Button from '../../../../components/ui/button/Button';
import Input from '../../../../components/form/input/InputField';
import Checkbox from '../../../../components/form/input/Checkbox';
import Label from '../../../../components/form/Label';
import { showToast } from '../../../../components/Toast';
import { Link } from 'react-router-dom';

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
    const [ErrorMessage, setErrorMessage] = useState('')
    const [sectionList, setSectionList] = useState([])

    useEffect(() => {
        setLoading(true);
        getClassList();
        getSectionList()
    }, []);

    const getSectionList = async () => {
        try {
            const result = await getService(apiName.getSectionList); // API endpoint (e.g. '/posts')
            setSectionList(result.data)
        } catch (error) {
            setLoading(false);
        }
    };


    const getClassList = async () => {
        try {
            const result = await getService(apiName.getClassList); // API endpoint (e.g. '/posts')
            setEditMode(false);
            setEditId('');
            setClassList(result.data);
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
        console.log('sfksdfksfs', classData)
        setSelectedSections(classData.sections);
    };

    const handleDelete = (classId) => {
        setClassToDelete(classId); // Store class ID for deletion
        setShowDeleteModal(true);  // Show confirmation modal
    };

    const handleSectionChange = (section) => {
        setErrorMessage('')
        setSelectedSections((prevSelectedSections) =>
            prevSelectedSections?.includes(section)
                ? prevSelectedSections?.filter((sec) => sec !== section) // deselect if already selected
                : [...prevSelectedSections, section] // select the section
        );
    };

    const handleAddClass = async (e) => {
        e.preventDefault();
        if (!newClassName || selectedSections.length === 0) {
            setErrorMessage('All fields are required')
            return;
        }
        const body = {
            name: newClassName,
            sections: selectedSections,
        };

        if (editMode) {
            try {
                const response = await putService(`${apiName.updateClass}/${editId}`, body);
                showToast("Class updated successfully.", 'success');
                getClassList();
            } catch (error) {
                setErrorMessage(error?.response?.data?.error)
                console.error('Error posting data:', error);
            }
        } else {
            try {
                const response = await postService(apiName.addClass, body);
                showToast("Class added successfully.", 'success');
                getClassList();
            } catch (error) {
                setErrorMessage(error?.response?.data?.error)
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
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
            {/* Add Class Button */}
            <div className='w-full p-4 flex justify-between items-center'>
                <div className='text-3xl font-medium text-gray-800 dark:text-white'>Classes List</div>
                <Button onClick={() => {
                    if (sectionList.length == 0) {
                        showToast('Please add sections first', 'error')
                    } else {
                        setShowModal(true), setNewClassName(''), setSelectedSections([]), setErrorMessage(''), setEditMode(false);
                    }
                }}>
                    <Link>Add Class</Link>
                </Button>
            </div>
            {

                loading ? <Loader /> :
                    <div className="max-w-full overflow-x-auto">
                        {classList.length === 0 ?
                            <p className="text-center text-gray-500 dark:text-gray-300" style={{ margin: 10 }}>No Class found</p> :
                            <Table className="w-full text-left border-collapse">
                                <TableHeader className='bg-gray-100 dark:bg-gray-800'>
                                    <TableRow>
                                        {['Class Name', 'Sections'].map((header) => (
                                            <th key={header} className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400 text-left">{header}</th>
                                        ))}
                                        <th className='px-5 py-3 font-medium text-gray-500 dark:text-gray-400 text-left'>Action</th>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {classList?.map((classItem) => (
                                        <TableRow className='border-gray-200 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800' key={classItem._id}>
                                            <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{classItem?.name}</TableCell>
                                            {console.log('classItemclassItem', classItem)}
                                            <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{classItem.sections?.join(', ')}</TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className='flex gap-3 justify-start items-center'>
                                                    <Link onClick={() => handleEdit(classItem)}>
                                                        <MdOutlineModeEdit className='dark:text-white' />
                                                    </Link>
                                                    <button onClick={() => handleDelete(classItem._id)}>
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

            {/* Modal for Add/Edit Class */}
            <Modal isOpen={showModal} onClose={() => {
                setShowModal(false)
                setErrorMessage('')
            }} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Add Class
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Add new class here for students.
                        </p>
                    </div>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                            <div>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div>
                                        <Label >Class Name</Label>
                                        <Input
                                            type="text"
                                            value={newClassName}
                                            onChange={(e) => { setNewClassName(e.target.value), setErrorMessage('') }}
                                            placeholder="Enter class name"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Sections</Label>
                                    <div className="mt-2 flex flex-wrap gap-4">
                                        {sectionList.map((section) => (
                                            <div key={section} style={{ flexDirection: 'column' }} className="flex items-center">
                                                <Checkbox
                                                    id={section?._id}
                                                    checked={selectedSections?.includes(section?.name)}
                                                    onChange={() => handleSectionChange(section?.name)}
                                                />
                                                <Label htmlFor={section} className="text-sm text-gray-600 dark:text-gray-400">
                                                    {section?.name}
                                                </Label>
                                            </div>
                                        ))}
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
                                onClick={(e) => handleAddClass(e)}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                {editMode ? 'Update class' : 'Add class'}
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
                    <div className="bg-white dark:bg-gray-900 p-8 ">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Are you sure you want to delete this class?</h2>
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

export default Class;
