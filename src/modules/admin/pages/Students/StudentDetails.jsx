import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getService, postService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import { showToast } from '../../../../components/Toast';
import Loader from '../../../../components/Loader';
import { useUserContext } from '../../../../context/UserContext';
import StudentReceiptPage from '../../../../components/StudentReceiptPage';
import Button from '../../../../components/ui/button/Button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../components/ui/table/index';
import Select from '../../../../components/form/Select';
import Checkbox from '../../../../components/form/input/Checkbox';

const StudentDetails = () => {
    const { school } = useUserContext();
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const { studentId } = useParams();
    const [feeDetails, setFeeDetails] = useState(null);
    const [selectedFees, setSelectedFees] = useState([]);
    const [AdmissionReceptPage, setAdmissionReceptPage] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudentDetails();
    }, [studentId]);

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
        const isFeePaid = feeDetails.payments.some(payment =>
            payment.feePaid.some(feePaid => feePaid.feeType === feeGroup.feeType)
        );

        if (isFeePaid) {
            return;
        }

        if (!isSelected(feeGroup)) {
            setSelectedFees(prevSelectedFees => [...prevSelectedFees, feeGroup]);
        } else {
            setSelectedFees(prevSelectedFees => prevSelectedFees.filter(fee => fee._id !== feeGroup._id));
        }
    };

    const isSelected = (feeGroup) => {
        return selectedFees.some(fee => fee._id === feeGroup._id);
    };

    const handleMasterCheckboxChange = (event) => {
        if (event) {
            const allFeeGroups = feeDetails.feeStructures.reduce((acc, feeStructure) => {
                return [
                    ...acc,
                    ...feeStructure.feeGroups.filter(feeGroup => {
                        return !feeDetails.payments.some(payment =>
                            payment.feePaid.some(feePaid => feePaid.feeType === feeGroup.feeType)
                        );
                    })
                ];
            }, []);
            setSelectedFees(allFeeGroups);
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

    const handleCollectFee = async (e) => {
        e.preventDefault();
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

        try {
            const result = await postService(apiName.collectFee, body);

            if (result && result.payment && result.payment._id) {
                showToast('Fee collected successfully', 'success');
                navigate(`/admin/fee-receipt/${result.payment._id}`);
            } else {
                showToast('Failed to collect fee', 'error');
            }
        } catch (error) {
            showToast('Error collecting fee', 'error');
            console.error("Error during fee collection:", error);
        }
    };

    const renderProfile = () => (
        <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 border rounded-xl shadow-sm p-4 flex flex-col items-center text-center">
                    <img
                        src={student.student_Photo}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-gray shadow-lg"
                    />
                    <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
                        {student.first_Name} {student.last_Name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Admission No: {student.admission_Number}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 border rounded-xl shadow p-4">
                    <h3 className="text-md font-semibold mb-2 text-[#465fff] dark:text-[#465fff]">Class Info</h3>
                    <p><strong>Class:</strong> {student?.class_Id?.name}</p>
                    <p><strong>Section:</strong> {student?.section}</p>
                    <p><strong>Roll No:</strong> {student?.roll_Number}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 border rounded-xl shadow p-4">
                    <h3 className="text-md font-semibold mb-2 text-[#465fff] dark:text-[#465fff]">Contact Info</h3>
                    <p><strong>Email:</strong> {student.email}</p>
                    <p><strong>Phone:</strong> {student.contact_Number}</p>
                    <p><strong>Alternate:</strong> {student.alternet_Contact_Number}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 border rounded-xl shadow p-4">
                    <h3 className="text-md font-semibold mb-2 text-[#465fff] dark:text-[#465fff]">Personal Details</h3>
                    <p><strong>Gender:</strong> {student.gender}</p>
                    <p><strong>DOB:</strong> {new Date(student.date_Of_Birth).toLocaleDateString()}</p>
                    <p><strong>Blood Group:</strong> {student.blood_Group}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 border rounded-xl shadow p-4">
                    <h3 className="text-md font-semibold mb-2 text-[#465fff] dark:text-[#465fff]">Parents Info</h3>
                    <p><strong>Father:</strong> {student.father_Name} ({student.father_Occupation})</p>
                    <p><strong>Mother:</strong> {student.mother_Name} ({student.mother_Occupation})</p>
                </div>

                <div className="bg-white dark:bg-gray-800 border rounded-xl shadow p-4">
                    <h3 className="text-md font-semibold mb-2 text-[#465fff] dark:text-[#465fff]">Address Info</h3>
                    <p><strong>Permanent:</strong> {student.permanent_Address}</p>
                    <p><strong>Correspondence:</strong> {student.address_For_Correspondence}</p>
                </div>

                <div className="col-span-full flex justify-end">
                    <Button
                        onClick={() => setAdmissionReceptPage(true)}
                    >
                        Generate Admission Receipt
                    </Button>
                </div>
            </div>
        </div>
    );

    const renderFee = () => (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className='w-full p-4 flex justify-between items-center'>
                <div className='text-3xl font-medium text-gray-800 dark:text-gray-200'>Fee Info</div>
                {selectedFees.length !== 0 && (
                    <Button onClick={(e) => { handleCollectFee(e) }}>
                        <Link>Collect Fee</Link>
                    </Button>
                )}
            </div>

            <div className="overflow-x-auto">
                {feeDetails && feeDetails.feeStructures && feeDetails.feeStructures.length > 0 ? (
                    <Table className="w-full min-w-[800px] text-left border-collapse">
                        <TableHeader className='bg-gray-100 dark:bg-gray-800'>
                            <TableRow>
                                <th className='px-5 py-3 font-medium text-gray-500 text-left'>
                                    <Checkbox
                                        disabled={feeDetails.payments.some((payment) =>
                                            feeDetails.feeStructures.some((feeStructure) =>
                                                feeStructure.feeGroups.some((feeGroup) =>
                                                    payment.feePaid.some((feePaid) => feePaid.feeType === feeGroup.feeType && feePaid.paidAmount > 0)
                                                )
                                            )
                                        )}
                                        checked={feeDetails.feeStructures.every(feeStructure =>
                                            feeStructure.feeGroups.every(feeGroup =>
                                                isSelected(feeGroup) ||
                                                feeDetails.payments.some(payment =>
                                                    payment.feePaid.some(feePaid =>
                                                        feePaid.feeType === feeGroup.feeType && feePaid.paidAmount > 0
                                                    )
                                                )
                                            )
                                        )}
                                        onChange={handleMasterCheckboxChange}
                                    />
                                </th>
                                {['Fees Structure', 'Fees Type', 'Due Date', 'Amount', 'Status', 'Discount', 'Fine'].map((header) => (
                                    <th key={header} className="px-5 py-3 font-medium text-gray-500 text-left">{header}</th>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {feeDetails.feeStructures?.map((feeStructure) =>
                                feeStructure.feeGroups?.map((feeGroup) => (
                                    <TableRow className='border-gray-200 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800' key={feeGroup._id}>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                            <Checkbox
                                                disabled={feeDetails.payments.some((payment) =>
                                                    payment.feePaid.some((feePaid) => feePaid.feeType === feeGroup.feeType)
                                                )}
                                                style={{
                                                    opacity: feeDetails.payments.some((payment) =>
                                                        payment.feePaid.some((feePaid) => feePaid.feeType === feeGroup.feeType)
                                                    ) ? 0 : 1
                                                }}
                                                checked={isSelected(feeGroup)}
                                                onChange={() => handleFeeSelection(feeGroup)}
                                            />
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{feeStructure.name}</TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{feeGroup.feeType}</TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                            {new Date(feeGroup.dueDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">₹{feeGroup.amount}</TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                            {setStatusForFeeGroups(feeGroup.feeType, feeGroup.dueDate, feeDetails.payments)}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">₹0</TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">₹0</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center text-gray-600 dark:text-gray-300 py-6">
                        No fees found
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {loading ? (
                <Loader />
            ) : AdmissionReceptPage ? (
                <StudentReceiptPage
                    student={student}
                    school={school}
                    setAdmissionReceptPage={setAdmissionReceptPage}
                />
            ) : (
                <div>
                    <div className="w-full flex justify-center mt-4 mb-8">
                        <div className="relative flex space-x-2 bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 px-2 py-1 rounded-full shadow-lg backdrop-blur-md">
                            {[{ key: 'profile', label: 'Profile' }, { key: 'fee', label: 'Fee Information' }].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center space-x-2 px-5 py-2 rounded-full font-semibold text-sm md:text-base transition-all duration-300
                                ${activeTab === tab.key
                                            ? 'bg-[#465fff] text-white shadow-md'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <span>{tab.label}</span>
                                </button>
                            ))}
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
