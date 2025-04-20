import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token'); // Replace with your actual auth check logic
  const subscriptionStatus = useSelector((state) => state.subscription.status);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin'); // Redirect to login if not authenticated
    } else if (subscriptionStatus !== 'active') {
      navigate('/admin/subscriptions')
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null; // If authenticated, render children (the component); otherwise, render nothing (can be a redirect).
};

export default ProtectedRoute;
