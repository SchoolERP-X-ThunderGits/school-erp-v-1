import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getService, postService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import { showToast } from '../../../../components/Toast';
import Loader from '../../../../components/Loader';

const StudentDetails = () => {
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const { studentId } = useParams();
    const [feeDetails, setFeeDetails] = useState(null);
    const [selectedFees, setSelectedFees] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudentDetails();
    }, [studentId]);

    const isSelected = (feeGroup) => {
        return selectedFees.some((fee) => fee._id === feeGroup._id);
    };

    const fetchStudentDetails = async () => {
        try {
            const student = await getService(`${apiName.getStudentById}/${studentId}`);
            const fees = await getService(`${apiName.getFeeByStudentId}/${studentId}`);
            setStudent(student);
            setFeeDetails(fees);
            setLoading(false);
        } catch (error) {
            showToast('Error fetching student details', 'error');
        }
    };

    const handleFeeSelection = (feeGroup) => {
        if (!isSelected(feeGroup)) {
            setSelectedFees([...selectedFees, feeGroup]);
        } else {
            setSelectedFees(selectedFees.filter((fee) => fee !== feeGroup));
        }
    };

    const handleMasterCheckboxChange = (event) => {
        if (event.target.checked) {
            const allFeeIds = feeDetails.feeStructures.reduce((acc, feeStructure) => {
                return [
                    ...acc,
                    ...feeStructure.feeGroups.map((feeGroup) => feeGroup._id),
                ];
            }, []);
            setSelectedFees(allFeeIds);
        } else {
            setSelectedFees([]);
        }
    };

    const setStatusForFeeGroups = (feeType, dueDat, payments) => {
        const paymentForFeeType = payments.find((payment) => {
            return payment.feePaid.some((feePaid) => feePaid.feeType === feeType);
        });

        const currentDate = new Date();
        const dueDate = new Date(dueDat);

        if (!paymentForFeeType) {
            if (currentDate > dueDate) {
                return <span className="text-red-500">Overdue</span>;
            } else {
                return <span className="text-yellow-500">Due</span>;
            }
        } else {
            return <span className="text-green-500">Paid</span>;
        }
    };

    const handleCollectFee = async () => {
        const feesData = selectedFees.map((fee) => ({
            feeType: fee.feeType,
            amount: fee.amount
        }));
        const amount = selectedFees.reduce((total, fee) => total + fee.amount, 0);
        const studentID = student._id;
        const body = {
            amountPaid: amount,
            studentId: studentID,
            paymentMethod: "CASH",
            feePaid: feesData
        }
        console.log('lvlbvlb',body)

        try {
            // Send the payment request to the server
            const result = await postService(apiName.collectFee, body);

            // Check if the result contains the necessary payment data
            if (result && result.payment && result.payment._id) {
                showToast('Fee collected successfully', 'success');

                // Navigate to the payment receipt page
                navigate(`/admin/fee-receipt/${result.payment._id}`);
            } else {
                showToast('Failed to collect fee', 'error');
            }
        } catch (error) {
            // Handle error in payment collection
            showToast('Error collecting fee', 'error');
            console.error("Error during fee collection:", error);
        }
    };


    const renderProfile = () => (
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-center mb-6">
                <img
                    src={student.student_Photo}
                    alt={`${student.first_Name} ${student.last_Name}`}
                    className="w-32 h-32 rounded-full border-4 border-gray-200"
                />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
            <div className="overflow-x-auto bg-gray-50 shadow-sm rounded-lg">
                <table className="min-w-full table-auto">
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Name:</td>
                            <td className="px-4 py-2">{student.first_Name} {student.last_Name}</td>
                        </tr>
                        {console.log('student',student)}
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Class:</td>
                            <td className="px-4 py-2">{student?.class_Id?.name}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Section:</td>
                            <td className="px-4 py-2">{student.class_Id?.sections.join(', ')}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Admission Number:</td>
                            <td className="px-4 py-2">{student.admission_Number}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Roll Number:</td>
                            <td className="px-4 py-2">{student.roll_Number}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Date of Birth:</td>
                            <td className="px-4 py-2">{new Date(student.date_Of_Birth).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Date Of Admission:</td>
                            <td className="px-4 py-2">{new Date(student.date_Of_Admission).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Gender:</td>
                            <td className="px-4 py-2">{student.gender}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Email:</td>
                            <td className="px-4 py-2">{student.email}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Aadhar Number:</td>
                            <td className="px-4 py-2">{student.aadhar_number}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Blood Group:</td>
                            <td className="px-4 py-2">{student.blood_Group}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Contact Number:</td>
                            <td className="px-4 py-2">{student.contact_Number}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Alternet Contact Number:</td>
                            <td className="px-4 py-2">{student.alternet_Contact_Number}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Category:</td>
                            <td className="px-4 py-2">{student.category}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Religion:</td>
                            <td className="px-4 py-2">{student.religion}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Nationality:</td>
                            <td className="px-4 py-2">{student.nationality}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Parent Information</h2>
            <div className="overflow-x-auto bg-gray-50 shadow-sm rounded-lg">
                <table className="min-w-full table-auto">
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Father's Name:</td>
                            <td className="px-4 py-2">{student.father_Name}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Father's Occupation:</td>
                            <td className="px-4 py-2">{student.father_Occupation}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Mother's Name:</td>
                            <td className="px-4 py-2">{student.mother_Name}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Mother's Occupation:</td>
                            <td className="px-4 py-2">{student.mother_Occupation}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Address Information</h2>
            <div className="overflow-x-auto bg-gray-50 shadow-sm rounded-lg">
                <table className="min-w-full table-auto">
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Permanent Address:</td>
                            <td className="px-4 py-2">{student.permanent_Address}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-600">Correspondence Address:</td>
                            <td className="px-4 py-2">{student.address_For_Correspondence}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderFee = () => (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Fee Information</h2>
            <div className="flex justify-between mb-4">
                <button
                    onClick={handleCollectFee}
                    className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600"
                >
                    Collect Fee
                </button>
            </div>
            <table className="min-w-full table-auto bg-gray-50 shadow-sm rounded-lg">
                <thead className="bg-blue-100">
                    <tr>
                        <th className="px-4 py-2">
                            <input
                                type="checkbox"
                                onChange={handleMasterCheckboxChange}
                            />
                        </th>
                        <th className="px-4 py-2">Fees Structure</th>
                        <th className="px-4 py-2">Fees Type</th>
                        <th className="px-4 py-2">Due Date</th>
                        <th className="px-4 py-2">Amount</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Discount</th>
                        <th className="px-4 py-2">Fine</th>
                    </tr>
                </thead>
                <tbody>
                    {feeDetails && feeDetails.feeStructures?.map((feeStructure) => (
                        feeStructure.feeGroups?.map((feeGroup) => (
                            <tr key={feeGroup._id} className="hover:bg-gray-100">
                                <td className="px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={isSelected(feeGroup)}
                                        onChange={() => handleFeeSelection(feeGroup)}
                                    />
                                </td>
                                <td className="px-4 py-2">{feeStructure.name}</td>
                                <td className="px-4 py-2">{feeGroup.feeType}</td>
                                <td className="px-4 py-2">{new Date(feeGroup.dueDate).toLocaleDateString()}</td>
                                <td className="px-4 py-2">₹{feeGroup.amount}</td>
                                <td className="px-4 py-2">{setStatusForFeeGroups(feeGroup.feeType, feeGroup.dueDate, feeDetails.payments)}</td>
                                <td className="px-4 py-2">₹0</td>
                                <td className="px-4 py-2">₹0</td>
                            </tr>
                        ))
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="container mx-auto p-6">
            {loading ? (
                <Loader />
            ) : (
                <div>
                    <div className="flex justify-center mb-6">
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`py-2 px-6 text-lg rounded-t-lg ${activeTab === 'profile' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('fee')}
                                className={`py-2 px-6 text-lg rounded-t-lg ${activeTab === 'fee' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                Fee Information
                            </button>
                        </div>
                    </div>

                    {activeTab === 'profile' && renderProfile()}
                    {activeTab === 'fee' && renderFee()}
                </div>
            )}
        </div>
    );
};

export default StudentDetails;
