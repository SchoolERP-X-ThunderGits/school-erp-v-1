import React, { useState } from 'react';
import { postService } from '../../constants/Service';
import apiName from '../../constants/ApiName';

const ResetPassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {
            // You might need to adjust the API endpoint and payload
            console.log('Resetting password with:', { oldPassword, newPassword });
            const response = await postService(apiName.resetPassword, { oldPassword, newPassword });
            if (response.status === 200) {
                setMessage('Password reset successfully.');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError(response.data.message || 'Failed to reset password. Please try again.');
            }
        } catch (err) {
            setError('Failed to reset password. Please try again.');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center">Reset Password</h2>
            {message && <p className="text-green-500">{message}</p>}
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleResetPassword} className="mt-4">
                <div>
                    <label
                        htmlFor="oldPassword"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Old Password
                    </label>
                    <input
                        type="password"
                        id="oldPassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mt-4">
                    <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700"
                    >
                        New Password
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mt-4">
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Reset Password
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResetPassword;
