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
import Checkbox from '../../../../components/form/input/Checkbox';
import { Modal } from '../../../../components/ui/modal';
import moment from 'moment';
import { FaEye } from 'react-icons/fa';

const StudentDetails = () => {
    const { school } = useUserContext();
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const { studentId } = useParams();
    const [feeDetails, setFeeDetails] = useState(null);
    const [selectedFees, setSelectedFees] = useState([]);
    const [AdmissionReceptPage, setAdmissionReceptPage] = useState(false);
    const [payModal, setPayModal] = useState(false);
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
                navigate(`/fee-receipt/${result.payment._id}`);
            } else {
                showToast('Failed to collect fee', 'error');
            }
        } catch (error) {
            showToast('Error collecting fee', 'error');
            console.error("Error during fee collection:", error);
        }
    };

    const renderProfile = () => (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
                    <img
                        src={student.student_Photo}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-brand-500 shadow-md"
                    />
                    <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                        {student.first_Name} {student.last_Name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Admission No: {student.admission_Number}
                    </p>
                    <p className="text-sx text-red-500 dark:text-red-500 font-bold">
                        Due Amount: {student.due_amount ? student?.due_amount : 0} ₹
                    </p>

                </div>

                {/* Info Cards */}
                <InfoCard title="Class Info">
                    <InfoItem label="Class" value={student?.class_Id?.name} />
                    <InfoItem label="Section" value={student?.section} />
                    <InfoItem label="Roll No" value={student?.roll_Number} />
                </InfoCard>

                <InfoCard title="Contact Info">
                    <InfoItem label="Email" value={student.email} />
                    <InfoItem label="Phone" value={student.contact_Number} />
                    <InfoItem label="Alternate" value={student.alternet_Contact_Number} />
                </InfoCard>

                <InfoCard title="Personal Details">
                    <InfoItem label="Gender" value={student.gender} />
                    <InfoItem label="DOB" value={new Date(student.date_Of_Birth).toLocaleDateString()} />
                    <InfoItem label="Blood Group" value={student.blood_Group} />
                </InfoCard>

                <InfoCard title="Parents Info">
                    <InfoItem label="Father" value={`${student.father_Name} (${student.father_Occupation})`} />
                    <InfoItem label="Mother" value={`${student.mother_Name} (${student.mother_Occupation})`} />
                </InfoCard>

                <InfoCard title="Address Info">
                    <InfoItem label="Permanent" value={student.permanent_Address} />
                    <InfoItem label="Correspondence" value={student.address_For_Correspondence} />
                </InfoCard>

                {/* Action Button */}
                <div className="col-span-full flex justify-end mt-4">
                    <button
                        onClick={() => setAdmissionReceptPage(true)}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
                    >
                        Generate Admission Receipt
                    </button>
                </div>
            </div>
        </div>
    );

    // InfoCard component
    const InfoCard = ({ title, children }) => (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-brand-500 dark:text-brand-500 border-b border-gray-200 dark:border-gray-700 pb-2">
                {title}
            </h3>
            <div className="space-y-2">{children}</div>
        </div>
    );

    // InfoItem component
    const InfoItem = ({ label, value }) => (
        <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium text-gray-800 dark:text-white">{label}:</span>{' '}
            <span>{value}</span>
        </p>
    );


    const renderPayment = () => (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className='w-full p-4 flex justify-between items-center'>
                <div className='text-3xl font-medium text-gray-800 dark:text-gray-200'>Payment Summary</div>
                {/* {selectedFees.length !== 0 && ( */}
                <Button onClick={() => { setPayModal(true) }}>
                    <Link>Collect Payment</Link>
                </Button>
                {/* )} */}
            </div>
            {feeDetails?.payments.length == 0 ?
                <div>
                    <p className='text-center'>No history found</p>
                </div>
                :
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
                    <Table className="w-full text-left border-collapse">
                        <TableHeader className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                            <TableRow className="text-sm text-gray-600 dark:text-gray-300 border-b dark:border-gray-700">
                                <th className="px-5 py-3">Receipt No.</th>
                                <th className="px-5 py-3">Date</th>
                                <th className="px-5 py-3">Amount</th>
                                <th className="px-5 py-3">Method</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3">Action</th>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-sm divide-y divide-gray-100 dark:divide-gray-800">
                            {feeDetails?.payments?.map((item, index) => (
                                <TableRow key={index} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <TableCell className="px-5 py-4 font-medium text-indigo-600 dark:text-indigo-400">
                                        #{item.receipt_no}
                                    </TableCell>
                                    {console.log('fslfslfs', item)}
                                    <TableCell className="px-5 py-4">{moment(item.date).format("DD-MMM-YYYY").toLowerCase()}</TableCell>
                                    <TableCell className="px-5 py-4">₹{item.amountPaid}</TableCell>
                                    <TableCell className="px-5 py-4">{item.paymentMethod}</TableCell>
                                    <TableCell className="px-5 py-4">
                                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                            Paid
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-5 py-4">
                                        <button onClick={() => {
                                            navigate(`/fee-receipt/${item._id}`);
                                        }}>
                                            <FaEye className='text-gray-700 dark:text-white hover:text-red-500 dark:hover:text-red-400' />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>}
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
                    {activeTab === 'fee' && renderPayment()}
                </div>
            )}

            <Modal isOpen={payModal} onClose={() => {
                setPayModal(false);
                setErrorMessage('');
            }} className="max-w-[1000px] m-4">
                <div className="relative w-full max-w-[1000px] h-[80vh] overflow-hidden rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className='w-full p-4 flex justify-between items-center'>
                        <div className='text-3xl font-medium text-gray-800 dark:text-gray-200'>Fee Info</div>
                        {selectedFees.length > 0 && (
                            <Button onClick={(e) => handleCollectFee(e)}>
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
            </Modal>
        </div>
    );
};

export default StudentDetails;
