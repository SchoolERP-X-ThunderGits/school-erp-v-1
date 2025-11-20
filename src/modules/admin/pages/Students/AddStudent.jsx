import { useEffect, useState } from 'react';
import { getService, postService } from '../../../../constants/Service'; // Importing services
import apiName from '../../../../constants/ApiName'; // Importing API Names
import { showToast } from '../../../../components/Toast'; // Show Toast Notifications
import AdmissionReceipt from './AdmissionReceipt';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../../constants/Config';
import { bloodGroups, CategoryArray, GenderArray, ReligionArray, sessionsArray } from '../../../../constants/GlobalConstants';
import Button from '../../../../components/ui/button/Button';
import { Modal } from '../../../../components/ui/modal';
import Input from '../../../../components/form/input/InputField';
import Select from '../../../../components/form/Select';
import Label from '../../../../components/form/Label';
import Checkbox from '../../../../components/form/input/Checkbox';
import DatePicker from '../../../../components/form/date-picker';
import moment from 'moment';
const AddStudent = () => {

  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]); // Classes for dropdown
  const [sections, setSections] = useState([]); // Sections for dropdown
  const [imageLoad, setImageLoad] = useState(false);
  const [registrationCompleted, setRegistrationCompleted] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [expandedFees, setExpandedFees] = useState({});
  const [aadharParts, setAadharParts] = useState(["", "", ""]);
  const [bulkStudentModal, setBulkStudentModal] = useState(false)
  const [ErrorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    admission_Number: '',
    address_for_id: '',
    roll_Number: '',
    first_Name: '',
    last_Name: '',
    class_Id: '',
    section: '',
    session: '',
    date_Of_Birth: '',
    gender: '',
    permanent_Address: '',
    address_For_Correspondence: '',
    contact_Number: '',
    alternet_Contact_Number: '',
    email: '',
    nationality: 'India',
    religion: '',
    category: '',
    blood_Group: '',
    father_Name: '',
    father_Occupation: '',
    mother_Name: '',
    mother_Occupation: '',
    due_amount: '',
    date_Of_Admission: moment().format('YYYY-MM-DD'),
    student_Photo: '',
    aadhar_number: '',
    feeStructures: [],
    select_tranport: '',
    transport_address: '',
  });
  const [bulkClassId, setBulkClassId] = useState('')
  const [bulkSection, setBulkSection] = useState('')
  const [bulkFile, setBulkFile] = useState('')
  useEffect(() => {
    setLoading(true);
    fetchClasses();
    fetchFeeStructures()
    fetchStudents()
  }, []);

  const resetForm = () => {
    setImagePreview('')
    setAadharParts(["", "", ""])
    setFormData({
      address_for_id: '',
      roll_Number: '',
      first_Name: '',
      last_Name: '',
      class_Id: '',
      section: '',
      session: '',
      date_Of_Birth: '',
      gender: '',
      permanent_Address: '',
      address_For_Correspondence: '',
      contact_Number: '',
      alternet_Contact_Number: '',
      email: '',
      nationality: 'India',
      religion: '',
      category: '',
      blood_Group: '',
      father_Name: '',
      father_Occupation: '',
      mother_Name: '',
      mother_Occupation: '',
      due_amount: '',
      date_Of_Admission: moment().format('YYYY-MM-DD'),
      student_Photo: '',
      aadhar_number: '',
      feeStructures: []
    })
  }
  const buildStudentUpload = async (e) => {
    e.preventDefault()
    if (!bulkFile) {
      setErrorMessage("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("classId", bulkClassId);
    formData.append("section", bulkSection);
    formData.append("file", bulkFile); // Ensure the file is appended

    try {
      const response = await fetch(`${BASE_URL}${apiName.bulkUpload}`, {
        method: "POST",
        headers: {
          "Authorization": localStorage.getItem('token'),
        },
        body: formData,
      });
      const data = await response.json();
      if (data?.results) {
        showToast(data?.message, 'success')
        setBulkStudentModal(false)
        navigate('/admin/student')
      } else {
        showToast('Invalid file upload, please try again.', 'error')
      }

    } catch (error) {
      console.error("Error uploading file:", error);
      // setResponseMessage(`Error: ${error.message}`);
    }
  };

  const fetchStudents = async () => {
    try {
      const result = await getService(apiName.getStudent); // API to get fee structures
      setEditMode(false)
      setLoading(false)
    } catch (error) {
      showToast('Error fetching fee structures', 'error');
    }
  };
  const fetchFeeStructures = async () => {
    try {
      const result = await getService(apiName.getFeeStructure); // API to get fee structures
      console.log('result', result.data)
      setFeeStructures(result.data); // Save fee structures
    } catch (error) {
      showToast('Error fetching fee structures', 'error');
    }
  };


  const fetchClasses = async () => {
    try {
      const result = await getService(apiName.getClassList); // Get Classes API
      setClasses(result?.data);
    } catch (error) {
      // showToast('Error fetching classes', 'error');
    }
  };

  const handleFeeStructureChange = (checked, feeId) => {
    setFormData((prevData) => {
      let updatedFeeStructures = [...prevData.feeStructures];

      if (checked) {
        // Add the fee structure ID if checked
        updatedFeeStructures.push(feeId);
      } else {
        // Remove the fee structure ID if unchecked
        updatedFeeStructures = updatedFeeStructures.filter(id => id !== feeId);
      }
      { console.log('kkm0000', updatedFeeStructures) }
      return {
        ...prevData,
        feeStructures: updatedFeeStructures,
      };
    });
  };


  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (name == 'class_Id') {
      const filterClassData = classes.filter((classes) => classes._id === value);
      setSections(filterClassData[0]?.sections)
    }
    if (type === 'file') {
      if (files && files[0]) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: files[0] // Store the file object directly in the state
        }));

        // Preview the image
        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setTimeout(() => {
            setImagePreview(reader.result); // Set the image preview after file is loaded
          }, 2000);
        };
        reader.readAsDataURL(file); // Read the file as a data URL
        uploadFile(file);
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value // For other input types, handle them as usual
      }));
    }
  };

  function uploadFile(file) {
    setImageLoad(true)
    const url = `https://api.cloudinary.com/v1_1/dcfrxghei/upload`;
    const fd = new FormData();

    fd.append("upload_preset", "myschool");

    fd.append("file", file);

    fetch(url, {
      method: "POST",
      body: fd,
    })
      .then((response) => response.json())
      .then((data) => {
        // File uploaded successfully
        const url = data.secure_url;
        console.log(url);
        setFormData({
          ...formData,
          student_Photo: url,
        });
        showToast("Image Upload Successfully", 'success');
        setImageLoad(false)
      })
      .catch((error) => {
        console.error("Error uploading the file:", error);
      })
      .finally(() => {
      });
  }

  const handleAadharChange = (e, index) => {
    const { value } = e.target;

    // Allow only digits and limit to 4 characters
    if (/^\d{0,4}$/.test(value)) {
      const updatedParts = [...aadharParts];
      updatedParts[index] = value;
      setAadharParts(updatedParts);
      // Auto-focus to the next input if 4 digits are entered
      if (value.length === 4 && index < 3) {
        const nextInput = document.querySelector(`input[name="aadhar-${index + 1}"]`);
        if (nextInput) nextInput.focus();
      }

      // Auto-focus to the previous input if digits are deleted (length becomes less than 4)
      if (value.length < 4) {
        // Focus the previous input if the current field is emptied
        if (value.length === 0 && index > 0) {
          const prevInput = document.querySelector(`input[name="aadhar-${index - 1}"]`);
          if (prevInput) prevInput.focus();
        }
      }

      // Check if all parts are filled with 4 digits
      const allPartsFilled = updatedParts.every((part) => part.length === 4);
      console.log("All parts filled: ", allPartsFilled);

      // If all parts are filled, update the final Aadhar number in formData
      if (allPartsFilled) {
        const fullAadhar = updatedParts.join("");
        console.log('Full Aadhar:', fullAadhar);
        setFormData((prevData) => ({ ...prevData, aadhar_number: fullAadhar })); // Directly update formData
      }
    }
  };
  const handleFileChange = (event) => {
    setBulkFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    setFormData((prevFormData) => ({
      ...prevFormData,
      date_Of_Admission: formData.date_Of_Admission != '' ? formData.date_Of_Admission.split('T')[0] : new Date().toISOString().split('T')[0]
    }));
    if (!formData.first_Name || !formData.last_Name || !formData?.aadhar_number || !formData?.section || !formData?.session || !formData?.class_Id || !formData?.gender || !formData?.permanent_Address || !formData?.date_Of_Birth || !formData?.contact_Number || !formData?.date_Of_Admission || !formData?.father_Name || !formData?.mother_Name || !formData?.student_Photo || !formData?.category || !formData?.address_for_id) {
      showToast("Please fill all the required fields.", 'error');
      return;
    }
    setImageLoad(true)
    try {
      const response = await postService(apiName.addStudent, formData);
      setRegistrationCompleted(true)

      // navigate('/admin/student')
      setImageLoad(false)
      setFormData({
        ...formData,
        admission_Number: response.result?.admission_Number,
      });
      showToast("Student added successfully.", 'success');
    } catch (error) {
      showToast('Error submitting data', 'error');
      setImageLoad(false)
    }
  };


  const toggleFeeGroupVisibility = (feeId) => {
    setExpandedFees((prevExpandedFees) => ({
      ...prevExpandedFees,
      [feeId]: !prevExpandedFees[feeId], // Toggle the current fee's visibility
    }));
  };
  return (
    <div>
      {
        imageLoad &&
        <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
        </div>
      }
      <form className="px-5 overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-900">
        {/* Add Class Button */}

        {/* {
        imageLoad &&

        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 dark:bg-black dark:bg-opacity-50 z-50">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
      </div>
      
      } */}
        {
          registrationCompleted ?
            <div className=''>
              <AdmissionReceipt resetForm={resetForm} setRegistrationCompleted={setRegistrationCompleted} studentData={formData} />
            </div>
            :
            <form className="flex flex-col">
              <div className='w-full py-4 px-2 flex justify-between items-center'>
                <div className='text-3xl font-medium'>Add Student</div>
                <Button onClick={(e) => { e.preventDefault(); setBulkStudentModal(true) }}>
                  <Link>Import Students</Link>
                </Button>
              </div>
              {/* Scrollable container */}
              <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                {/* Form Fields */}
                <div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">


                    {/* Roll Number */}
                    <div className="mb-4">
                      <Label className="block text-gray-700">Roll Number :</Label>
                      <Input
                        type="number"
                        name="roll_Number"
                        value={formData.roll_Number}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                      />
                    </div>

                    {/* First Name */}
                    <div className="mb-4">
                      <Label className="block text-gray-700">
                        First Name <span className="text-red-500">*</span>:
                      </Label>

                      <Input
                        type="text"
                        name="first_Name"
                        value={formData.first_Name}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                      />
                    </div>

                    {/* Last Name */}
                    <div className="mb-4">

                      <Label className="block text-gray-700">Last Name <span className="text-red-500">*</span>:</Label>
                      <Input
                        type="text"
                        name="last_Name"
                        value={formData.last_Name}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                      />
                    </div>

                    {/* Class Dropdown */}
                    <div className="mb-4">
                      <Label className="block text-gray-700">Class <span className="text-red-500">*</span>:</Label>
                      <Select
                        placeholder='Select Class'
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                        options={classes.map((classItem) => ({
                          value: classItem._id,
                          label: classItem.name,
                        }))}
                        value={formData.class_Id}
                        onChange={(e) => {
                          const filterClassData = classes.filter((classes) => classes._id === e);
                          setSections(filterClassData[0]?.sections)
                          setFormData((prevData) => ({
                            ...prevData,
                            class_Id: e // For other input types, handle them as usual
                          }));
                        }}
                      />
                    </div>

                    {/* Section Dropdown */}
                    <div className="mb-4">
                      <Label className="block text-gray-700">Section <span className="text-red-500">*</span>:</Label>
                      <Select
                        placeholder='Select Section'
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                        options={sections.map((section) => ({
                          value: section,
                          label: section,
                        }))}
                        disabled={!formData.class_Id}
                        value={formData.section}
                        onChange={(e) => {
                          setFormData((prevData) => ({
                            ...prevData,
                            section: e // For other input types, handle them as usual
                          }));
                        }}
                      />
                    </div>

                    {/* Session Dropdown */}
                    <div className="mb-4">
                      <Label className="block text-gray-700">Session <span className="text-red-500">*</span>:</Label>
                      <Select
                        placeholder='Select Session'
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                        options={sessionsArray.map((session) => ({
                          value: session,
                          label: session,
                        }))}
                        value={formData.session}
                        onChange={(e) => {
                          setFormData((prevData) => ({
                            ...prevData,
                            session: e // For other input types, handle them as usual
                          }));
                        }}
                      />
                    </div>

                    {/* Date of Birth */}
                    <div className="mb-4">
                      <Label className="block text-gray-700">Date of Birth <span className="text-red-500">*</span>:</Label>
                      {/* <Input
                        type="date"
                        name="date_Of_Birth"
                        value={formData.date_Of_Birth.split('T')[0]}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                      /> */}
                      <DatePicker
                        id="date_Of_Birth"
                        placeholder="Select a date"
                        onChange={(date) => {

                          setFormData((prevData) => ({
                            ...prevData,
                            date_Of_Birth: moment(date[0]).format('YYYY-MM-DD')
                          }));
                        }}
                        mode="single"
                      />
                    </div>

                    {/* Gender Dropdown */}
                    <div className="mb-4">
                      <Label className="block text-gray-700">Gender <span className="text-red-500">*</span>:</Label>
                      <Select
                        placeholder='Select Gender'
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                        options={GenderArray.map((gen) => ({
                          value: gen,
                          label: gen,
                        }))}
                        value={formData.gender}
                        onChange={(e) => {
                          setFormData((prevData) => ({
                            ...prevData,
                            gender: e // For other input types, handle them as usual
                          }));
                        }}
                      />
                    </div>

                    {/* Permanent Address */}
                    <div className="mb-4 ">
                      <Label className="block text-gray-700">Permanent Address <span className="text-red-500">*</span>:</Label>
                      <Input
                        type="text"
                        name="permanent_Address"
                        value={formData.permanent_Address}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                      />
                    </div>

                    {/* Contact Number */}
                    <div className="mb-4">
                      <Label className="block text-gray-700">Contact Number <span className="text-red-500">*</span>:</Label>
                      <Input
                        type='number'
                        name="contact_Number"
                        value={formData.contact_Number}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                      />
                    </div>

                    <div className="mb-4 ">
                      <Label className="block text-gray-700">Correspondence Address<span className="text-red-500">*</span>:</Label>
                      <Input
                        type="text"
                        name="address_For_Correspondence"
                        value={formData.address_For_Correspondence}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                      />
                      <div style={{ display: 'flex' }}>

                        <Checkbox
                          checked={formData.address_For_Correspondence == formData.permanent_Address}
                          onChange={() => {
                            setFormData((prev) => ({
                              ...prev,
                              address_For_Correspondence: prev.permanent_Address,
                            }));
                          }}
                        />
                        <Label htmlFor="sameAsPermanent" className="text-gray-700 ml-3 mt-1">
                          Same as Permanent Address
                        </Label>
                      </div>
                    </div>


                    <div className="mb-4">
                      <Label className="block text-gray-700">Alternate Contact No:</Label>
                      <Input
                        type="number"
                        name="alternet_Contact_Number"
                        value={formData.alternet_Contact_Number}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                      />
                    </div>
                    <div className="mb-4 ">
                      <Label className="block text-gray-700">Address for Id Card<span className="text-red-500">*</span>:</Label>
                      <Input
                        type="text"
                        name="address_for_id"
                        maxLength={45}
                        value={formData.address_for_id}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                      />
                    </div>
                    {/* Email */}
                    <div className="mb-4">
                      <Label className="block text-gray-700">Email:</Label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                      />
                    </div>

                    {/* Nationality */}
                    <div className="mb-4">
                      <Label className="block text-gray-700">Nationality :</Label>
                      <Input
                        readOnly
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                      />
                    </div>

                    {/* Religion */}
                    <div className="mb-4">
                      <Label className="block text-gray-700">Religion:</Label>
                      <Select
                        placeholder='Select Religion'
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                        options={ReligionArray.map((reg) => ({
                          value: reg,
                          label: reg,
                        }))}
                        value={formData.religion}
                        onChange={(e) => {
                          setFormData((prevData) => ({
                            ...prevData,
                            religion: e // For other input types, handle them as usual
                          }));
                        }}
                      />
                    </div>

                    {/* Category */}
                    <div className="mb-4">
                      <Label className="block text-gray-700">Category <span className="text-red-500">*</span>:</Label>
                      <Select
                        placeholder='Select Category'
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                        options={CategoryArray.map((cat) => ({
                          value: cat,
                          label: cat,
                        }))}
                        value={formData.category}
                        onChange={(e) => {
                          setFormData((prevData) => ({
                            ...prevData,
                            category: e // For other input types, handle them as usual
                          }));
                        }}
                      />
                    </div>

                    {/* Blood Group */}
                    <div className="mb-4">
                      <Label className="block text-gray-700">Blood Group :</Label>
                      <Select
                        placeholder='Select Blood Group'
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                        options={bloodGroups.map((bld) => ({
                          value: bld,
                          label: bld,
                        }))}
                        value={formData.blood_Group}
                        onChange={(e) => {
                          setFormData((prevData) => ({
                            ...prevData,
                            blood_Group: e // For other input types, handle them as usual
                          }));
                        }}
                      />
                    </div>
                    <div className="mb-4">
                      <Label className="block text-gray-700">Transportation:</Label>
                      <Select
                        placeholder='Select Transportation'
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                        options={['Yes', 'No'].map((val) => ({
                          value: val,
                          label: val,
                        }))}
                        value={formData.select_tranport}
                        onChange={(e) => {
                          setFormData((prevData) => ({
                            ...prevData,
                            select_tranport: e // For other input types, handle them as usual
                          }));
                        }}
                      />
                    </div>

                    <div className="mb-4 ">
                      <Label className="block text-gray-700">Transportation Address:</Label>
                      <Input
                        type="text"
                        name="transport_address"
                        maxLength={45}
                        value={formData.transport_address}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                      />
                    </div>

                    {/* Father's Name */}
                    <div className="mb-4">
                      <Label className="block text-gray-700">Father's Name <span className="text-red-500">*</span>:</Label>
                      <Input
                        type="text"
                        name="father_Name"
                        value={formData.father_Name}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                      />
                    </div>

                    {/* Father's Occupation */}
                    <div className="mb-4">
                      <Label className="block text-gray-700">Father's Occupation :</Label>
                      <Input
                        type="text"
                        name="father_Occupation"
                        value={formData.father_Occupation}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                      />
                    </div>

                    {/* Mother's Name */}
                    <div className="mb-4">
                      <Label className="block text-gray-700">Mother's Name <span className="text-red-500">*</span>:</Label>
                      <Input
                        type="text"
                        name="mother_Name"
                        value={formData.mother_Name}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                      />
                    </div>

                    {/* Mother's Occupation */}
                    <div className="mb-4">
                      <Label className="block text-gray-700">Mother's Occupation :</Label>
                      <Input
                        type="text"
                        name="mother_Occupation"
                        value={formData.mother_Occupation}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                      />
                    </div>

                    {/* Due amount */}
                    <div className="mb-4">
                      <Label className="block text-gray-700">Due amount :</Label>
                      <Input
                        type="number"
                        name="due_amount"
                        value={formData.due_amount}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                      />
                    </div>

                    {/* Date of Admission */}

                    <div className="mb-4">
                      <Label className="block text-gray-700">
                        Date of Admission <span className="text-red-500">*</span>:
                      </Label>
                      <DatePicker
                        id="date_Of_Admission"
                        onChange={(date) => {
                          setFormData((prevData) => ({
                            ...prevData,
                            date_Of_Admission: moment(date[0]).format("DD-MM-YYYY"),
                          }));
                        }}
                        defaultDate={
                          formData.date_Of_Admission && formData.date_Of_Admission !== ""
                            ? new Date(formData.date_Of_Admission)
                            : new Date()
                        }
                        mode="single"
                      />
                    </div>

                    {
                      // !editMode &&
                      <div className="mb-4 ">
                        <Label className="block text-gray-700">Student Photo <span className="text-red-500">*</span>:</Label>
                        <Input
                          type="file"
                          name="image"
                          onChange={handleInputChange}
                          className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                        />
                      </div>
                    }
                    {/* Aadhar Number */}
                    <div className="mb-4 col-span-2">
                      <Label className="block text-gray-700">Aadhar Number <span className="text-red-500">*</span>:</Label>
                      <div className="flex space-x-2 mt-2">
                        {[0, 1, 2].map((index) => (
                          <Input
                            key={index}
                            type="number"
                            name={`aadhar-${index}`}
                            value={aadharParts[index]}
                            onChange={(e) => handleAadharChange(e, index)}
                            maxLength="4"
                            className="p-2 border border-gray-300 rounded-md w-1/4 text-center"
                            placeholder="0000"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Student photo */}

                    {imagePreview && (
                      <div className="mt-4 mb-6 flex justify-center items-center">
                        <img src={imagePreview} alt="Student Preview" className="w-30 h-30 object-cover rounded-md" />
                      </div>
                    )}

                  </div>
                </div>
                {
                  // !editMode &&

                  <div className="mb-4 ">
                    <Label className="block text-gray-700">Fee Structure :</Label>
                    <div className="space-y-2 max-h-102 overflow-y-auto">
                      {console.log('feeStructures', feeStructures)}
                      {feeStructures.map((fee) => (
                        <div key={fee._id} className="flex flex-col mb-4">
                          {/* Fee Structure Name */}
                          <div className="flex items-center mb-2">
                            <Checkbox
                              checked={formData.feeStructures?.includes(fee._id)}
                              onChange={(e) => handleFeeStructureChange(e, fee._id)}
                            />
                            <Label
                              className="ml-2 text-gray-700 font-semibold cursor-pointer"
                              onClick={() => toggleFeeGroupVisibility(fee._id)}
                            >
                              {fee.name}
                            </Label>
                          </div>

                          {/* Fee Groups (conditionally rendered based on expanded state) */}
                          {expandedFees[fee._id] && fee.feeGroups && fee.feeGroups.length > 0 && (
                            <div className="ml-4 space-y-2">
                              <table className="min-w-full table-auto border-collapse">
                                <thead>
                                  <tr className="bg-gray-200">
                                    <th className="px-4 py-2 text-left">Fee Type</th>
                                    <th className="px-4 py-2 text-left">Amount</th>
                                    <th className="px-4 py-2 text-left">Due Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {fee.feeGroups.map((group) => (
                                    <tr key={group._id} className="border-b">
                                      <td className="px-4 py-2 text-gray-600">{group.feeType}</td>
                                      <td className="px-4 py-2 text-gray-600">{group.amount}</td>
                                      <td className="px-4 py-2 text-gray-600">
                                        {new Date(group.dueDate).toLocaleDateString()}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                        </div>
                      ))}

                    </div>

                  </div>
                }
              </div>
              {console.log('formDataformData', formData)}
              {/* Submit Button */}
              <div className="flex justify-center mt-6">
                <Button
                  onClick={(e) => {
                    handleSubmit(e)
                  }}
                  className={`w-64 mb-5 px-4 py-2 rounded-md text-white ${!formData.first_Name ||
                    !formData.last_Name ||
                    !formData?.aadhar_number ||
                    !formData?.section ||
                    !formData?.session ||
                    !formData?.class_Id ||
                    !formData?.gender ||
                    !formData?.permanent_Address ||
                    !formData?.date_Of_Birth ||
                    !formData?.contact_Number ||
                    !formData?.date_Of_Admission ||
                    !formData?.father_Name ||
                    !formData?.mother_Name ||
                    !formData?.student_Photo ||
                    !formData?.category ||
                    !formData?.address_for_id
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600'
                    }`}
                  disabled={
                    !formData.first_Name ||
                    !formData.last_Name ||
                    !formData?.aadhar_number ||
                    !formData?.section ||
                    !formData?.session ||
                    !formData?.class_Id ||
                    !formData?.gender ||
                    !formData?.permanent_Address ||
                    !formData?.date_Of_Birth ||
                    !formData?.contact_Number ||
                    !formData?.date_Of_Admission ||
                    !formData?.father_Name ||
                    !formData?.mother_Name ||
                    !formData?.student_Photo ||
                    !formData?.category ||
                    !formData?.address_for_id
                  }
                >
                  Submit
                </Button>


              </div>

            </form>
        }
        <Modal
          isOpen={bulkStudentModal}
          onClose={() => {
            setBulkStudentModal(false);
            setBulkClassId('');
            setBulkSection('');
            setErrorMessage('');
          }}
          className="max-w-[700px] m-4"
        >
          <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                Bulk Student Upload
              </h4>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                Upload here bulk students
              </p>
            </div>
            <form className="flex flex-col">
              <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                <div>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div>
                      <Select
                        placeholder="Select Class"
                        options={classes.map((classItem) => ({
                          value: classItem._id,
                          label: classItem.name,
                        }))}
                        value={bulkClassId}
                        onChange={(e) => {
                          setBulkClassId(e);
                          const filterClassData = classes.filter(
                            (classItem) => classItem._id === e
                          );
                          setSections(filterClassData[0]?.sections);
                        }}
                        className="dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 mt-3 mb-3 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div>
                      <Select
                        value={bulkSection}
                        onChange={(e) => {
                          setBulkSection(e);
                        }}
                        disabled={!bulkClassId}
                        placeholder="Select Section"
                        options={sections.map((section) => ({
                          value: section,
                          label: section,
                        }))}
                        className="dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div>
                      <Input
                        disabled={!bulkSection}
                        type="file"
                        onChange={handleFileChange}
                        accept=".csv, .xlsx"
                        placeholder="Enter exam name"
                        className="dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Error Message */}
              <h3
                style={{ textAlign: 'start', color: 'red', marginLeft: 10 }}
                className="dark:text-red-400"
              >
                {ErrorMessage}
              </h3>

              {/* Button for downloading the sample CSV */}
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-between">
                <div className="flex justify-start mt-3 px-2">
                  <Button
                    size="sm"
                    variant="outline"
                    // onClick={downloadSampleCSV}
                    className="mr-4 dark:text-white dark:border-gray-500"
                  >
                    Download Sample CSV
                  </Button>
                </div>
                <div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mr-4 dark:text-white dark:border-gray-500"
                    onClick={() => {
                      setBulkStudentModal(false);
                      setBulkClassId('');
                      setBulkSection('');
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={(e) => buildStudentUpload(e)}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 dark:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    Upload
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Modal>


      </form>

    </div>

  );
};

export default AddStudent;
