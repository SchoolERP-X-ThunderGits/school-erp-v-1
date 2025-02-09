import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'; // Add icon for button
import { deleteService, getService, postService, putService } from '../../../../constants/Service'; // Importing services
import apiName from '../../../../constants/ApiName'; // Importing API Names
import { showToast } from '../../../../components/Toast'; // Show Toast Notifications
import AdmissionReceipt from './AdmissionReceipt';
import { Link } from 'react-router-dom';
import AddStudent from './AddStudent';
import Loader from '../../../../components/Loader';

const Students = () => {
    const [feeStructures, setFeeStructures] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false); // Modal state for adding student
    const [classes, setClasses] = useState([]); // Classes for dropdown
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [sections, setSections] = useState([
        "A",
        "B",
        "C",
        "D",
        "E",
    ]); // Sections for dropdown
    const [sessions, setSessions] = useState(['2024-2025', '2025-2026', '2026-2027']); // Sessions for dropdown
    const [categories, setCategories] = useState([]); // Categories for dropdown
    const [registrationCompleted, setRegistrationCompleted] = useState(false);
    const [blood_Groups, setblood_Groups] = useState([]); // Blood Groups for dropdown
    const [imagePreview, setImagePreview] = useState(null);
    const [students, setStudents] = useState([]);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [classFilter, setClassFilter] = useState('');
    const [sectionFilter, setSectionFilter] = useState('');
    const [searchText, setSearchText] = useState('');
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

    const fetchStudents = async () => {
        try {
            const result = await getService(apiName.getStudent); // API to get fee structures
            setStudents(result)
            setEditMode(false)
            resetForm()
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

            return {
                ...prevData,
                feeStructures: updatedFeeStructures,
            };
        });
    };


    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        console.log('bvlvlblvlb', name, value)
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

    const handleSubmit = async () => {
        if (!formData.first_Name || !formData.last_Name || !formData.admission_Number || !formData.roll_Number) {
            showToast("Please fill all the required fields.", 'error');
            return;
        }

        try {
            const response = editMode
                ? await putService(`${apiName.updateStudent}/${studentToDelete}`, formData)
                : await postService(apiName.addStudent, formData);
            if (!editMode) {

                setRegistrationCompleted(true)
            } else {
                fetchStudents()
            }
            showToast(editMode ? "Student updated successfully." : "Student added successfully.", 'success');
        } catch (error) {
            console.log('kbvkkvb11111', formData, apiName.addStudent)
            console.log('kbvkkvb1111122222', apiName.addStudent)
            showToast('Error submitting data', 'error');
        }
    };
    const handleEdit = (studentData) => {
        setShowModal(true);
        setEditMode(true);
        setStudentToDelete(studentData._id);
        console.log('studentData', studentData?.class_Id?._id)
        setFormData({
            admission_Number: studentData?.admission_Number,
            roll_Number: studentData?.roll_Number,
            first_Name: studentData?.first_Name,
            last_Name: studentData?.last_Name,
            class_Id: studentData?.class_Id?._id,
            section: studentData?.section,
            session: studentData?.session,
            date_Of_Birth: studentData?.date_Of_Birth,
            gender: studentData?.gender,
            permanent_Address: studentData?.permanent_Address,
            address_For_Correspondence: studentData?.address_For_Correspondence,
            contact_Number: studentData?.contact_Number,
            alternet_Contact_Number: studentData?.alternet_Contact_Number,
            email: studentData?.email,
            nationality: studentData?.nationality,
            religion: studentData?.religion,
            category: studentData?.category,
            blood_Group: studentData?.blood_Group,
            father_Name: studentData?.father_Name,
            father_Occupation: studentData?.father_Occupation,
            mother_Name: studentData?.mother_Name,
            mother_Occupation: studentData?.mother_Occupation,
            due_amount: studentData?.due_amount,
            date_Of_Admission: studentData?.date_Of_Admission,
            student_Photo: studentData?.student_Photo,
            aadhar_number: studentData?.aadhar_number,
        })
    };

    const handleDelete = (studentId) => {
        setStudentToDelete(studentId); // Store class ID for deletion
        setShowDeleteModal(true);  // Show confirmation modal
    };


    const handleConfirmDelete = async () => {
        try {
            // Call delete service with the class ID
            await deleteService(`${apiName.deleteStudent}/${studentToDelete}`);
            showToast('Student deleted successfully', 'success');
            fetchStudents(); // Refresh the class list
        } catch (error) {
            showToast('Error deleting class', 'error');
        }
        setShowDeleteModal(false); // Close the confirmation modal
        setClassToDelete(null);    // Clear the class ID
    };

    const filteredStudents = students.filter((student) => {
        const matchesClass = classFilter ? student.class_Id?.name === classFilter : true;
        const matchesSection = sectionFilter ? student.section === sectionFilter : true;
        const matchesSearchText = searchText
            ? student.first_Name.toLowerCase().includes(searchText.toLowerCase()) ||
            student.last_Name.toLowerCase().includes(searchText.toLowerCase()) ||
            student.date_Of_Birth.toLowerCase().includes(searchText.toLowerCase()) ||
            student.gender.toLowerCase().includes(searchText.toLowerCase()) ||
            student.permanent_Address.toLowerCase().includes(searchText.toLowerCase()) ||
            student.email.toLowerCase().includes(searchText.toLowerCase()) ||
            student.contact_Number.toLowerCase().includes(searchText.toLowerCase()) ||
            student.admission_Number.toLowerCase().includes(searchText.toLowerCase())
            : true;

        return matchesClass && matchesSection && matchesSearchText;
    });

    const renderStudentList = () => {
        return (
            <div className="container mx-auto p-4">
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600">
                            <th className="py-3 px-6 text-left text-sm font-semibold">Admission Number</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold">Roll Number</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold">First Name</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold">Last Name</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold">Class</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold">Section</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student._id} className="border-b hover:bg-gray-50 transition duration-200">
                                <td className="px-4 py-2 text-sm text-gray-800">{student.admission_Number}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">{student.roll_Number}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">{student.first_Name}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">{student.last_Name}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">{student.class_Id?.name}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">{student.section}</td>
                                <td className="px-4 py-2 flex space-x-4">
                                    <button
                                        onClick={() => handleEdit(student)}
                                        className="text-blue-500 hover:text-blue-700 transition duration-200"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(student._id)}
                                        className="text-red-500 hover:text-red-700 transition duration-200"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4">
            {
                !showModal ?
                (

                   loading?<Loader/>: <div>

                        <div className="mb-6 flex justify-between items-center">
                            <h1 className="text-2xl font-semibold text-gray-800">Student Registration</h1>
                            <button
                                onClick={() => { setShowModal(true), setEditMode(false), resetForm() }}
                                className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                            >
                                <FaPlus className="mr-2" /> Add Student
                            </button>

                        </div>
                        {/* Filters */}
                        <div className="mb-4 flex gap-4">
                            <select
                                className="p-2 border rounded"
                                value={classFilter}
                                onChange={(e) => setClassFilter(e.target.value)}
                            >
                                <option value="">Filter by Class</option>
                                {classes.map((classItem) => (
                                    <option key={classItem._id} value={classItem.name}>{classItem.name}</option>
                                ))}
                            </select>
                            <select
                                className="p-2 border rounded"
                                value={sectionFilter}
                                onChange={(e) => setSectionFilter(e.target.value)}
                            >
                                <option value="">Filter by Section</option>
                                {sections.map((section) => (
                                    <option key={section} value={section}>{section}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="p-2 border rounded"
                            />
                        </div>

                        <div className="mt-6">
                            {renderStudentList()}
                        </div>
                    </div>
                )
                    :
                    (
                        registrationCompleted ?
                            <div className=''>

                                {console.log('formDataformData', formData)}
                                <AdmissionReceipt setRegistrationCompleted={setRegistrationCompleted} studentData={formData} />
                            </div>
                            :
                            <AddStudent formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} feeStructures={feeStructures} imagePreview={imagePreview} editMode={editMode} classes={classes} sessions={sessions} sections={sections} setShowModal={setShowModal} handleFeeStructureChange={handleFeeStructureChange}/>
                    )
            }
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to delete this student?</h2>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)} // Close the confirmation modal
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete} // Confirm deletion
                                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Students;
