import React, { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import SubscriptionModal from '../../../../components/SubscriptionModal';
import { getService, postService } from '../../../../constants/Service'; // Assuming ApiService.js is in the services folder
import apiName from '../../../../constants/ApiName';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubscriptionStatus } from '../../../../redux/slices/subscriptionSlice';
import Button from '../../../../components/ui/button/Button';
import { Link } from 'react-router-dom';

const Subscriptions = () => {
  const [selectedPlan, setSelectedPlan] = useState(null); // for modal
  const [plansList, setPlansList] = useState([]);
  const { status, data } = useSelector((state) => state.subscription);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    getPlansList();
  }, []);

  const getPlansList = async () => {
    try {
      const result = await getService(apiName.SuperSubscriptionPlan);
      setPlansList(result?.data);
    } catch (error) {
      console.log('Error fetching plans:', error);
    }
  };

  const getPlanIndex = (planType) => plansList.findIndex(p => p._id === planType);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleSubscriptionSuccess = (planType) => {
    setShowModal(false);
    getPlansList();
    dispatch(fetchSubscriptionStatus());
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const currentPlanIndex = data ? getPlanIndex(data?.offerPlanId?._id) : -1;

  // Razorpay Payment Function
  const handleRazorpayPayment = async () => {
    try {
      // Step 1: Call API to create the Razorpay order
      const response = await getService(`${apiName.SuperSubscriptionPlan}/orders?billId=${selectedPlan.billId}`);

      if (response.error) {
        alert('Failed to create Razorpay order');
        return;
      }

      const { order_id, amount } = response.data;
      
      const options = {
        key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay key
        amount: amount, // Order amount in paise (100 paise = 1 INR)
        currency: 'INR',
        order_id: order_id, // The order ID from the backend
        name: 'Your Company Name',
        description: 'Subscription for plan',
        image: 'https://your-logo-url.com/logo.png',
        handler: async function (response) {
          try {
            // Step 2: After payment, verify the payment by calling the backend
            const verifyResponse = await postService('/api/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              subscription_plan_id: selectedPlan._id,
              subscriptionMonthByUser: 1, // Example, you might want to get this from user input
            });

            if (verifyResponse.error) {
              alert('Payment verification failed!');
            } else {
              alert('Payment successful!');
              handleSubscriptionSuccess(selectedPlan._id);
            }
          } catch (error) {
            alert('Error verifying payment');
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9876543210',
        },
        notes: {
          address: 'Address for shipping',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open(); // Open Razorpay popup
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      alert('Error while processing payment');
    }
  };

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full p-4 flex justify-between items-center">
        <Button onClick={handleRazorpayPayment}>
          <Link>Pay Amount</Link>
        </Button>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl mt-5 font-extrabold text-gray-900 sm:text-5xl">
          Choose the plan that fits your needs
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Upgrade, downgrade, or cancel anytime. No hidden fees.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-3 sm:grid-cols-1">
        {plansList.filter(plan => plan.isVisible).map((plan, index) => {
          const isCurrent = data?.offerPlanId?._id === plan._id;
          const isUpgrade = currentPlanIndex > -1 && index > currentPlanIndex;
          return (
            <div key={plan._id} className={`relative rounded-2xl shadow-lg overflow-hidden border ${plan.name === 'premium' ? 'border-blue-600 ring-2 ring-blue-500' : 'border-gray-200'} ${isCurrent ? 'border-green-500 ring-green-400' : ''} hover:scale-105 transition-transform duration-300 bg-white`}>
              {plan.name === 'premium' && !isCurrent && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              )}
              {isCurrent && (
                <div className="absolute top-0 right-0 bg-green-600 text-white text-xs font-semibold px-4 py-1 rounded-bl-lg">
                  Current Plan
                </div>
              )}

              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
                <p className="mt-2 text-gray-500">{plan.description}</p>
                <p className="mt-4 text-3xl font-bold text-gray-900">{`$${plan.price}/month`}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={feature._id} className="flex items-center text-gray-700">
                      <FaCheck className="text-green-500 mr-2" />
                      {feature.label}
                    </li>
                  ))}
                </ul>

                <button onClick={() => handleSelectPlan(plan)} disabled={isCurrent} className={`mt-8 w-full py-3 px-6 rounded-lg text-white font-semibold transition ${isCurrent ? 'bg-green-500 cursor-not-allowed opacity-80' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {isCurrent ? 'Subscribed' : isUpgrade ? `Upgrade to ${plan.name}` : 'Choose Plan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <SubscriptionModal selectedPlan={selectedPlan} onClose={handleClose} onSuccess={handleSubscriptionSuccess} />
      )}
    </div>
  );
};

export default Subscriptions;
