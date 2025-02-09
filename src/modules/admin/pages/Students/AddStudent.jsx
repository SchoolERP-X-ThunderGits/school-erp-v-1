import React, { useEffect, useState } from 'react';

const AddStudent = ({ formData, handleInputChange, classes, sections, sessions, editMode, imagePreview, feeStructures, handleSubmit, setShowModal, setEditMode,handleFeeStructureChange }) => {
  const [expandedFees, setExpandedFees] = useState({});

  // Toggle function for expanding/collapsing fee details
  const toggleFeeGroupVisibility = (feeId) => {
    setExpandedFees((prevExpandedFees) => ({
      ...prevExpandedFees,
      [feeId]: !prevExpandedFees[feeId], // Toggle the current fee's visibility
    }));
  };
  return (
    <div className="container">
      {/* Add Student Modal */}
      <h2 className="text-2xl font-semibold mb-4">Add Student</h2>

      {/* Scrollable container */}
      <div className="max-h-[500px]">
        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

          {/* Admission Number */}
          <div className="mb-4">
            <label className="block text-gray-700">Admission Number *:</label>
            <input
              type="text"
              name="admission_Number"
              value={formData.admission_Number}
              onChange={handleInputChange}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          {/* Roll Number */}
          <div className="mb-4">
            <label className="block text-gray-700">Roll Number *:</label>
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
              {console.log('bkvkkbkvb', classes)}
              <option value="">Select Class</option>
              {classes.map((cls) => (
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
            >
              <option value="">Select Section</option>
              {sections.map((section) => (
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
              <option value="">Select Section</option>
              {sessions.map((section) => (
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
          <div className="mb-4  col-span-2">
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
          <div className="mb-4">
            <label className="block text-gray-700">Nationality *:</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Religion *:</label>
            <input
              type="text"
              name="religion"
              value={formData.religion}
              onChange={handleInputChange}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          {/* Gender Dropdown */}
          <div className="mb-4">
            <label className="block text-gray-700">Calegory *:</label>
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
          <div className="mb-4">
            <label className="block text-gray-700">Blood Group *:</label>
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
          <div className="mb-4">
            <label className="block text-gray-700">Due amount *:</label>
            <input
              type="text"
              name="due_amount"
              value={formData.due_amount}
              onChange={handleInputChange}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Date of Admission *:</label>
            <input
              type="date"
              name="date_Of_Admission"
              value={formData.date_Of_Admission.split('T')[0]}
              onChange={handleInputChange}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          {/* Aadhar Number */}
          <div className="mb-4">
            <label className="block text-gray-700">Aadhar Number *:</label>
            <input
              type="text"
              name="aadhar_number"
              value={formData.aadhar_number}
              onChange={handleInputChange}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          {
            !editMode &&
            <div className="mb-4 col-span-2">
              <label className="block text-gray-700">Student photo *:</label>
              <input
                type="file"
                name="student_Photo"
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
                        {fee.feeGroups.map((group) => (
                          <div key={group._id} className="flex flex-col bg-gray-100 p-3 rounded-md">
                            <div className="flex justify-between">
                              <span className="text-gray-700">Fee Type:</span>
                              <span className="text-gray-600">{group.feeType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">Amount:</span>
                              <span className="text-gray-600">{group.amount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">Due Date:</span>
                              <span className="text-gray-600">
                                {new Date(group.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

              </div>

            </div>
          }

        </div>

        {/* Buttons */}
        <div style={{ paddingBottom: 20 }} className="mb-4 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {editMode ? 'Update Student' : 'Add Student'}
          </button>
          <button
            style={{ marginLeft: 20 }}
            onClick={() => { setShowModal(false), setEditMode(false) }}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>

    </div>
  );
};

export default AddStudent;
