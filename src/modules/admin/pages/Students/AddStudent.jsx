import React, { useEffect, useState } from 'react';
import { deleteService, getService, postService, putService } from '../../../../constants/Service'; // Importing services
import apiName from '../../../../constants/ApiName'; // Importing API Names
import { showToast } from '../../../../components/Toast'; // Show Toast Notifications
import AdmissionReceipt from './AdmissionReceipt';
import { Link, useNavigate } from 'react-router-dom';
const AddStudent = () => {

  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal state for adding student
  const [classes, setClasses] = useState([]); // Classes for dropdown
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sections, setSections] = useState([

  ]); // Sections for dropdown
  const [sessions, setSessions] = useState(['2024-2025', '2025-2026', '2026-2027']); // Sessions for dropdown
  const [categories, setCategories] = useState([]); // Categories for dropdown
  const [registrationCompleted, setRegistrationCompleted] = useState(false);
  const [blood_Groups, setblood_Groups] = useState([]); // Blood Groups for dropdown
  const [imagePreview, setImagePreview] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [classFilter, setClassFilter] = useState('');
  const [lastAdmissionNumber, setLastAdmissionNumber] = useState("");
  const [sectionFilter, setSectionFilter] = useState('');
  const navigate = useNavigate();
  const [expandedFees, setExpandedFees] = useState({});
  const [searchText, setSearchText] = useState('');
  const [aadharParts, setAadharParts] = useState(["", "", ""]);
  const [formData, setFormData] = useState({
    admission_Number: '',
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
    date_Of_Admission: '',
    student_Photo: '',
    aadhar_number: '',
    feeStructures: []
  });
  useEffect(() => {
    setLoading(true);
    fetchClasses();
    fetchFeeStructures()
    fetchStudents()
    fetchLastAdmissionNumber()
  }, []);

  const resetForm = () => {
    setFormData({
      admission_Number: '',
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
      date_Of_Admission: '',
      student_Photo: '',
      aadhar_number: '',
      feeStructures: []
    })
  }

  const fetchLastAdmissionNumber = async () => {
    try {
      const result = await getService(apiName.getLastAdmissionNumber); // API to get fee structures
      setLastAdmissionNumber(result?.lastGeneratedAdmissionNumber)
    } catch (error) {
      showToast('Error fetching fee structures', 'error');
    }
  };
  useEffect(() => {
    if (lastAdmissionNumber && !formData.admission_Number) {
      const numericPart = parseInt(lastAdmissionNumber.match(/\d+/)[0], 10);
      console.log("numb", numericPart)
      const newAdmissionNumber = `AD-${numericPart}`;
      console.log('newAdmissionNumber', newAdmissionNumber)
      setFormData((prevFormData) => ({
        ...prevFormData,
        admission_Number: newAdmissionNumber,
      }));
    }
  }, [lastAdmissionNumber]);
  const fetchStudents = async () => {
    try {
      const result = await getService(apiName.getStudent); // API to get fee structures
      setStudents(result)
      setEditMode(false)
      setLoading(false)
      console.log('ksfkskfskfksfks', result)
    } catch (error) {
      showToast('Error fetching fee structures', 'error');
    }
  };
  const fetchFeeStructures = async () => {
    try {
      const result = await getService(apiName.getFeeStructure); // API to get fee structures
      console.log('result', result)
      setFeeStructures(result); // Save fee structures
    } catch (error) {
      showToast('Error fetching fee structures', 'error');
    }
  };


  const fetchClasses = async () => {
    try {
      const result = await getService(apiName.getClassList); // Get Classes API
      console.log('lbvlblvbllvb', result)
      setClasses(result);
    } catch (error) {
      // showToast('Error fetching classes', 'error');
    }
  };

  const handleFeeStructureChange = (e, feeId) => {
    const { checked } = e.target;
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
    console.log('bvlvlblvlb', name, value)
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
      console.log("Updated Aadhar parts: ", updatedParts);

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


  const handleSubmit = async () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      admission_Number: lastAdmissionNumber,
      date_Of_Admission: formData.date_Of_Admission != '' ? formData.date_Of_Admission.split('T')[0] : new Date().toISOString().split('T')[0]
    }));
    if (!formData.first_Name || !formData.last_Name) {
      showToast("Please fill all the required fields.", 'error');
      return;
    }

    try {
      const response = await postService(apiName.addStudent, formData);
      console.log('reses222sponse', response)
      setRegistrationCompleted(true)
      // navigate('/admin/student')
      showToast("Student added successfully.", 'success');
    } catch (error) {
      showToast('Error submitting data', 'error');
    }
  };


  const toggleFeeGroupVisibility = (feeId) => {
    setExpandedFees((prevExpandedFees) => ({
      ...prevExpandedFees,
      [feeId]: !prevExpandedFees[feeId], // Toggle the current fee's visibility
    }));
  };
  return (
    <div className="container mx-auto px-4 py-6">
      {
        registrationCompleted ?
          <div className=''>
            <AdmissionReceipt setRegistrationCompleted={setRegistrationCompleted} studentData={formData} />
          </div>
          :
          <div>

            <h2 className="text-2xl font-semibold mb-4 text-center">Add Student</h2>

            {/* Scrollable container */}
            <div className="max-h-[500px] overflow-y-auto">

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                {/* Admission Number */}
                <div className="mb-4">
                  <label className="block text-gray-700">Admission Number *:</label>
                  <input
                    type="text"
                    readOnly
                    name="admission_Number"
                    value={formData.admission_Number ? formData?.admission_Number : lastAdmissionNumber}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>

                {/* Roll Number */}
                <div className="mb-4">
                  <label className="block text-gray-700">Roll Number :</label>
                  <input
                    type="text"
                    name="roll_Number"
                    value={formData.roll_Number}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>

                {/* First Name */}
                <div className="mb-4">
                  <label className="block text-gray-700">First Name *:</label>
                  <input
                    type="text"
                    name="first_Name"
                    value={formData.first_Name}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>

                {/* Last Name */}
                <div className="mb-4">
                  <label className="block text-gray-700">Last Name *:</label>
                  <input
                    type="text"
                    name="last_Name"
                    value={formData.last_Name}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>

                {/* Class Dropdown */}
                <div className="mb-4">
                  <label className="block text-gray-700">Class *:</label>
                  <select
                    name="class_Id"
                    value={formData.class_Id}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  >
                    <option value="">Select Class</option>
                    {classes?.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Section Dropdown */}
                <div className="mb-4">
                  <label className="block text-gray-700">Section *:</label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                    disabled={!formData.class_Id}
                  >
                    <option value="">Select Section</option>
                    {sections?.map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Session Dropdown */}
                <div className="mb-4">
                  <label className="block text-gray-700">Session *:</label>
                  <select
                    name="session"
                    value={formData.session}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  >
                    <option value="">Select Session</option>
                    {sessions?.map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date of Birth */}
                <div className="mb-4">
                  <label className="block text-gray-700">Date of Birth *:</label>
                  <input
                    type="date"
                    name="date_Of_Birth"
                    value={formData.date_Of_Birth.split('T')[0]}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>

                {/* Gender Dropdown */}
                <div className="mb-4">
                  <label className="block text-gray-700">Gender *:</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Permanent Address */}
                <div className="mb-4 col-span-2">
                  <label className="block text-gray-700">Permanent Address *:</label>
                  <input
                    type="text"
                    name="permanent_Address"
                    value={formData.permanent_Address}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>

                {/* Contact Number */}
                <div className="mb-4">
                  <label className="block text-gray-700">Contact Number *:</label>
                  <input
                    type='number'
                    name="contact_Number"
                    value={formData.contact_Number}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div className="mb-4 col-span-2">
                  <label className="block text-gray-700">Address for Correspondence *:</label>
                  <input
                    type="text"
                    name="address_For_Correspondence"
                    value={formData.address_For_Correspondence}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Alternate Contact No:</label>
                  <input
                    type="number"
                    name="alternet_Contact_Number"
                    value={formData.alternet_Contact_Number}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-gray-700">Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>

                {/* Nationality */}
                <div className="mb-4">
                  <label className="block text-gray-700">Nationality :</label>
                  <input
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
                  <label className="block text-gray-700">Religion:</label>
                  <select
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  >
                    <option value="">Select Religion</option>
                    <option value="Hinduism">Hinduism</option>
                    <option value="Islam">Islam</option>
                    <option value="Christianity">Christianity</option>
                    <option value="Sikhism">Sikhism</option>
                    <option value="Buddhism">Buddhism</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label className="block text-gray-700">Category *:</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  >
                    <option value="">Select Category</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>

                {/* Blood Group */}
                <div className="mb-4">
                  <label className="block text-gray-700">Blood Group :</label>
                  <select
                    name="blood_Group"
                    value={formData.blood_Group}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                {/* Father's Name */}
                <div className="mb-4">
                  <label className="block text-gray-700">Father's Name *:</label>
                  <input
                    type="text"
                    name="father_Name"
                    value={formData.father_Name}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>

                {/* Father's Occupation */}
                <div className="mb-4">
                  <label className="block text-gray-700">Father's Occupation *:</label>
                  <input
                    type="text"
                    name="father_Occupation"
                    value={formData.father_Occupation}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>

                {/* Mother's Name */}
                <div className="mb-4">
                  <label className="block text-gray-700">Mother's Name *:</label>
                  <input
                    type="text"
                    name="mother_Name"
                    value={formData.mother_Name}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>

                {/* Mother's Occupation */}
                <div className="mb-4">
                  <label className="block text-gray-700">Mother's Occupation *:</label>
                  <input
                    type="text"
                    name="mother_Occupation"
                    value={formData.mother_Occupation}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>

                {/* Due amount */}
                <div className="mb-4">
                  <label className="block text-gray-700">Due amount :</label>
                  <input
                    type="text"
                    name="due_amount"
                    value={formData.due_amount}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>

                {/* Date of Admission */}
                <div className="mb-4">
                  <label className="block text-gray-700">Date of Admission *:</label>
                  <input
                    type="date"
                    name="date_Of_Admission"
                    value={formData.date_Of_Admission != '' ? formData.date_Of_Admission.split('T')[0] : new Date().toISOString().split('T')[0]}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>

                {/* Aadhar Number */}
                <div className="mb-4">
                  <label className="block text-gray-700">Aadhar Number *:</label>
                  <div className="flex space-x-2 mt-2">
                    {[0, 1, 2].map((index) => (
                      <input
                        key={index}
                        type="text"
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
                {
                  !editMode &&
                  <div className="mb-4 col-span-2">
                    <label className="block text-gray-700">Student Photo:</label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleInputChange}
                      className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                    />
                  </div>
                }
                {imagePreview && (
                  <div className="mt-4 col-span-3 flex justify-center items-center">
                    <img src={imagePreview} alt="Student Preview" className="w-30 h-30 object-cover rounded-md" />
                  </div>
                )}

              </div>
              {
                !editMode &&

                <div className="mb-4 col-span-3">
                  <label className="block text-gray-700">Fee Structure *:</label>
                  <div className="space-y-2 max-h-102 overflow-y-auto">
                    {console.log('feeStructures', feeStructures)}
                    {feeStructures.map((fee) => (
                      <div key={fee._id} className="flex flex-col mb-4">
                        {/* Fee Structure Name */}
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            name="feeStructures"
                            value={fee._id}
                            checked={formData.feeStructures?.includes(fee._id)}
                            onChange={(e) => handleFeeStructureChange(e, fee._id)}
                            className="mr-2"
                          />
                          <label
                            className="text-gray-700 font-semibold cursor-pointer"
                            onClick={() => toggleFeeGroupVisibility(fee._id)}
                          >
                            {fee.name}
                          </label>
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

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Submit
              </button>
            </div>

          </div>
      }
    </div>

  );
};

export default AddStudent;
