import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'; // Add icon for button
import { deleteService, getService } from '../../../../constants/Service'; // Importing services
import apiName from '../../../../constants/ApiName'; // Importing API Names
import { showToast } from '../../../../components/Toast'; // Show Toast Notifications
import { useNavigate } from 'react-router-dom';
import Loader from '../../../../components/Loader';

const Students = () => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]); // Classes for dropdown
    const [sections, setSections] = useState([]); // Sections for dropdown based on selected class
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState(null);
    const [classFilter, setClassFilter] = useState('');
    const [sectionFilter, setSectionFilter] = useState('');
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        setLoading(true);
        fetchClasses();
        fetchStudents();
    }, []);

    // Fetch all students
    const fetchStudents = async () => {
        try {
            const result = await getService(apiName.getStudent); // API to get students
            console.log('blbvlbv', result)
            setStudents(result);
            setLoading(false);
        } catch (error) {
            showToast('Error fetching students', 'error');
        }
    };

    // Fetch classes and their corresponding sections
    const fetchClasses = async () => {
        try {
            const result = await getService(apiName.getClassList); // Get Classes API
            setClasses(result);
        } catch (error) {
            showToast('Error fetching classes', 'error');
        }
    };

    // Fetch sections for a particular class
    const fetchSectionsForClass = (classId) => {
        const classSelected = classes.find(classItem => classItem.name === classId);
        if (classSelected) {
            setSections(classSelected.sections); // sections associated with the selected class
        }
    };

    // Handle class selection to update sections list
    const handleClassFilterChange = (e) => {
        const selectedClass = e.target.value;
        setClassFilter(selectedClass);
        setSectionFilter(''); // Reset section filter
        fetchSectionsForClass(selectedClass); // Fetch sections for the selected class
    };

    // Handle section filter change
    const handleSectionFilterChange = (e) => {
        setSectionFilter(e.target.value);
    };

    const handleDelete = (studentId) => {
        setStudentId(studentId); // Store student ID for deletion
        setShowDeleteModal(true);  // Show confirmation modal
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteService(`${apiName.deleteStudent}/${studentId}`);
            showToast('Student deleted successfully', 'success');
            fetchStudents(); // Refresh the student list
        } catch (error) {
            showToast('Error deleting student', 'error');
        }
        setShowDeleteModal(false); // Close the confirmation modal
    };

    // Filter students based on class, section, and search text
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
            <div className="container mx-auto ">
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600">
                                <th className="py-3 px-6 text-left text-sm font-semibold">Admission Number</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">Roll Number</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">Name</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">Class</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">Section</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student._id} className="border-b hover:bg-gray-50 transition duration-200">
                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.admission_Number}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.roll_Number}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">
                                        <button
                                            onClick={() => navigate(`/admin/student/student-details/${student?._id}`)} // Navigate to student details page
                                            className="text-blue-500 hover:text-blue-700 transition duration-200"
                                        >
                                            {student?.first_Name} {student?.last_Name}
                                        </button>
                                    </td>

                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.class_Id?.name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.section}</td>
                                    <td className="px-4 py-2 flex space-x-4">
                                        <button
                                            onClick={() => navigate(`/admin/edit-student/${student?._id}`)}
                                            className="text-blue-500 hover:text-blue-700 transition duration-200"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(student?._id)}
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
            {loading ? (
                <Loader />
            ) : (
                <div>
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-800">Student Registration</h1>
                        <button
                            onClick={() => navigate('/admin/add-student')}
                            className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            <FaPlus className="mr-2" /> Add Student
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="mb-4 flex flex-wrap gap-4">
    <select
        className="p-2 border rounded w-full sm:w-auto" // Full width on small screens, auto width on medium+ screens
        value={classFilter}
        onChange={handleClassFilterChange}
    >
        <option value="">Filter by Class</option>
        {classes.map((classItem) => (
            <option key={classItem?._id} value={classItem.name}>
                {classItem.name}
            </option>
        ))}
    </select>
    <select
        className="p-2 border rounded w-full sm:w-auto" // Full width on small screens, auto width on medium+ screens
        value={sectionFilter}
        onChange={handleSectionFilterChange}
        disabled={!classFilter} // Disable if no class is selected
    >
        <option value="">Filter by Section</option>
        {sections.map((section) => (
            <option key={section} value={section}>
                {section}
            </option>
        ))}
    </select>
    <input
        type="text"
        placeholder="Search"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="p-2 border rounded w-full sm:w-auto" // Full width on small screens, auto width on medium+ screens
    />
    <button
        onClick={() => {
            setClassFilter('');
            setSectionFilter('');
            setSearchText('');
        }}
        className="p-2 bg-gray-200 rounded hover:bg-gray-300"
    >
        Clear Filters
    </button>
</div>



                    <div className="mt-6">{renderStudentList()}</div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Are you sure you want to delete this student?
                        </h2>
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
