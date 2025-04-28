import React, { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import SubscriptionModal from '../../../../components/SubscriptionModal';
import { getService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';

const Subscriptions = () => {
  const [selectedPlan, setSelectedPlan] = useState(null); // for modal
  const [plansList, setPlansList] = useState([]);
  const [subscribedPlan, setSubscribedPlan] = useState(null); // current plan
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getPlansList();
  }, []);

  const getPlansList = async () => {
    try {
      const result = await getService(apiName.SuperSubscriptionPlan); // API endpoint (e.g. '/posts')
      console.log('result--', result);
      setPlansList(result?.data);
    } catch (error) {
      console.log('error', error);
    }
  };

  const getPlanIndex = (planType) => plansList.findIndex(p => p._id === planType);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan._id);
    setShowModal(true);
  };

  const handleSubscriptionSuccess = (planType) => {
    setSubscribedPlan(planType);
    setShowModal(false);
  };

  const currentPlanIndex = subscribedPlan ? getPlanIndex(subscribedPlan) : -1;

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Choose the plan that fits your needs
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Upgrade, downgrade, or cancel anytime. No hidden fees.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-3 sm:grid-cols-1">
        {plansList.filter(plan => plan.isVisible).map((plan, index) => {
          const isCurrent = subscribedPlan === plan._id;
          const isUpgrade = currentPlanIndex > -1 && index > currentPlanIndex;
          const isDowngrade = currentPlanIndex > -1 && index < currentPlanIndex;

          return (
            <div
              key={plan._id}
              className={`relative rounded-2xl shadow-lg overflow-hidden border 
                ${plan.name === 'premium' ? 'border-blue-600 ring-2 ring-blue-500' : 'border-gray-200'}
                ${isCurrent ? 'border-green-500 ring-green-400' : ''} 
                hover:scale-105 transition-transform duration-300 bg-white`}
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

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrent || isDowngrade}
                  className={`mt-8 w-full py-3 px-6 rounded-lg text-white font-semibold transition 
                    ${isCurrent
                      ? 'bg-green-500 cursor-not-allowed opacity-80'
                      : isDowngrade
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isCurrent
                    ? 'Subscribed'
                    : isUpgrade
                    ? `Upgrade to ${plan.name}`
                    : 'Choose Plan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <SubscriptionModal
          selectedPlan={selectedPlan}
          onClose={() => setShowModal(false)}
          onSuccess={handleSubscriptionSuccess}
        />
      )}
    </div>
  );
};

export default Subscriptions;
