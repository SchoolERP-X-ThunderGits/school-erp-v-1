import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"
import AuthLayout from './AuthPageLayout';
import { postService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import { showToast } from '../../../../components/Toast';
import { useUserContext } from '../../../../context/UserContext';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setSchoolData } = useUserContext();
  const handleLogin = async (values) => {
    if (!values.username || !values.password) {
      showToast('All fields are required', 'error');
      return;
    }

    const body = {
      username: values.username,
      password: values.password,
      role: "admin"
    };

    try {
      const response = await postService(apiName.adminLogin, body);
      if (response.token) {
        localStorage.setItem("token", response.token); // Save token to sessionStorage
        setSchoolData(response.tenant);
        showToast("Login successfully.", 'success');
        navigate("/admin/home");
      } else {
        console.log("Admin Login Error:", response.error);
      }
    } catch (error) {
      showToast(error.response?.data?.message, 'error');
      console.error('Error posting data:', error);
    }
  };

  return (
    <AuthLayout>

      <div className="flex flex-col flex-1">
        {/* <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          Back to dashboard
        </Link>
      </div> */}
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm">Sign In</h1>
            <p className="text-sm text-gray-500">Enter your username and password to sign in!</p>
          </div>
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {() => (
              <Form className="space-y-6">
                {/* Username Field */}
                <div>
                  <label className="block mb-2">Username</label>
                  <Field
                    name="username"
                    className="w-full p-2 border rounded"
                    placeholder="Enter your username"
                  />
                  <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block mb-2">Password</label>
                  <div className="relative">
                    <Field
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      className="w-full p-2 border rounded"
                      placeholder="Enter your password"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-2 cursor-pointer"
                    >
                      {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </span>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-5 text-center">
            <p className="text-sm">Don't have an account? <Link to="/signup" className="text-blue-500">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default SignInForm;
