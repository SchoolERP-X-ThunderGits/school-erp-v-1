import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash, FaDownload } from 'react-icons/fa'; // Added Download icon
import { deleteService, getService } from '../../../../constants/Service'; // Importing services
import apiName from '../../../../constants/ApiName'; // Importing API Names
import { showToast } from '../../../../components/Toast'; // Show Toast Notifications
import { useNavigate } from 'react-router-dom';
import Loader from '../../../../components/Loader';

const StudentIDCard = () => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]); // Classes for dropdown
    const [sections, setSections] = useState([]); // Sections for dropdown based on selected class
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState(null);
    const [classFilter, setClassFilter] = useState('');
    const [sectionFilter, setSectionFilter] = useState('');
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetchClasses();
    }, []);

    // Fetch all students
    const fetchStudents = async () => {
        try {
            const result = await getService(apiName.getStudent); // API to get students
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
            setLoading(false)
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

    // Handle search button click
    const handleSearch = () => {
        fetchFilteredStudents();
    };

    // Fetch filtered students based on filters (Class, Section, and Search Text)
    const fetchFilteredStudents = async () => {
        try {
            setLoading(true);
            const filters = {
                classFilter,
                sectionFilter,
                searchText,
            };
            // Call API or filter locally based on the filters
            const result = await getService(apiName.getStudent, filters); // Pass filters to the API if required
            setStudents(result);
            setLoading(false);
        } catch (error) {
            showToast('Error fetching filtered students', 'error');
        }
    };

    // Handle delete student
    const handleDelete = (studentId) => {
        setStudentId(studentId); // Store student ID for deletion
        setShowDeleteModal(true);  // Show confirmation modal
    };

    // Confirm delete student
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

    // Generate student ID card PDF
    const generateIdCardPdf = (student) => {
        console.log('bclbclblcb',student)
        const doc = new jsPDF();
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(20);
        doc.text(`Student ID Card`, 20, 20);
        doc.setFontSize(12);
        doc.text(`Name: ${student.first_Name} ${student.last_Name}`, 20, 30);
        doc.text(`Admission No: ${student.admission_Number}`, 20, 40);
        doc.text(`Class: ${student.class_Id?.name}`, 20, 50);
        doc.text(`Section: ${student.section}`, 20, 60);
        doc.text(`DOB: ${student.date_Of_Birth}`, 20, 70);
        doc.text(`Email: ${student.email}`, 20, 80);
        doc.text(`Contact: ${student.contact_Number}`, 20, 90);
        doc.save(`${student.first_Name}_${student.last_Name}_ID_Card.pdf`);
    };

    // Render the list of filtered students
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
                            {students.map((student) => (
                                <tr key={student._id} className="border-b hover:bg-gray-50 transition duration-200">
                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.admission_Number}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.roll_Number}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.first_Name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.last_Name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.class_Id?.name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{student?.section}</td>
                                    <td className="px-4 py-2 flex space-x-4">
                                        {console.log('lblclblcb',student)}
                                        <button
                                            onClick={() => generateIdCardPdf(student)}
                                            className="text-[#1c2534] hover:text-[#1c2534] transition duration-200"
                                        >
                                            <FaDownload /> 
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
                    </div>

                    {/* Filters */}
                    <div className="mb-4 flex flex-wrap gap-4">
                        <select
                            className="p-2 border rounded w-full sm:w-auto"
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
                            className="p-2 border rounded w-full sm:w-auto"
                            value={sectionFilter}
                            onChange={handleSectionFilterChange}
                            disabled={!classFilter}
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
                            className="p-2 border rounded w-full sm:w-auto"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Search
                        </button>
                    </div>

                    {/* Students List */}
                    {students.length != 0 &&

                        <div className="mt-6">{renderStudentList()}</div>}
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
                                onClick={() => setShowDeleteModal(false)}
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
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

export default StudentIDCard;
