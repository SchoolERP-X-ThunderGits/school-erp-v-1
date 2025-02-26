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
import DefaultLayout from './Layout/DefaultLayout';
import Class from './modules/admin/pages/Academics/Class';
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
    const token = sessionStorage.getItem('token');
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
    <Routes>
      {/* Onboarding Page (not wrapped in DefaultLayout) */}
      <Route path="/" element={<Onboarding />} />

      {/* Admin Section (wrapped in DefaultLayout) */}
      <Route path="/admin" element={<AdminSignIn />} />
      <Route path="/admin/home" element={<DefaultLayout><AdminHome /></DefaultLayout>} />
      <Route path="/admin/student" element={<DefaultLayout><Students /></DefaultLayout>} />
      <Route path="/admin/add-student" element={<DefaultLayout><AddStudent /></DefaultLayout>} />
      <Route path="/admin/student/student-details/:studentId" element={<DefaultLayout><StudentDetails /></DefaultLayout>} />
      <Route path="/admin/edit-student/:id" element={<DefaultLayout><EditStudent /></DefaultLayout>} />
      <Route path="/admin/student-id-card" element={<DefaultLayout><StudentIDCard /></DefaultLayout>} />
      <Route path="/admin/find-student" element={<DefaultLayout><FindStudent /></DefaultLayout>} />
      <Route path="/admin/fee-structure" element={<DefaultLayout><FeeStructure /></DefaultLayout>} />
      <Route path="/admin/fee-type" element={<DefaultLayout><FeeType /></DefaultLayout>} />
      <Route path="/admin/fee-receipt/:paymentId" element={<DefaultLayout><FeeReceipt /></DefaultLayout>} />
      <Route path="/admin/class" element={<DefaultLayout><Class /></DefaultLayout>} />
      <Route path="/admin/exams" element={<DefaultLayout><Exams /></DefaultLayout>} />
      <Route path="/admin/exam-schedule" element={<DefaultLayout><ExamSchedule /></DefaultLayout>} />
      <Route path="/admin/generate-admit-card" element={<DefaultLayout><GenerateAdmitCard /></DefaultLayout>} />
      <Route path="/admin/generate-demand-slip" element={<DefaultLayout><GenerateDemandSlip /></DefaultLayout>} />
      <Route path="/admin/subject" element={<DefaultLayout><Subject /></DefaultLayout>} />
      <Route path="/admin/assign-subject" element={<DefaultLayout><AssignSubject /></DefaultLayout>} />

      {/* Parent Section (not wrapped in DefaultLayout) */}
      <Route path="/parent" element={<ParentSignIn />} />
      <Route path="/parent/home" element={<ParentHome />} />
    </Routes>
  );
}

export default App;
