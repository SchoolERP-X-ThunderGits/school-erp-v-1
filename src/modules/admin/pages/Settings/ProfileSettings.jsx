import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../../context/UserContext';
import apiName from '../../../../constants/ApiName';
import { getService, putService } from '../../../../constants/Service';
import { showToast } from '../../../../components/Toast';
import { UploadFile } from '../../../../components/UploadFile';
import Button from '../../../../components/ui/button/Button';
import Input from '../../../../components/form/input/InputField';
import Loader from '../../../../components/Loader';

const ProfileSettings = () => {
    const { school, setSchoolData } = useUserContext();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const profileData = localStorage.getItem('school');
        if (profileData) {
            const parsedData = JSON.parse(profileData);
            setSchoolData(parsedData);
        }
    }, []);

    useEffect(() => {
        if (school?._id) {
            getProfileDetails();
        }
    }, [school]);

    const getProfileDetails = async () => {
        setLoading(true);
        try {
            const result = await getService(`${apiName.getProfile}${school._id}`);
            setProfileData(result);
            setFormData(result);
            setLoading(false);
        } catch (error) {
            showToast('Failed to load profile details', 'error');
            setLoading(false);
        }
    };

    const updateProfileDetails = async () => {
        setLoading(true);
        try {
            const result = await putService(`${apiName.getProfile}${school._id}`, formData);
            setSchoolData(result?.tenant);
            showToast('Profile updated successfully', 'success');
            setLoading(false);
        } catch (error) {
            showToast('Unable to update profile', 'error');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, files, type } = e.target;
        if (type === 'file' && files && files[0]) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
            UploadFile(files[0])
                .then(url => {
                    setFormData(prev => ({ ...prev, [name]: url }));
                })
                .catch(error => {
                    console.error(error);
                    showToast(error, 'error');
                });
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleEditClick = () => setIsEditing(true);

    const handleSaveClick = () => {
        setProfileData(formData);
        setIsEditing(false);
        updateProfileDetails();
    };

    if (loading || !formData) {
        return <Loader />;
    }

    return (
        <div className="">
            <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8">
                {!isEditing ? (
                    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-10">
                        {/* Profile Picture Section */}
                        <div className="flex justify-center mb-8">
                            <div className="w-32 h-32 sm:w-32 sm:h-32 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-600 shadow-lg transform transition duration-300">
                                <img
                                    src={profileData?.logo || "https://static.vecteezy.com/system/resources/thumbnails/001/840/612/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Profile Name */}
                        <h2 className="text-3xl font-bold text-center text-indigo-800 dark:text-white mb-6">
                            {profileData?.name}
                        </h2>

                        {/* Profile Info Grid */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {[
                                { label: 'Contact', value: profileData?.contactNumber },
                                { label: 'Website', value: profileData?.website },
                                { label: 'Subdomain', value: profileData?.subdomain },
                                { label: 'Registration Number', value: profileData?.registrationNumber },
                                { label: 'UDISE Number', value: profileData?.udiseNumber },
                                { label: 'Email', value: profileData?.email },
                                { label: 'Address', value: profileData?.address },
                                { label: 'Razorpay Key Id', value: profileData?.razorPayID },
                                { label: 'Razorpay Key Secret', value: profileData?.razorPaySecret },
                            ].map(({ label, value }, index) => (
                                value && (
                                    <div key={index} className="card p-4 rounded-xl shadow-sm bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600 transition duration-300">
                                        <strong className="text-[#465fff] dark:text-indigo-300">{label}</strong>
                                        <p className="text-gray-900 dark:text-gray-200">{value}</p>
                                    </div>
                                )
                            ))}
                            {/* QR Code */}
                            {formData.qrCodeUrl && (
                                <div className="card p-4 rounded-xl shadow-sm bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600 transition duration-300">
                                    <strong className="text-[#465fff] dark:text-indigo-300">QR Code</strong>
                                    <img
                                        src={formData.qrCodeUrl}
                                        alt="QR Code"
                                        className="mt-2 h-20 object-contain rounded-xl shadow bg-white dark:bg-gray-800"
                                    />
                                </div>
                            )}

                            {/* Signatures */}
                            {formData.directorSignature && (
                                <div className="card p-4 rounded-xl shadow-sm bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600 transition duration-300">
                                    <strong className="text-[#465fff] dark:text-indigo-300">Director Signature</strong>
                                    <img
                                        src={formData.directorSignature}
                                        alt="Director Signature"
                                        className="mt-2 h-20 object-contain rounded-xl shadow bg-white dark:bg-gray-800"
                                    />
                                </div>
                            )}

                            {formData.principalSignature && (
                                <div className="card p-4 rounded-xl shadow-sm bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600 transition duration-300">
                                    <strong className="text-[#465fff] dark:text-indigo-300">Principal Signature</strong>
                                    <img
                                        src={formData.principalSignature}
                                        alt="Principal Signature"
                                        className="mt-2 h-20 object-contain rounded-xl shadow bg-white dark:bg-gray-800"
                                    />
                                </div>
                            )}

                            {formData.managerSignature && (
                                <div className="card p-4 rounded-xl shadow-sm bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600 transition duration-300">
                                    <strong className="text-[#465fff] dark:text-indigo-300">Manager Signature</strong>
                                    <img
                                        src={formData.managerSignature}
                                        alt="Manager Signature"
                                        className="mt-2 h-20 object-contain rounded-xl shadow bg-white dark:bg-gray-800"
                                    />
                                </div>
                            )}

                        </div>

                        {/* Edit Profile Button */}
                        <div className="text-center mt-10">
                            <Button
                                className="px-8 py-3 bg text-white font-semibold rounded-lg border-2 border-indigo-600 hover:bg-white hover:text-indigo-600 dark:hover:bg-gray-800 transition duration-300"
                                onClick={handleEditClick}
                            >
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-semibold text-indigo-800 dark:text-white mb-6">Edit Profile</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { label: 'School Name', name: 'name' },
                                { label: 'Address', name: 'address' },
                                { label: 'Registration Number', name: 'registrationNumber' },
                                { label: 'UDISE Number', name: 'udiseNumber' },
                                { label: 'Email', name: 'email' },
                                { label: 'Contact Number', name: 'contactNumber' },
                                { label: 'Website', name: 'website' },
                                { label: 'Razorpay Key Id', name: 'razorPayID' },
                                { label: 'Razorpay Key Secret', name: 'razorPaySecret' },
                            ].map(({ label, name }) => (
                                <div key={name}>
                                    <label className="text-gray-600 dark:text-gray-300">{label}:</label>
                                    <Input
                                        type="text"
                                        name={name}
                                        value={formData?.[name] || ''}
                                        onChange={handleInputChange}
                                        className="w-full mt-2 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    />
                                </div>
                            ))}

                            <div>
                                <label className="text-gray-600 dark:text-gray-300">Logo:</label>
                                <Input type="file" name="logo" onChange={handleInputChange} className="mt-2" />
                                {formData?.logo && (
                                    <img src={formData.logo} alt="Logo" className="mt-2 h-20 object-contain rounded-xl shadow bg-white dark:bg-gray-800" />
                                )}
                            </div>

                            {['directorSignature', 'principalSignature', 'managerSignature'].map(name => (
                                <div key={name}>
                                    <label className="text-gray-600 dark:text-gray-300 capitalize">{name.replace(/([A-Z])/g, ' $1')}:</label>
                                    <Input type="file" name={name} onChange={handleInputChange} className="mt-2" />
                                    {formData?.[name] && (
                                        <img src={formData[name]} alt={name} className="mt-2 h-20 object-contain rounded-xl shadow bg-white dark:bg-gray-800" />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-end space-x-4">
                            <Button
                                onClick={handleSaveClick}
                                className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition"
                            >
                                Save Changes
                            </Button>
                            <Button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-3 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition"
                            >
                                Cancel
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfileSettings;
