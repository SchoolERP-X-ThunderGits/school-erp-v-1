import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa'; // FontAwesome icon for Add
import { getService, postService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import Loader from '../../../../components/Loader';
import { showToast } from '../../../../components/Toast';

const AddStudent = () => {
    const [classList, setClassList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        admissionNumber: '',
        rollNumber: '',
        firstName: '',
        lastName: '',
        selectedClass: '',
        selectedSection: '',
        session: '',
        dob: { day: '', month: '', year: '' },
        gender: '',
        permanentAddress: '',
        correspondenceAddress: '',
        contactNumber: '',
        alternateContactNumber: '',
        email: '',
        nationality: 'India',
        religion: '',
        category: '',
        bloodGroup: '',
        fathersName: '',
        fathersOccupation: '',
        mothersName: '',
        mothersOccupation: '',
        dueAmount: '',
        dateOfAdmission: '',
        studentPhoto: null,
        aadharNumber: '',
        photoPreview: null,
        feesDetails: ''
    });

    const sections = ['A', 'B', 'C', 'D', 'E', 'F'];
    const genders = ['Male', 'Female', 'Other'];
    const religions = ['Hindu', 'Muslim', 'Christian', 'Other'];
    const categories = ['General', 'OBC', 'SC', 'ST', 'Other'];
    const bloodGroups = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-', 'Other'];
    const sessions = ['2025-26', '2026-27', '2027-28']; // Example session options

    useEffect(() => {
        getClassList();
    }, []);

    const getClassList = async () => {
        try {
            const result = await getService(apiName.getStudent);
            setClassList(result);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            studentPhoto: file,
            photoPreview: URL.createObjectURL(file)
        });
    };

    const handleAddStudent = async () => {
        if (!formData.firstName || !formData.lastName || !formData.admissionNumber) {
            showToast('Required fields must be filled', 'error');
            return;
        }

        const body = { ...formData };

        try {
            await postService(apiName.addStudent, body);
            showToast("Student added successfully.", 'success');
            setShowModal(false); // Close the modal after adding the student
        } catch (error) {
            showToast("Error adding student", 'error');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-800">Student Registration</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    <FaPlus className="mr-2" /> Add Student
                </button>
            </div>

            {/* Form for Adding Student */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl overflow-hidden max-h-[80vh] overflow-y-auto"
                        style={{
                            width: 'calc(100% - 300px)',  // Adjust width based on sidebar width
                            maxWidth: '1000px',
                            padding: '20px',
                        }}
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Student</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Admission Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Admission Number</label>
                                <input
                                    type="text"
                                    name="admissionNumber"
                                    value={formData.admissionNumber}
                                    onChange={handleInputChange}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md"
                                    placeholder="Enter Admission Number"
                                />
                            </div>
                            {/* Roll Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Roll Number</label>
                                <input
                                    type="text"
                                    name="rollNumber"
                                    value={formData.rollNumber}
                                    onChange={handleInputChange}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md"
                                    placeholder="Enter Roll Number"
                                />
                            </div>
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md"
                                    placeholder="Enter First Name"
                                />
                            </div>
                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md"
                                    placeholder="Enter Last Name"
                                />
                            </div>
                            {/* Class */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Class</label>
                                <select
                                    name="selectedClass"
                                    value={formData.selectedClass}
                                    onChange={handleInputChange}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md"
                                >
                                    <option value="">Select Class</option>
                                    {classList.map((classItem) => (
                                        <option key={classItem._id} value={classItem._id}>
                                            {classItem.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Section</label>
                                <select
                                    name="selectedSection"
                                    value={formData.selectedSection}
                                    onChange={handleInputChange}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md"
                                >
                                    <option value="">Select Section</option>
                                    {sections.map((section) => (
                                        <option key={section} value={section}>
                                            {section}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Session */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Session</label>
                                <select
                                    name="session"
                                    value={formData.session}
                                    onChange={handleInputChange}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md"
                                >
                                    <option value="">Select Session</option>
                                    {sessions.map((session) => (
                                        <option key={session} value={session}>
                                            {session}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Date of Birth */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        name="dob.day"
                                        value={formData.dob.day}
                                        onChange={handleInputChange}
                                        className="block w-12 px-4 py-3 border border-gray-300 rounded-md"
                                        placeholder="DD"
                                    />
                                    <input
                                        type="number"
                                        name="dob.month"
                                        value={formData.dob.month}
                                        onChange={handleInputChange}
                                        className="block w-12 px-4 py-3 border border-gray-300 rounded-md"
                                        placeholder="MM"
                                    />
                                    <input
                                        type="number"
                                        name="dob.year"
                                        value={formData.dob.year}
                                        onChange={handleInputChange}
                                        className="block w-16 px-4 py-3 border border-gray-300 rounded-md"
                                        placeholder="YYYY"
                                    />
                                </div>
                            </div>
                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md"
                                >
                                    <option value="">Select Gender</option>
                                    {genders.map((gender) => (
                                        <option key={gender} value={gender}>
                                            {gender}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Permanent Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Permanent Address</label>
                                <textarea
                                    name="permanentAddress"
                                    value={formData.permanentAddress}
                                    onChange={handleInputChange}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md"
                                    placeholder="Enter Permanent Address"
                                ></textarea>
                            </div>
                            {/* Correspondence Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Correspondence Address</label>
                                <textarea
                                    name="correspondenceAddress"
                                    value={formData.correspondenceAddress}
                                    onChange={handleInputChange}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md"
                                    placeholder="Enter Correspondence Address"
                                ></textarea>
                            </div>
                            {/* Contact Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Contact Number</label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleInputChange}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md"
                                    placeholder="Enter Contact Number"
                                />
                            </div>
                            {/* Alternate Contact Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Alternate Contact Number</label>
                                <input
                                    type="text"
                                    name="alternateContactNumber"
                                    value={formData.alternateContactNumber}
                                    onChange={handleInputChange}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md"
                                    placeholder="Enter Alternate Contact Number"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-2 bg-gray-500 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddStudent}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg"
                            >
                                Add Student
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddStudent;
