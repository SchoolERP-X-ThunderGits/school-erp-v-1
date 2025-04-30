import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import AdminSignIn from './modules/admin/pages/Authentication/SignIn';
import ParentSignIn from './modules/parents/pages/Authentication/SignIn';
import AdminHome from './modules/admin/pages/Dashboard/Home';
import ParentHome from './modules/parents/pages/DashBoard/Home';
import FeeType from './modules/admin/pages/Fees/FeeType';
import FeeStructure from './modules/admin/pages/Fees/FeeStructure';
import Loader from './components/Loader/index';
import AppLayout from './Layout/AppLayout';
import ProtectedRoute from './Layout/ProtectedRoute';
import Class from './modules/admin/pages/Academics/Class';
import UpgradeClass from './modules/admin/pages/Academics/UpgradeClass';
import Subject from './modules/admin/pages/Academics/Subject';
import AssignSubject from './modules/admin/pages/Academics/AssignSubject';
import Students from './modules/admin/pages/Students/Students';
import AddStudent from './modules/admin/pages/Students/AddStudent';
import EditStudent from './modules/admin/pages/Students/EditStudent';
import Onboarding from './modules/onboarding/onboarding';
import Exams from './modules/admin/pages/Exams/Exams';
import GenerateAdmitCard from './modules/admin/pages/GenerateAdmitCard/GenerateAdmitCard';
import StudentIDCard from './modules/admin/pages/Students/StudentIDCard';
import ExamSchedule from './modules/admin/pages/Exams/ExamSchedule';
import StudentDetails from './modules/admin/pages/Students/StudentDetails';
import FeeReceipt from './modules/admin/pages/Fees/FeesReceipt';
import GenerateDemandSlip from './modules/admin/pages/Fees/GenerateDemandSlip';
import { UserProvider } from './context/UserContext';
import ProfileSettings from './modules/admin/pages/Settings/ProfileSettings';
import PrivacyPolicy from './modules/admin/pages/Help/PrivacyPolicy';
import UpgradeRollNo from './modules/admin/pages/Academics/UpgradeRollNo';
import Support from './Help/Support';
import "flatpickr/dist/themes/material_green.css";
import Subscriptions from './modules/admin/pages/Settings/Subscriptions';
import Schools from './modules/admin/pages/Schools/Schools';
import SubscriptionPlans from './modules/admin/pages/Subscription/SubscriptionPlans';
import { useDispatch } from 'react-redux';
import { fetchSubscriptionStatus } from './redux/slices/subscriptionSlice';

function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
useEffect(()=>{
  dispatch(fetchSubscriptionStatus());
},[])
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); // Simulate loading time
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      if (pathname === '/' || pathname === '/admin') {
        navigate('/admin/home');
      }
    }
  }, [pathname, navigate]);

  if (loading) return <Loader />; // Show loader while loading

  return (
    <UserProvider>
      <Routes>
        {/* Onboarding Page (not wrapped in DefaultLayout) */}
        <Route path="/" element={<Onboarding />} />

        {/* Admin Section (not wrapped in DefaultLayout) */}
        <Route path="/admin" element={<AdminSignIn />} />

        {/* AppLayout wrapper for admin routes */}
        <Route element={<AppLayout />}>
          {/* Protected Routes */}
          <Route
            path="/admin/home"
            element={
              <AdminHome />
            }
          />
          <Route
            path="/admin/student"
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-student"
            element={
              <ProtectedRoute>
                <AddStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/student/student-details/:studentId"
            element={
              <ProtectedRoute>
                <StudentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-student/:id"
            element={
              <ProtectedRoute>
                <EditStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/student-id-card"
            element={
              <ProtectedRoute>
                <StudentIDCard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/fee-structure"
            element={
              <ProtectedRoute>
                <FeeStructure />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/fee-type"
            element={
              <ProtectedRoute>
                <FeeType />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/fee-receipt/:paymentId"
            element={
              <ProtectedRoute>
                <FeeReceipt />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/class"
            element={
              <ProtectedRoute>
                <Class />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/upgrade-class"
            element={
              <ProtectedRoute>
                <UpgradeClass />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/Upgrade-RollNo"
            element={
              <ProtectedRoute>
                <UpgradeRollNo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/exams"
            element={
              <ProtectedRoute>
                <Exams />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/exam-schedule"
            element={
              <ProtectedRoute>
                <ExamSchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/generate-admit-card"
            element={
              <ProtectedRoute>
                <GenerateAdmitCard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/generate-demand-slip"
            element={
              <ProtectedRoute>
                <GenerateDemandSlip />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subject"
            element={
              <ProtectedRoute>
                <Subject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/assign-subject"
            element={
              <ProtectedRoute>
                <AssignSubject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile-settings"
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/privacy-policy"
            element={
              <ProtectedRoute>
                <PrivacyPolicy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/Support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subscriptions"
            element={
              <ProtectedRoute>
                <Subscriptions />
              </ProtectedRoute>
            }
          />

          {/* super admin routes */}
          <Route
            path="/admin/schools"
            element={
              <ProtectedRoute>
                <Schools />
                </ProtectedRoute>
            }
          />
          <Route
            path="/admin/Subscription-plans"
            element={
              <ProtectedRoute>
                <SubscriptionPlans />
                </ProtectedRoute>
            }
          />

        </Route>

        {/* Parent Section (not wrapped in DefaultLayout) */}
        <Route path="/parent" element={<ParentSignIn />} />
        <Route path="/parent/home" element={<ParentHome />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
