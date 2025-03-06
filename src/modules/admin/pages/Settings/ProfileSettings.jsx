import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../../context/UserContext';
import apiName from '../../../../constants/ApiName';
import { getService, putService } from '../../../../constants/Service';

const ProfileSettings = () => {
    const { school } = useUserContext();
    console.log('school', school);

    // States for profile and form data
    const [profileData, setProfileData] = useState();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState();
    const [isEditing, setIsEditing] = useState(false);

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
            const result = await putService(`${apiName.updateProfile}${school?._id}`,formData);
            console.log('mannnnnnresult---', result,);
            console.log('mannnnnnresult---', formData,);
            // setProfileData(result); // Set the fetched data to state
            // setFormData(result); // Set form data for editing
            // setLoading(false);
        } catch (error) {
            console.log('mannnnnnresult---', formData,);
            setLoading(false);
        }
    };
    // Handling input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
                <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Profile Details</h2>
                    <div className="flex justify-center mb-8">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">
                            <img
                                src={profileData?.logo || "https://static.vecteezy.com/system/resources/thumbnails/001/840/612/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg"}
                                alt="Profile"
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',}}>
                        {/* Display fields */}
                        <div className="flex flex-row items-start">
                            <strong  className="text-lg text-gray-700">School Name:</strong>
                            <span  className="text-lg text-gray-700 ml-2">{profileData?.name}</span>
                        </div>
                        
                        <div className="flex flex-row items-start">
                            <strong className="text-lg text-gray-700">Contact Number:</strong>
                            <span className="text-lg text-gray-700 ml-2">{profileData?.contactNumber}</span>
                        </div>
                        <div className="flex flex-row items-start">
                            <strong className="text-lg text-gray-700">Website:</strong>
                            <span className="text-lg text-gray-700 ml-2">{profileData?.website}</span>
                        </div>
                        <div className="flex flex-row items-start">
                            <strong className="text-lg text-gray-700">Subdomain:</strong>
                            <span className="text-lg text-gray-700 ml-2">{profileData?.subdomain}</span>
                        </div>
                        <div className="flex flex-row items-start">
                            <strong className="text-lg text-gray-700">Plan:</strong>
                            <span className="text-lg text-gray-700 ml-2">{profileData?.plan}</span>
                        </div>
                        {
                            profileData?.email &&

                            <div className="flex flex-row items-start">
                                <strong className="text-lg text-gray-700">Email:</strong>
                                <span className="text-lg text-gray-700 ml-2">{profileData?.email}</span>
                            </div>
                        }
                        <div className="flex flex-row items-start">
                            <strong className="text-lg text-gray-700">Address:</strong>
                            <span className="text-lg text-gray-700 ml-2">{profileData?.address}</span>
                        </div>
                    </div>
                    <div className="flex justify-center mt-8">
                        <button
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                            onClick={handleEditClick}
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            ) : (
                // Edit Profile Form
                <div>
                    <h1 style={{fontSize:25}} className="text-xl font-bold mb-4">Edit Profile</h1>
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
                                type="text"
                                name="logo"
                                value={formData?.logo}
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
                                type="text"
                                name="directorSignature"
                                value={formData?.directorSignature}
                                onChange={handleInputChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Principal Signature URL *:</label>
                            <input
                                type="text"
                                name="principalSignature"
                                value={formData?.principalSignature}
                                onChange={handleInputChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Manager Signature URL *:</label>
                            <input
                                type="text"
                                name="managerSignature"
                                value={formData?.managerSignature}
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
