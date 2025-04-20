import React, { useEffect, useState } from 'react';
import { Modal } from '../components/ui/modal';
import Button from '../components/ui/button/Button';
import { useDispatch } from 'react-redux';


function SubscriptionModal({ selectedPlan, onClose, onSuccess }) {

  const planPricing = {
    basic: 1000,
    premium: 2000,
    enterprise: 3000,
  };
  const dispatch = useDispatch();

  const handleRazorpayPayment = () => {
    const amount = planPricing[selectedPlan];

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID', // Replace for prod
      amount: amount * 100,
      currency: 'INR',
      name: 'EduSmart Subscription',
      description: `Subscribe to ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan`,
      handler: function (response) {
        // Dispatch to Redux (if needed)
        dispatch(updateSubscriptionStatus({
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          plan: selectedPlan,
        }));

        // Call parent to update state
        if (onSuccess) {
          onSuccess(selectedPlan);
        }

        onClose();
      },
      prefill: {
        email: 'user@example.com',
        name: 'User Name',
      },
      theme: {
        color: '#4F46E5',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };
  return (
    <div>
      <Modal isOpen={true} onClose={onClose} className="max-w-[500px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Confirm Your Subscription
            </h2>
          <p className="text-gray-600 text-center mb-6">
            You have selected the <span className="font-semibold capitalize">{selectedPlan}</span> plan
            for <span className="text-indigo-600 font-semibold">₹{planPricing[selectedPlan]}</span>/month.
          </p>
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleRazorpayPayment}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Pay Now
            </button>
            <button
              onClick={onClose}
              className="text-indigo-600 px-4 py-2 border border-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SubscriptionModal
