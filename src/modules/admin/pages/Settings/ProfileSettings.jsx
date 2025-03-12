import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../../context/UserContext';
import apiName from '../../../../constants/ApiName';
import { getService, putService } from '../../../../constants/Service';
import { showToast } from '../../../../components/Toast';
import { UploadFile } from '../../../../components/UploadFile';

const ProfileSettings = () => {
    const { school } = useUserContext();
    // States for profile and form data
    const [profileData, setProfileData] = useState();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const { setSchoolData } = useUserContext();
    // Fetch profile details
    useEffect(() => {
        getProfileDetails();
    }, []);

    const getProfileDetails = async () => {
        try {
            const result = await getService(`${apiName.getProfile}${school?._id}`);
            console.log('result---', result);
            setProfileData(result); // Set the fetched data to state
            setFormData(result); // Set form data for editing
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };
    const updateProfileDetails = async () => {
        try {
            const result = await putService(`${apiName.getProfile}${school?._id}`, formData);
            setSchoolData(result?.tenant)
            showToast('Profile update successfully', 'success')
        } catch (error) {
            showToast('Unable to update profile', 'error')
            setLoading(false);
        }
    };
    // Handling input changes
    const handleInputChange = (e) => {
        const { name, value, files, type } = e.target;
        if (type === 'file') {
            if (files && files[0]) {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: files[0] // Store the file object directly in the state
                }));
                if (files[0]) {
                    UploadFile(files[0])
                        .then((url) => {
                            // Successfully uploaded, use the URL
                            setFormData({
                                ...formData,
                                [name]: url, // Set the URL in your form data
                            });
                        })
                        .catch((error) => {
                            // Handle error
                            console.error(error);
                            showToast(error, "error");
                        });
                }
            }
        } else {

            setFormData({ ...formData, [name]: value });
        }
    };

    // Handle Edit button click
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Handle Save button click
    const handleSaveClick = () => {
        setProfileData(formData);  // Save the updated data
        setIsEditing(false);  // Close edit mode
        updateProfileDetails()
    };

    return (
        <div className="container mx-auto p-4">
            {/* Profile Details */}
            {!isEditing ? (
                <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-lg p-8">
                    <div className="flex justify-center mb-8">
                        <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-blue-500">
                            <img
                                src={profileData?.logo || "https://static.vecteezy.com/system/resources/thumbnails/001/840/612/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg"}
                                alt="Profile"
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>

                    <h2 className="text-4xl font-semibold text-center mb-6 text-gray-800">{profileData?.name}</h2>

                    <div style={{ height: 2, backgroundColor: '#e2e8f0', marginBottom: 24 }}></div>

                    <div className="space-y-4">
                        <div className="flex flex-row items-center">
                            <strong className="text-lg text-gray-700 w-32">Contact Number:</strong>
                            <span className="text-lg text-gray-800">{profileData?.contactNumber}</span>
                        </div>
                        <div className="flex flex-row items-center">
                            <strong className="text-lg text-gray-700 w-32">Website:</strong>
                            <span className="text-lg text-gray-800">{profileData?.website}</span>
                        </div>
                        <div className="flex flex-row items-center">
                            <strong className="text-lg text-gray-700 w-32">Subdomain:</strong>
                            <span className="text-lg text-gray-800">{profileData?.subdomain}</span>
                        </div>
                        <div className="flex flex-row items-center">
                            <strong className="text-lg text-gray-700 w-32">Plan:</strong>
                            <span className="text-lg text-gray-800">{profileData?.plan}</span>
                        </div>
                        {profileData?.email && (
                            <div className="flex flex-row items-center">
                                <strong className="text-lg text-gray-700 w-32">Email:</strong>
                                <span className="text-lg text-gray-800">{profileData?.email}</span>
                            </div>
                        )}
                        <div className="flex flex-row items-center">
                            <strong className="text-lg text-gray-700 w-32">Address:</strong>
                            <span className="text-lg text-gray-800">{profileData?.address}</span>
                        </div>
                    </div>

                    <div className="flex justify-center mt-8">
                        <button
                            className="px-8 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                            onClick={handleEditClick}
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>

            ) : (
                // Edit Profile Form
                <div>
                    <h1 style={{ fontSize: 25 }} className="text-xl font-bold mb-4">Edit Profile</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                        {/* School Name */}
                        <div className="mb-4">
                            <label className="block text-gray-700">School Name *:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData?.name}
                                onChange={handleInputChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>

                        {/* Address */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Address *:</label>
                            <input
                                type="text"
                                name="address"
                                value={formData?.address}
                                onChange={handleInputChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Email *:</label>
                            <input
                                type="text"
                                name="email"
                                value={formData?.email}
                                onChange={handleInputChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        {/* Contact Number */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Contact Number *:</label>
                            <input
                                type="text"
                                name="contactNumber"
                                value={formData?.contactNumber}
                                onChange={handleInputChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>

                        {/* Website */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Website *:</label>
                            <input
                                type="text"
                                name="website"
                                value={formData?.website}
                                onChange={handleInputChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>

                        {/* Subdomain */}
                        <div className="mb-4">
                            <label className="block text-gray-700">logo *:</label>
                            <input
                                type="file"
                                name="logo"
                                onChange={handleInputChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>

                        {/* Plan */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Plan *:</label>
                            <select
                                name="plan"
                                value={formData?.plan}
                                onChange={handleInputChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            >
                                <option value="free">Free</option>
                                <option value="basic">Basic</option>
                                <option value="premium">Premium</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Director Signature URL *:</label>
                            <input
                                type="file"
                                name="directorSignature"
                                onChange={handleInputChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Principal Signature URL *:</label>
                            <input
                                type="file"
                                name="principalSignature"
                                onChange={handleInputChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Manager Signature URL *:</label>
                            <input
                                type="file"
                                name="managerSignature"
                                onChange={handleInputChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>

                    </div>

                    {/* Save Button */}
                    <div className="mt-4">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded mr-4"
                            onClick={handleSaveClick}
                        >
                            Save Changes
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-300 text-black rounded"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSettings;
