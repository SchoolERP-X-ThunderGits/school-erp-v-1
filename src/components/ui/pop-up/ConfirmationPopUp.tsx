import React from 'react';

interface ConfirmationPopupProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ title, message, onConfirm, onCancel, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white opacity-90 flex items-center justify-center z-85">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 animate-fadeIn">
        {/* Header */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        
        {/* Message */}
        <p className="text-gray-600 mb-6">{message}</p>
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
