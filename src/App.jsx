import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import AdminSignIn from './modules/admin/pages/Authentication/SignIn';
import ParentSignIn from './modules/parents/pages/Authentication/SignIn';
import AdminHome from './modules/admin/pages/Dashboard/Home';
import ParentHome from './modules/parents/pages/DashBoard/Home';
import FindStudent from './modules/admin/pages/Students/FindStudent';
import FeeType from './modules/admin/pages/Fees/FeeType'
import FeeStructure from './modules/admin/pages/Fees/FeeStructure'
import Loader from './components/Loader/index';
import DefaultLayout from './Layout/DefaultLayout';
import Class from './modules/admin/pages/Academics/Class';
import Subject from './modules/admin/pages/Academics/Subject';
import AssignSubject from './modules/admin/pages/Academics/AssignSubject';
import Students from './modules/admin/pages/Students/Students';

function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        {/* Admin Section */}
          <Route path="/admin" element={<AdminSignIn />} />
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/add-student" element={<Students />} />
          <Route path="/admin/find-student" element={<FindStudent />} />
          <Route path="/admin/fee-structure" element={<FeeStructure />} />
          <Route path="/admin/fee-type" element={<FeeType />} />
          <Route path="/admin/class" element={<Class />} />
          <Route path="/admin/subject" element={<Subject />} />
          <Route path="/admin/assign-subject" element={<AssignSubject />} />

        {/* Parent Section */}
          <Route path="/parent" element={<ParentHome />} />
          <Route path="/parent/home" element={<ParentHome />} />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
