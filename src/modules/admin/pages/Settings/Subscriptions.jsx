import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import SubscriptionModal from '../../../../components/SubscriptionModal';
import { getService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubscriptionStatus } from '../../../../redux/slices/subscriptionSlice';

const Subscriptions = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plansList, setPlansList] = useState([]);
  const { status, data } = useSelector((state) => state.subscription);
  console.log('sfksfksdf', data)
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

  return (
    <div className="bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 min-h-screen">
      {/* <div className="w-full p-4 flex justify-end items-center">
        <Button onClick={handleRazorpayPayment}>
          <Link>Pay Amount</Link>
        </Button>
      </div> */}

      <div className="text-center mb-12">
        <h2 className="text-3xl mt-5 font-extrabold text-gray-900 dark:text-white sm:text-5xl">
          Choose the plan that fits your needs
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Upgrade, downgrade, or cancel anytime. No hidden fees.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-3 sm:grid-cols-1">
        {plansList.filter(plan => plan.isVisible).map((plan, index) => {
          const isCurrent = data?.offerPlanId?._id === plan._id;
          const isUpgrade = currentPlanIndex > -1 && index > currentPlanIndex;

          return (
            <div
              key={plan._id}
              className={`relative rounded-2xl shadow-lg overflow-hidden border transition-transform duration-300 hover:scale-105 
                ${plan.name === 'premium' ? 'border-blue-600 ring-2 ring-blue-500' : 'border-gray-200 dark:border-gray-600'} 
                ${isCurrent ? 'border-green-500 ring-green-400' : ''} 
                bg-white dark:bg-gray-800`}
            >
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
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">{plan.description}</p>
                <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{`₹${plan.price}/student`}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{plan.validityInDays} days • {plan.recurence}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={feature._id} className="flex items-center text-gray-700 dark:text-gray-300">
                      <FaCheck className="text-green-500 mr-2" />
                      {feature.label}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrent}
                  className={`mt-8 w-full py-3 px-6 rounded-lg text-white font-semibold transition 
                    ${isCurrent ? 'bg-green-500 cursor-not-allowed opacity-80' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
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
