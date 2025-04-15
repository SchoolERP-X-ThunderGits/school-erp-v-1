import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AdminSignIn from './modules/admin/pages/Authentication/SignIn';
import ParentSignIn from './modules/parents/pages/Authentication/SignIn';
import AdminHome from './modules/admin/pages/Dashboard/Home';
import ParentHome from './modules/parents/pages/DashBoard/Home';
import FindStudent from './modules/admin/pages/Students/FindStudent';
import FeeType from './modules/admin/pages/Fees/FeeType';
import FeeStructure from './modules/admin/pages/Fees/FeeStructure';
import Loader from './components/Loader/index';
import AppLayout from './Layout/AppLayout';
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
function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Only redirect if you're not already on the home page or any other admin pages
      if (pathname === '/' || pathname === '/admin') {
        navigate('/admin/home');
      }
    }
  }, [pathname, navigate]);

  return loading ? (
    <Loader />
  ) : (
    <UserProvider>
      <Routes>
        {/* Onboarding Page (not wrapped in DefaultLayout) */}
        <Route path="/" element={<Onboarding />} />

        {/* Admin Section (wrapped in DefaultLayout) */}
        <Route path="/admin" element={<AdminSignIn />} />
        <Route element={<AppLayout />}>
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/student" element={<Students />} />
        <Route path="/admin/add-student" element={<AddStudent />} />
        <Route path="/admin/student/student-details/:studentId" element={<StudentDetails />} />
        <Route path="/admin/edit-student/:id" element={<EditStudent />} />
        <Route path="/admin/student-id-card" element={<StudentIDCard />} />
        <Route path="/admin/find-student" element={<FindStudent />} />
        <Route path="/admin/fee-structure" element={<FeeStructure />} />
        <Route path="/admin/fee-type" element={<FeeType />} />
        <Route path="/admin/fee-receipt/:paymentId" element={<FeeReceipt />} />
        <Route path="/admin/class" element={<Class />} />
        <Route path="/admin/upgrade-class" element={<UpgradeClass />} />
        <Route path="/admin/Upgrade-RollNo" element={<UpgradeRollNo />} />
        <Route path="/admin/exams" element={<Exams />} />
        <Route path="/admin/exam-schedule" element={<ExamSchedule />} />
        <Route path="/admin/generate-admit-card" element={<GenerateAdmitCard />} />
        <Route path="/admin/generate-demand-slip" element={<GenerateDemandSlip />} />
        <Route path="/admin/subject" element={<Subject />} />
        <Route path="/admin/assign-subject" element={<AssignSubject />} />
        <Route path="/admin/profile-settings" element={<ProfileSettings />} />
        <Route path="/admin/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/admin/Support" element={<Support />} />
     </Route>
        {/* Parent Section (not wrapped in DefaultLayout) */}
        <Route path="/parent" element={<ParentSignIn />} />
        <Route path="/parent/home" element={<ParentHome />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
