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
import { UploadFile } from '../../../../components/UploadFile';
import { sessionsArray } from '../../../../constants/GlobalConstants';
import Select from '../../../../components/form/Select';

const Schools = () => {
    const [schoolsList, setSchoolsList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [schoolName, setSchoolName] = useState('');
    const [schoolSession, setSchoolSession] = useState();
    const [editId, setEditId] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete confirmation modal
    const [schoolToDelete, setSchoolToDelete] = useState(null); // Track school to delete
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        contactNumber: '',
        fullName: '',
        subdomain: '',
        schoolName: '',
        website: '',
        address: '',
        prefix: '',
        logo: '',
        directorSignature: '',
        principalSignature: '',
        managerSignature: ''
    });
    const [ErrorMessage, setErrorMessage] = useState('')
    useEffect(() => {
        setLoading(true);
        getSchoolsList();
    }, []);

    const getSchoolsList = async () => {
        try {
            const result = await getService(apiName.schools); // API endpoint (e.g. '/posts')
            console.log('fsklfksfd', result)
            setEditMode(false);
            setEditId('');
            setSchoolsList(result);
            setSchoolName('');
            setSchoolSession('')
            setShowModal(false);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const handleEdit = (schoolData) => {
        setShowModal(true);
        setEditMode(true);
        setEditId(schoolData._id);
        setFormData({
            username: schoolData?.username,
            password: schoolData?.password,
            email: schoolData?.email,
            contactNumber: schoolData?.contactNumber,
            fullName: schoolData?.fullName,
            subdomain: schoolData?.subdomain,
            schoolName: schoolData?.schoolName,
            website: schoolData?.website,
            address: schoolData?.address,
            prefix: schoolData?.prefix,
            logo: schoolData?.logo,
            directorSignature: schoolData?.directorSignature,
            principalSignature: schoolData?.principalSignature,
            managerSignature: schoolData?.managerSignature
        })
        // setSchoolName(schoolData.name);
        // setSchoolSession(schoolData.session)
    };

    const handleDelete = (schoolId) => {
        setSchoolToDelete(schoolId); // Store school ID for deletion
        setShowDeleteModal(true);  // Show confirmation modal
    };

    const handleAddSchool = async (e) => {
        e.preventDefault();

        // Check if any of the required fields are empty
        const requiredFields = [
            'username', 'password', 'email', 'contactNumber', 'fullName', 'subdomain',
            'schoolName', 'website', 'address', 'prefix', 'logo', 'directorSignature',
            'principalSignature', 'managerSignature'
        ];

        // Loop through the required fields and check if any is empty
        for (let field of requiredFields) {
            if (!formData[field]) {
                setErrorMessage(`${field} is required.`);
                return;
            }
        }

        // Clear previous error message if all fields are valid
        setErrorMessage('');

        const body = {
            username: formData.username,
            password: formData.password,
            email: formData.email,
            contactNumber: formData.contactNumber,
            fullName: formData.fullName,
            subdomain: formData.subdomain,
            schoolName: formData.schoolName,
            website: formData.website,
            address: formData.address,
            prefix: formData.prefix,
            logo: formData.logo,
            directorSignature: formData.directorSignature,
            principalSignature: formData.principalSignature,
            managerSignature: formData.managerSignature,
            role:'admin',
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(formData.website)}`
        };

        // Submit the form
        if (editMode) {
            try {
                const response = await putService(`${apiName.schools}/${editId}`, body);
                console.log('School updated:', response);
                showToast("School updated successfully.", 'success');
                getSchoolsList();
            } catch (error) {
                console.error('Error updating school:', error);
            }
        } else {
            try {
                const response = await postService(apiName.addSchool, body);
                showToast("School added successfully.", 'success');
                getSchoolsList();
            } catch (error) {
                console.error('Error adding school:', error);
            }
        }
    };


    const handleConfirmDelete = async () => {
        try {
            // Call delete service with the school ID
            await deleteService(`${apiName.schools}/${schoolToDelete}`);
            showToast('School deleted successfully', 'success');
            getSchoolsList(); // Refresh the school list
        } catch (error) {
            showToast('Error deleting school', 'error');
        }
        setShowDeleteModal(false); // Close the confirmation modal
        setSchoolToDelete(null);    // Clear the school ID
    };

    const handleInputChange = (e) => {
        const { name, value, files, type } = e.target;
        if (type === 'file' && files && files[0]) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
            UploadFile(files[0])
                .then(url => {
                    setFormData(prev => ({ ...prev, [name]: url }));
                })
                .catch(error => {
                    console.error(error);
                    showToast(error, 'error');
                });
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-900">
            {/* Add Class Button */}
            <div className='w-full p-4 flex justify-between items-center'>
                <div className='text-3xl font-medium'>Schools List</div>
                <Button onClick={() => {
                    setShowModal(true), setErrorMessage(''), setEditMode(false), setEditId(), setFormData({
                        username: '',
                        password: '',
                        email: '',
                        contactNumber: '',
                        fullName: '',
                        subdomain: '',
                        schoolName: '',
                        website: '',
                        address: '',
                        prefix: '',
                        logo: '',
                        directorSignature: '',
                        principalSignature: '',
                        managerSignature: ''
                    })
                }}>
                    <Link>Add School</Link>
                </Button>
            </div>
            {
                loading ? <Loader />
                    :

                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        {schoolsList.length == 0 ?
                            <p style={{ textAlign: 'center', margin: 10 }}>No schools found</p> :
                            <Table className="w-full text-left border-collapse">
                                <TableHeader className='bg-gray-100 dark:bg-gray-800'>
                                    <TableRow>
                                        {['School Name', 'Email', 'Website', 'Status'].map((header) => (
                                            <th key={header} className="px-5 py-3 font-medium text-gray-500 text-left">{header}</th>
                                        ))}
                                        <th className='px-5 py-3 font-medium text-gray-500 text-left'>Action</th>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {schoolsList?.map((schoolItem) => (
                                        <TableRow className='border-gray-200 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800' key={schoolItem._id}>
                                            <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{schoolItem?.name}</TableCell>
                                            <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{schoolItem.email}</TableCell>
                                            <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{schoolItem.website}</TableCell>
                                            <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{schoolItem.isActive ? "Active" : 'DeActive'}</TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className='flex gap-3 justify-start items-center'>
                                                    <Link onClick={() => handleEdit(schoolItem)}>
                                                        <MdOutlineModeEdit className='dark:text-white' />
                                                    </Link>
                                                    <Link onClick={() => handleDelete(schoolItem._id)}>
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

            <Modal isOpen={showModal} onClose={() => {
                setShowModal(false);
                setErrorMessage('');
            }} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-hidden rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Add School
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Add new School here.
                        </p>
                    </div>

                    <form className="flex flex-col">
                        {/* Scrollable section starts here */}
                        <div className="custom-scrollbar overflow-y-auto px-2 pb-3" style={{ maxHeight: '40vh' }}>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                {[
                                    { label: 'Username', name: 'username' },
                                    { label: 'Password', name: 'password' },
                                    { label: 'Email', name: 'email' },
                                    { label: 'Contact Number', name: 'contactNumber' },
                                    { label: 'Full Name', name: 'fullName' },
                                    { label: 'Subdomain', name: 'subdomain' },
                                    { label: 'School Name', name: 'schoolName' },
                                    { label: 'Website', name: 'website' },
                                    { label: 'Contact Number', name: 'contactNumber' },
                                    { label: 'Address', name: 'address' },
                                    { label: 'Admission Number Prefix', name: 'prefix' },
                                ].map(({ label, name }) => (
                                    <div key={name}>
                                        <Label className="text-gray-600">{label}:</Label>
                                        <Input
                                            type="text"
                                            name={name}
                                            value={formData?.[name] || ''}
                                            onChange={handleInputChange}
                                            className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        />
                                    </div>
                                ))}
                                <div>
                                    <Label className="text-gray-600">Logo:</Label>
                                    <Input type="file" name="logo" onChange={handleInputChange} className="mt-2" />
                                    {formData?.logo && (
                                        <img src={formData.logo} alt="Logo" className="mt-2 h-20 object-contain rounded-xl shadow" />
                                    )}
                                </div>

                                {['directorSignature', 'principalSignature', 'managerSignature'].map(name => (
                                    <div key={name}>
                                        <Label className="text-gray-600 capitalize">{name.replace(/([A-Z])/g, ' $1')}:</Label>
                                        <Input type="file" name={name} onChange={handleInputChange} className="mt-2" />
                                        {formData?.[name] && (
                                            <img src={formData[name]} alt={name} className="mt-2 h-20 object-contain rounded-xl shadow" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Scrollable section ends */}

                        <h3 className="text-red-500 text-start ml-2">{ErrorMessage}</h3>
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
                                onClick={e => { handleAddSchool(e) }}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                {editMode ? 'Update school' : 'Add school'}
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
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to delete this school?</h2>
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

export default Schools;
