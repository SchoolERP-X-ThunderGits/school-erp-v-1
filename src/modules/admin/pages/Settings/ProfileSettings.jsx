import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../../context/UserContext';
import apiName from '../../../../constants/ApiName';
import { getService, putService } from '../../../../constants/Service';
import { showToast } from '../../../../components/Toast';
import { UploadFile } from '../../../../components/UploadFile';
import Button from '../../../../components/ui/button/Button';
import Input from '../../../../components/form/input/InputField';
import { Plans } from '../../../../constants/GlobalConstants';
import Select from '../../../../components/form/Select';
import Loader from '../../../../components/Loader';

const ProfileSettings = () => {
    const { school, setSchoolData } = useUserContext();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Step 1: Load school data from localStorage
    useEffect(() => {
        const profileData = localStorage.getItem('school');
        if (profileData) {
            const parsedData = JSON.parse(profileData);
            setSchoolData(parsedData);
        }
    }, []);

    // Step 2: Fetch profile once `school` is available
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
        return (
            <Loader />
        );
    }

    return (
        <div className="">
            <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl p-8">
                {!isEditing ? (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg">
                                <img
                                    src={profileData?.logo || "https://static.vecteezy.com/system/resources/thumbnails/001/840/612/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <h2 className="text-3xl font-extrabold text-center text-indigo-500 mb-4">
                            {profileData?.name}
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-6 text-gray-700 text-lg mt-6">
                            <div><strong>Contact:</strong> {profileData?.contactNumber}</div>
                            <div><strong>Website:</strong> {profileData?.website}</div>
                            <div><strong>Subdomain:</strong> {profileData?.subdomain}</div>
                            <div><strong>Plan:</strong> {profileData?.plan}</div>
                            {profileData?.email && <div><strong>Email:</strong> {profileData?.email}</div>}
                            <div><strong>Address:</strong> {profileData?.address}</div>
                        </div>

                        <div className="text-center mt-8">
                            <Button
                                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl border-2 border-indigo-600 hover:bg-white hover:text-indigo-600 transition duration-300"
                                onClick={handleEditClick}
                            >
                                Edit Profile
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-semibold text-indigo-800 mb-6">Edit Profile</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { label: 'School Name', name: 'name' },
                                { label: 'Address', name: 'address' },
                                { label: 'Email', name: 'email' },
                                { label: 'Contact Number', name: 'contactNumber' },
                                { label: 'Website', name: 'website' },
                            ].map(({ label, name }) => (
                                <div key={name}>
                                    <label className="text-gray-600">{label}:</label>
                                    <Input
                                        type="text"
                                        name={name}
                                        value={formData?.[name] || ''}
                                        onChange={handleInputChange}
                                        className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    />
                                </div>
                            ))}

                            <div>
                                <label className="text-gray-600">Plan:</label>
                                <Select
                                    placeholder='Select Plan'
                                    options={Plans.map((plan) => ({
                                        value: plan,
                                        label: plan,
                                    }))}
                                    defaultValue={formData?.plan}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, plan: e }));
                                    }}
                                />
                            </div>

                            <div>
                                <label className="text-gray-600">Logo:</label>
                                <Input type="file" name="logo" onChange={handleInputChange} className="mt-2" />
                                {formData?.logo && (
                                    <img src={formData.logo} alt="Logo" className="mt-2 h-20 object-contain rounded-xl shadow" />
                                )}
                            </div>

                            {['directorSignature', 'principalSignature', 'managerSignature'].map(name => (
                                <div key={name}>
                                    <label className="text-gray-600 capitalize">{name.replace(/([A-Z])/g, ' $1')}:</label>
                                    <Input type="file" name={name} onChange={handleInputChange} className="mt-2" />
                                    {formData?.[name] && (
                                        <img src={formData[name]} alt={name} className="mt-2 h-20 object-contain rounded-xl shadow" />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-end space-x-4">
                            <Button
                                onClick={handleSaveClick}
                                className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-green-600 transition"
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
