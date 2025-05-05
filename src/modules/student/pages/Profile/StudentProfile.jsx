import React, { useState } from 'react';
import { MdSchool } from 'react-icons/md';

const StudentProfile = () => {
  const studentData = JSON.parse(localStorage.getItem("studentData"));
  const [student] = useState(studentData);

  const ProfileRow = ({ icon, label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center text-gray-700 dark:text-gray-200 break-words">
      <div className="flex items-center min-w-[120px]">
        {icon && <span className="mr-2">{icon}</span>}
        <span className="font-medium">{label}:</span>
      </div>
      <span className="ml-0 sm:ml-2 text-sm sm:text-base text-wrap break-words">
        {value || 'N/A'}
      </span>
    </div>
  );
  

  const ProfileCard = ({ title, children }) => (
    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl shadow">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6 border-b pb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500 shadow-md">
            <img
              src={student.student_Photo}
              alt="Student"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              {student.first_Name} {student.last_Name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              <MdSchool className="inline mr-1" />
              Class: {student.class_Id?.name} | Section: {student.section}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Roll No: {student.roll_Number} | Adm. No: {student.admission_Number}
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact */}
          <ProfileCard title="Contact">
            <ProfileRow  label="Phone" value={student.contact_Number} />
            <ProfileRow label="Alternate Phone" value={student.alternet_Contact_Number} />
            <ProfileRow  label="Email" value={student.email} />
            <ProfileRow  label="Correspondence Address" value={student.address_For_Correspondence} />
          </ProfileCard>

          {/* Personal */}
          <ProfileCard title="Personal Info">
            <ProfileRow label="Gender" value={student.gender} />
            <ProfileRow label="DOB" value={new Date(student.date_Of_Birth).toLocaleDateString()} />
            <ProfileRow  label="Blood Group" value={student.blood_Group} />
            <ProfileRow label="Aadhar Number" value={student.aadhar_number} />
            <ProfileRow label="Nationality" value={student.nationality} />
            <ProfileRow label="Religion" value={student.religion} />
            <ProfileRow label="Category" value={student.category} />
          </ProfileCard>

          {/* Address */}
          <ProfileCard title="Address Details">
            <ProfileRow label="Correspondence" value={student.address_For_Correspondence} />
            <ProfileRow label="Permanent Address" value={student.permanent_Address} />
            <ProfileRow label="Address for ID" value={student.address_for_id} />
          </ProfileCard>

          {/* Academic */}
          <ProfileCard title="Academic Info">
            <ProfileRow label="Class ID" value={student.class_Id?.name} />
            <ProfileRow label="Section" value={student.section} />
            <ProfileRow label="Roll Number" value={student.roll_Number} />
            <ProfileRow label="Admission No" value={student.admission_Number} />
            <ProfileRow label="Date of Admission" value={new Date(student.date_Of_Admission).toLocaleDateString()} />
            <ProfileRow label="Session" value={student.session} />
            <ProfileRow label="Due Amount" value={`₹${student.due_amount}`} />
          </ProfileCard>

          {/* Father's Info */}
          <ProfileCard title="Father’s Information">
            <ProfileRow label="Name" value={student.father_Name} />
            <ProfileRow label="Occupation" value={student.father_Occupation} />
          </ProfileCard>

          {/* Mother's Info */}
          <ProfileCard title="Mother’s Information">
            <ProfileRow label="Name" value={student.mother_Name} />
            <ProfileRow label="Occupation" value={student.mother_Occupation} />
          </ProfileCard>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
