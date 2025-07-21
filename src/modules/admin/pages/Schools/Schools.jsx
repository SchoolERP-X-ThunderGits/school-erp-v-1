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
import { Link, useNavigate } from 'react-router-dom';
import { UploadFile } from '../../../../components/UploadFile';

const Schools = () => {
  const [schoolsList, setSchoolsList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [schoolSession, setSchoolSession] = useState();
  const [editId, setEditId] = useState('');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete confirmation modal
  const navigate = useNavigate()
  const [schoolToDelete, setSchoolToDelete] = useState(null); // Track school to delete





  const [showBillModal, setShowBillModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const current = new Date();
    return `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`; // format: YYYY-MM
  });
  const [billingSchool, setBillingSchool] = useState(null); // to track which school's bill is being generated




  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    schoolEmail: '',
    contactNumber: '',
    fullName: '',
    subdomain: '',
    schoolName: '',
    website: '',
    address: '',
    addressForIdCard: '',
    prefix: '',
    logo: '',
    studentCount: '',
    directorSignature: '',
    principalSignature: '',
    managerSignature: '',
    razorPayID: '',
    razorPaySecret: '',
  });
  const fields = [
    { label: 'Username', name: 'username' },
    { label: 'Password', name: 'password' },
    { label: 'Email', name: 'email' },
    { label: 'School Email', name: 'schoolEmail' },
    { label: 'Contact Number', name: 'contactNumber' },
    { label: 'Full Name', name: 'fullName' },
    { label: 'Subdomain', name: 'subdomain' },
    { label: 'School Name', name: 'schoolName' },
    { label: 'Website', name: 'website' },
    { label: 'Address', name: 'address' },
    { label: 'Address For Id Card', name: 'addressForIdCard' },
    { label: 'Admission Number Prefix', name: 'prefix' },
    { label: 'Student Count', name: 'studentCount' },
    { label: 'Razorpay Key Id', name: 'razorPayID' },
    { label: 'Razorpay Key Secret', name: 'razorPaySecret' },
  ];
  const editFields = [

    { label: 'Email', name: 'email' },
    { label: 'School Email', name: 'schoolEmail' },
    { label: 'Contact Number', name: 'contactNumber' },
    { label: 'Full Name', name: 'fullName' },
    { label: 'Subdomain', name: 'subdomain' },
    { label: 'School Name', name: 'schoolName' },
    { label: 'Website', name: 'website' },
    { label: 'Address', name: 'address' },
    { label: 'Address For Id Card', name: 'addressForIdCard' },
    { label: 'Admission Number Prefix', name: 'prefix' },
    { label: 'Student Count', name: 'studentCount' },
    { label: 'Razorpay Key Id', name: 'razorPayID' },
    { label: 'Razorpay Key Secret', name: 'razorPaySecret' },
  ]
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
      username: schoolData?.user?.username,
      email: schoolData.user?.email,
      schoolEmail: schoolData?.email,
      contactNumber: schoolData?.contactNumber,
      fullName: schoolData?.user?.fullName,
      subdomain: schoolData?.subdomain,
      schoolName: schoolData?.name,
      website: schoolData?.website,
      address: schoolData?.address,
      addressForIdCard: schoolData?.addressForIdCard,
      prefix: schoolData?.prefix,
      studentCount: schoolData?.studentCount,
      logo: schoolData?.logo,
      directorSignature: schoolData?.directorSignature,
      principalSignature: schoolData?.principalSignature,
      managerSignature: schoolData?.managerSignature,
      razorPayID: schoolData?.razorPayID || '',
      razorPaySecret: schoolData?.razorPaySecret || '',
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

    // Define the required fields
    const addRequiredFields = [
      'username', 'password', 'email', 'schoolEmail', 'contactNumber', 'fullName',
      'schoolName', , 'address', 'addressForIdCard', 'prefix', 'studentCount', 'logo'
    ];
    const editRequiredFields = [
      'email', 'schoolEmail', 'contactNumber', 'fullName', 
      'schoolName', 'address', 'addressForIdCard', 'prefix', 'studentCount', 'logo'
    ];

    const requiredFields = editMode ? editRequiredFields : addRequiredFields;

    // Loop through required fields and check if any are empty
    for (let field of requiredFields) {
      if (!formData[field]) {
        setErrorMessage(`${field} is required.`);
        return;
      }
    }

    // Email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!emailRegex.test(formData.schoolEmail)) {
      setErrorMessage('Please enter a valid school email address.');
      return;
    }

    // Phone number validation regex (adjustable for international numbers)
    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      setErrorMessage('Please enter a valid phone number (10-15 digits).');
      return;
    }

    // Clear previous error message if all fields are valid
    setErrorMessage('');

    // Prepare the body for submission
    const body = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      schoolEmail: formData.schoolEmail,
      contactNumber: formData.contactNumber,
      fullName: formData.fullName,
      subdomain: formData.subdomain,
      schoolName: formData.schoolName,
      website: formData.website,
      address: formData.address,
      addressForIdCard: formData.addressForIdCard,
      prefix: formData.prefix,
      studentCount: formData.studentCount,
      logo: formData.logo,
      directorSignature: formData.directorSignature,
      principalSignature: formData.principalSignature,
      managerSignature: formData.managerSignature,
      razorPayID: formData?.razorPayID || '',
      razorPaySecret: formData?.razorPaySecret || '',
      role: 'admin',
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
        setErrorMessage(error?.response?.data?.message || 'Error adding school.');
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
            addressForIdCard: '',
            prefix: '',
            studentCount: '',
            logo: '',
            directorSignature: '',
            principalSignature: '',
            managerSignature: '',
            razorPayID: '',
            razorPaySecret: '',
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
                      <th key={header} className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400 text-left">{header}</th>
                    ))}
                    <th className='px-5 py-3 font-medium text-gray-500 dark:text-gray-400 text-left'>Action</th>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {schoolsList?.map((schoolItem) => (
                    <TableRow className='border-gray-200 dark:border-gray-900 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800' key={schoolItem._id}>
                      <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                        <button
                          onClick={() => navigate(`/admin/schools/${schoolItem?._id}`)} // Navigate to student details page
                          className="text-blue-500 hover:text-blue-700 transition duration-200 dark:text-blue-400 dark:hover:text-blue-500"
                        >
                          {schoolItem?.name}
                        </button>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{schoolItem.email}</TableCell>
                      <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{schoolItem.website}</TableCell>
                      <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{schoolItem.isActive ? "Active" : 'DeActive'}</TableCell>
                      <TableCell className="px-5 py-4">
                        <div className='flex gap-3 justify-start items-center'>
                          {/* <Button
                            onClick={() => {
                              setBillingSchool(schoolItem); // optional: store the school object
                              setShowBillModal(true);
                            }}
                          >
                            Bill
                          </Button> */}

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
                {
                  editMode
                    ? editFields.map(({ label, name }) => (
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
                    ))
                    : fields.map(({ label, name }) => (
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
                    ))
                }

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
          <div className="bg-white dark:bg-gray-900 p-8 ">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Are you sure you want to delete this school?</h2>
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
      <Modal
        isOpen={showBillModal}
        onClose={() => setShowBillModal(false)}
        className="max-w-[500px] m-4"
      >
        <div className="relative w-full overflow-hidden rounded-3xl bg-white p-6 dark:bg-gray-900">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Generate Bill for {billingSchool?.name}
          </h2>

          <div className="mb-4">
            <Label className="text-gray-600">Select Month</Label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setShowBillModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log('Generating bill for:', billingSchool, 'Month:', selectedMonth);
                setShowBillModal(false);
                // you can call your API here
              }}
            >
              Generate Bill
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Schools;