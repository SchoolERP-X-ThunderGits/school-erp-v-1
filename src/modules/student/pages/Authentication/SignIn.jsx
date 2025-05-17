import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { postService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import { showToast } from '../../../../components/Toast';
import { useUserContext } from '../../../../context/UserContext';
import AuthLayout from '../../../admin/pages/Authentication/AuthPageLayout';
import Input from '../../../../components/form/input/InputField';

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  admission_number: Yup.string().required('Admission Number is required'),
  password: Yup.date().required('Password is required')
});

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setSchoolData } = useUserContext();

  const handleLogin = async (values) => {
    if (!values.admission_number || !values.password) {
      showToast('All fields are required', 'error');
      return;
    }

    const body = {
      admission_Number: values.admission_number,
      date_Of_Birth: values.password,
      // role: "student"
    };

    try {
      const response = await postService(apiName.studentLogin, body);
      console.log('response', response);
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", 'student');
        localStorage.setItem("studentData", JSON.stringify(response?.student));
        setSchoolData(response.tenant);
        showToast("Login successful.", 'success');
        navigate("/student/home");
      } else {
        console.log("Admin Login Error:", response.error);
      }
    } catch (error) {
      showToast(error.response?.statusText, 'error');
      console.error('Error posting data:', error);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col flex-1">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <h1 className="mb-2 font-semibold text-gray-800 dark:text-gray-100 text-title-sm">Sign In</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enter your Admission Number and Password to sign in!</p>
          </div>
          <Formik
            initialValues={{ admission_number: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ setFieldValue, values }) => (
              <Form className="space-y-6">
                {/* Admission Number Field */}
                <div>
                  <label className="block mb-2 text-gray-700 dark:text-gray-300">Admission Number</label>
                  <Field
                    name="admission_number"
                    className="w-full p-2 border rounded text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Enter your admission number"
                  />
                  <ErrorMessage name="admission_number" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Date of Birth Field */}
                <div>
                  <label className="block mb-2 text-gray-700 dark:text-gray-300">Enter Password</label>
                  <div className="relative">
                    <Field
                      placeholder="Enter your password"
                      name="password"
                      className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-700 text-black dark:text-white dark:border-gray-600"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </Form>
            )}
          </Formik>

        </div>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
