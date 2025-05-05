import React, { useState } from 'react';
import { FaUserEdit, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { MdSchool } from 'react-icons/md';
import { GiBlood } from 'react-icons/gi';
import Input from '../../../../components/form/input/InputField';
import apiName from '../../../../constants/ApiName';
import { putService } from '../../../../constants/Service';
import { showToast } from '../../../../components/Toast';

const StudentProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const studentData = JSON.parse(localStorage.getItem("studentData"));
  const [student, setStudent] = useState(studentData);

  const handleInputChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSaveClick = async () => {
    try {
      // Make sure to exclude read-only fields like _id, createdAt, etc. before saving
      const updatedStudentData = { ...student };
      try {
        const response = await putService(`${apiName.updateStudent}/${studentData?._id}`, updatedStudentData)
        setIsEditing(false)
        console.log('response', response)
        localStorage.setItem("studentData", JSON.stringify(updatedStudentData));
        showToast("Student updated successfully.", 'success');
    } catch (error) {
      console.log('errorerrorerror',error)
        showToast('Error submitting data', 'error');
    }

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating student data:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500 shadow-md">
            <img
              src={student.student_Photo}
              alt="Student"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              {student.first_Name} {student.last_Name}
            </h2>
            <p className="text-gray-500 dark:text-gray-300">
              <MdSchool className="inline mr-1" />
              Class: {student.class_Id} | Section: {student.section}
            </p>
            <p className="text-gray-500 dark:text-gray-300">
              Roll No: {student.roll_Number} | Adm. No: {student.admission_Number}
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="mt-4 md:mt-0 px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center gap-2"
          >
            <FaUserEdit />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Information */}
        {!isEditing ? (
          <div className="grid md:grid-cols-2 gap-6 text-gray-800 dark:text-white">
            <div className="space-y-2">
              <h3 className="font-semibold">Contact</h3>
              <p><FaPhone className="inline mr-2 text-green-500" /> {student.contact_Number}</p>
              <p><FaEnvelope className="inline mr-2 text-blue-500" /> {student.email}</p>
              <p><FaMapMarkerAlt className="inline mr-2 text-red-500" /> {student.address_For_Correspondence}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Personal</h3>
              <p>Gender: {student.gender}</p>
              <p>DOB: {new Date(student.date_Of_Birth).toLocaleDateString()}</p>
              <p><GiBlood className="inline mr-2 text-pink-500" /> Blood Group: {student.blood_Group}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Father’s Info</h3>
              <p>Name: {student.father_Name}</p>
              <p>Occupation: {student.father_Occupation}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Mother’s Info</h3>
              <p>Name: {student.mother_Name}</p>
              <p>Occupation: {student.mother_Occupation}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">Edit Profile</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                type="text"
                name="first_Name"
                value={student.first_Name}
                onChange={handleInputChange}
                placeholder="First Name"
                className="p-3 border rounded-xl"
              />
              <Input
                type="text"
                name="last_Name"
                value={student.last_Name}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="p-3 border rounded-xl"
              />
              <Input
                type="email"
                name="email"
                value={student.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="p-3 border rounded-xl"
              />
              <Input
                type="text"
                name="contact_Number"
                value={student.contact_Number}
                onChange={handleInputChange}
                placeholder="Phone"
                className="p-3 border rounded-xl"
              />
              <Input
                type="text"
                name="address_For_Correspondence"
                value={student.address_For_Correspondence}
                onChange={handleInputChange}
                placeholder="Address"
                className="p-3 border rounded-xl col-span-2"
              />
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveClick}
                 className="mt-4 md:mt-0 px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center gap-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
