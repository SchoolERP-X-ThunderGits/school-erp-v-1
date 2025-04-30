import React, { useEffect, useState } from 'react';
import { Modal } from '../components/ui/modal';
import Button from '../components/ui/button/Button';
import { useDispatch } from 'react-redux';
import { getService } from '../constants/Service';
import apiName from '../constants/ApiName';
import { showToast } from './Toast';


function SubscriptionModal({ selectedPlan, onClose, onSuccess }) {


  const dispatch = useDispatch();

  const onSubscribe = async(e)=>{
      e.preventDefault();
      // const body = {
      //     name: examName,
      //     session: examSession,
      // };
          try {
              const response = await getService(`${apiName.subscriptions}/create/${selectedPlan?._id}`);
              console.log('respofdfnse', response)
              onSuccess(response?.offerPlanId)
              showToast("Subscription activated successfully.", 'success');
          } catch (error) {
              console.error('Error posting data:', error);
              showToast(error?.response?.data?.message,'error')
          }
  }

  return (
    <div>
      <Modal isOpen={true} onClose={onClose} className="max-w-[500px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Confirm Your Subscription
          </h2>
          <p className="text-gray-600 text-center mb-6">
            You have selected the <span className="font-semibold capitalize">{selectedPlan?.name}</span> plan
            for <span className="text-indigo-600 font-semibold">₹{selectedPlan?.price}</span>/month.
          </p>
          <div className="flex flex-col space-y-4">
            <button
              onClick={onSubscribe}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
             Subscribe
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
