import React, { useEffect, useState } from 'react';
import { FaDownload, FaTimes } from 'react-icons/fa';
import apiName from '../../../../constants/ApiName';
import { showToast } from '../../../../components/Toast';
import Loader from '../../../../components/Loader';
import { getService, postService } from '../../../../constants/Service';
import { sessionsArray } from '../../../../constants/GlobalConstants';

const UpgradeRollNo = () => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [students, setStudents] = useState([]);
    const [classFilter, setClassFilter] = useState('');
    const [sectionFilter, setSectionFilter] = useState('');
    const [sessionFilter, setSessionFilter] = useState('');
    const [newRollNo, setNewRollNo] = useState('');
    const [studentRollArray, setStudentRollArray] = useState([])
    const [studentOldRollArray, setStudentOldRollArray] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetchClasses();
    }, []);
    const fetchClasses = async () => {
        try {
            const result = await getService(apiName.getClassList);
            setClasses(result);
            setLoading(false);
        } catch (error) {
            showToast('Error fetching classes', 'error');
            setLoading(false);
        }
    };

    const fetchSectionsForClass = (classId) => {
        const classSelected = classes.find(classItem => classItem._id === classId);
        if (classSelected) {
            setSections(classSelected.sections);
        }
    };

    const handleClassFilterChange = (e) => {
        const selectedClass = e.target.value;
        setClassFilter(selectedClass);
        setSectionFilter('');
        fetchSectionsForClass(selectedClass);
    };

    const handleSectionFilterChange = (e) => {
        setSectionFilter(e.target.value);
    };

    const handleSearch = () => {
        if (!classFilter || !sectionFilter || !sessionFilter) {
            showToast('All fields are required', 'error');
            return;
        }
        fetchFilteredStudents();
    };

    const fetchFilteredStudents = async () => {
        try {
            setLoading(true);
            const result = await getService(`${apiName.getStudentByExam}/${classFilter}/${sectionFilter}/${sessionFilter}`);
            setStudentRollArray(result.map(i => {
                return {
                    id: i._id,
                    roll_no: i.roll_Number
                }
            }))
            setStudentOldRollArray(result.map(i => {
                return {
                    id: i._id,
                    roll_no: i.roll_Number
                }
            }))
            setStudents(result);
            setLoading(false);
        } catch (error) {
            showToast('Error fetching filtered students', 'error');
            setLoading(false);
        }
    };


    const renderStudentList = () => {

        return (
            <div className="container mx-auto p-4">
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    {students.length === 0 ? (
                        <p style={{ textAlign: 'center', margin: 10 }}>No students found</p>
                    ) : (
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600">
                                    <th className="py-3 px-6 text-left text-sm font-semibold">Admission Number</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold">Roll Number</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold">First Name</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold">Last Name</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold">Class</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold">Section</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student._id} className="border-b hover:bg-gray-50 transition duration-200">
                                        <td className="px-4 py-2 text-sm text-gray-800">{student?.admission_Number}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="number"
                                                    value={(() => {
                                                        const studentObj = studentRollArray.find(obj => obj.id == student?._id);
                                                        return studentObj ? studentObj.roll_no : '';
                                                    })()}
                                                    onChange={(e) => {
                                                        const updatedArray = studentRollArray.map(obj => {
                                                            if (obj.id == student?._id) {
                                                                return { ...obj, roll_no: Number(e.target.value) };
                                                            }
                                                            return obj;
                                                        });
                                                        setStudentRollArray(updatedArray);
                                                    }}
                                                    className="border px-0.5 py-1"
                                                    style={{ borderWidth: 0.5, borderColor: 'gray' }}
                                                />

                                            </div>

                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-800">{student?.first_Name}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800">{student?.last_Name}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800">{student?.class_Id?.name}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800">{student?.section}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        );
    };

    const handleUpgradeStudent = async (mode) => {
        const body = {
            updates: studentRollArray,
            type: mode,
        };
        const body2 = {
            classId: classFilter,
            section:sectionFilter,
            startingRollNumber:newRollNo,
            type: mode,
        };
        try {
            const response = await postService(apiName.upgradeStudentRollNo, mode == 'auto'?JSON.stringify(body2):JSON.stringify(body));
            console.log('responseresponse', response)
            setClassFilter('')
            setSectionFilter('')
            setSessionFilter('')
            setStudents('')
            showToast("Roll No Update Successfully", 'success');
            setModalOpen(false);
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            {loading ? (
                <Loader />
            ) : (
                <div>
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-800">Upgrade Roll Number</h1>
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
                                <option key={classItem._id} value={classItem._id}>
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
                        <select
                            value={sessionFilter}
                            onChange={(e) => setSessionFilter(e.target.value)}
                            className="p-2 border rounded w-full sm:w-auto"
                            disabled={!sectionFilter}
                        >
                            <option value="">Select Session</option>
                            {sessionsArray.map((session, index) => (
                                <option key={index} value={session}>
                                    {session}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Search
                        </button>

                        <button
                            onClick={() => {
                                setClassFilter('');
                                setSectionFilter('');
                                setStudents([]);
                            }}
                            className="px-6 py-3 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition duration-300"
                        >
                            Clear Filters
                        </button>
                        {
                            students.length != 0 &&

                            <button
                                onClick={() => setModalOpen(true)}
                                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                            >
                                <FaDownload className="mr-2" /> Upgrade All Students Roll No.
                            </button>
                        }
                        {
                            JSON.stringify(studentRollArray) != JSON.stringify(studentOldRollArray) &&

                            <button
                                onClick={() => handleUpgradeStudent('manual')}
                                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                            >
                                <FaDownload className="mr-2" /> Save Changes
                            </button>
                        }
                    </div>

                    <div className="mt-6">{renderStudentList()}</div>

                    {/* Modal for updating class and section */}
                    {modalOpen && (
                        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg w-full sm:w-4/5 md:w-1/3 lg:w-1/3 xl:w-1/4">
                                <div className="flex justify-between mb-4">
                                    <h2 className="text-xl font-semibold">Starting Roll Number</h2>
                                    <button onClick={() => setModalOpen(false)} className="text-red-500">
                                        <FaTimes />
                                    </button>
                                </div>

                                <input
                                    type="number"
                                    className="p-2 border rounded w-full mb-4"
                                    value={newRollNo}
                                    onChange={(e) => setNewRollNo(e.target.value)}
                                    placeholder="Enter New Starting roll number"
                                />


                                <button
                                    onClick={() => {
                                        handleUpgradeStudent('auto')
                                    }}
                                    className="px-6 py-3 bg-green-500 text-white rounded-lg w-full hover:bg-green-600 flex items-center justify-center"
                                >
                                    <FaDownload className="mr-2" /> Update
                                </button>

                            </div>
                        </div>

                    )}
                </div>
            )}
        </div>
    );
};

export default UpgradeRollNo;
