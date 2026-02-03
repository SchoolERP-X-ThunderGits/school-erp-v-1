import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { postService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import { showToast } from '../../../../components/Toast';
import { useUserContext } from '../../../../context/UserContext';

/* ── Validation ── */
const validationSchema = Yup.object().shape({
  admission_number: Yup.string().required('Admission Number is required'),
  password: Yup.string().required('Password is required'),
});

/* ── Breakpoints ── */
const BP = { mobile: 520, tablet: 768 };

const SignIn = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile  = width < BP.mobile;
  const isTablet  = width >= BP.mobile && width < BP.tablet;
  const isDesktop = width >= BP.tablet;

  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate                = useNavigate();
  const { setSchoolData }       = useUserContext();

  /* ── API ── */
  const handleLogin = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const response = await postService(apiName.studentLogin, {
        admission_Number: values.admission_number,
        date_Of_Birth:    values.password,
      });

      if (response.token) {
        localStorage.setItem('token',       response.token);
        localStorage.setItem('role',        'student');
        localStorage.setItem('studentData', JSON.stringify(response?.student));
        setSchoolData(response.tenant);
        showToast('Login successful.', 'success');
        navigate('/student/home');
      } else {
        showToast(response.error || 'Login failed.', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong.', 'error');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  /* ── focus / blur ── */
  const onFocus = (e) => {
    e.target.style.borderColor = '#3b82f6';
    e.target.style.boxShadow  = '0 0 0 3px rgba(59,130,246,0.18)';
  };
  const onBlurStyle = (e) => {
    e.target.style.borderColor = '#d1d5db';
    e.target.style.boxShadow  = 'none';
  };

  /* ── render ── */
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '16px' : '24px',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>

      {/* ─── CARD ─── */}
      <div style={{
        display:        'flex',
        flexDirection:  isMobile ? 'column-reverse' : 'row',
        width:          '100%',
        maxWidth:       '820px',
        borderRadius:   isMobile ? '16px' : '20px',
        overflow:       'hidden',
        boxShadow:      '0 8px 40px rgba(0,0,0,0.10)',
        background:     '#fff',
      }}>

        {/* ─── LEFT PANEL (form) ─── */}
        <div style={{
          flex:            '1 1 0',
          padding:         isMobile ? '32px 20px 28px' : isTablet ? '36px 28px' : '40px 36px',
          display:         'flex',
          flexDirection:   'column',
          justifyContent:  isDesktop ? 'center' : 'flex-start',
          position:        'relative',
          minWidth:        0,
        }}>

          {/* Badge */}
          <div style={{ marginBottom: isMobile ? '20px' : '50px' }}>
            <span style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '6px',
              background:     '#f3f4f6',
              border:         '1px solid #e5e7eb',
              borderRadius:   '999px',
              padding:        '5px 14px',
              fontSize:       '13px',
              color:          '#374151',
              fontWeight:     500,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="8" r="4" />
              </svg>
              Student Portal
            </span>
          </div>

          {/* h1 */}
          <h1 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>
            Student Login
          </h1>

          {/* subtitle */}
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 22px 0', lineHeight: 1.4 }}>
            Enter your Admission Number and Password to sign in!
          </p>

          {/* ──────── FORM ──────── */}
          <Formik
            initialValues={{ admission_number: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ errors, touched, handleBlur }) => (
              <Form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Admission Number */}
                <div>
                  <label style={S.label}>Admission Number</label>
                  <Field name="admission_number">
                    {({ field }) => (
                      <input
                        {...field}
                        placeholder="Enter your admission number"
                        style={S.input}
                        onFocus={onFocus}
                        onBlur={(e) => { handleBlur(e); onBlurStyle(e); }}
                      />
                    )}
                  </Field>
                  {touched.admission_number && errors.admission_number && (
                    <span style={S.error}>{errors.admission_number}</span>
                  )}
                </div>

                {/* Password + eye toggle */}
                <div>
                  <label style={S.label}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Field name="password">
                      {({ field }) => (
                        <input
                          {...field}
                          type={showPass ? 'text' : 'password'}
                          placeholder="Enter your password"
                          style={{ ...S.input, paddingRight: '40px' }}
                          onFocus={onFocus}
                          onBlur={(e) => { handleBlur(e); onBlurStyle(e); }}
                        />
                      )}
                    </Field>

                    <button type="button" onClick={() => setShowPass((p) => !p)} style={S.eyeBtn}>
                      {showPass
                        ? <FaRegEyeSlash size={18} color="#6b7280" />
                        : <FaRegEye     size={18} color="#6b7280" />
                      }
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <span style={S.error}>{errors.password}</span>
                  )}
                </div>

                {/* Sign In */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{ ...S.btnPrimary, opacity: loading ? 0.65 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>

                {/* or */}
                <div style={S.dividerRow}>
                  <div style={S.dividerLine} />
                  <span style={S.dividerText}>or</span>
                  <div style={S.dividerLine} />
                </div>

                {/* Login as Admin */}
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  disabled={loading}
                  style={{ ...S.btnOutline, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  Login as Admin
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* ─── RIGHT PANEL ─── */}
        <div style={{
          width:     isMobile ? '100%' : isTablet ? '260px' : '340px',
          minWidth:  isMobile ? 'unset' : isTablet ? '260px' : '340px',
          height:    isMobile ? '200px' : 'unset',
          minHeight: isMobile ? 'unset' : '480px',
          position:  'relative',
          overflow:  'hidden',
          flexShrink: 0,
        }}>
          <img
            src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"
            alt="Classroom"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Gradient overlay */}
          <div style={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.02) 25%, rgba(0,0,0,0.62) 100%)',
          }} />

          {/* Bottom info */}
          <div style={{
            position:   'absolute',
            bottom:     0, left: 0, right: 0,
            padding:    isMobile ? '16px 20px 20px' : '32px 24px 36px',
            textAlign:  'center',
            color:      '#fff',
          }}>
            <h2 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: 700, margin: '0 0 6px' }}>School ERP</h2>
            {!isMobile && (
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', margin: '0 0 14px', lineHeight: 1.5, maxWidth: '220px', marginLeft: 'auto', marginRight: 'auto' }}>
                Access your timetable, attendance, homework, and results.
              </p>
            )}
            <span style={{
              display:      'inline-block',
              border:       '1.5px solid rgba(255,255,255,0.85)',
              borderRadius: '999px',
              padding:      '5px 18px',
              fontSize:     '12px',
              fontWeight:   600,
              color:        '#fff',
            }}>
              Student Portal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Styles ── */
const S = {
  label: {
    display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px',
  },
  input: {
    width: '100%', boxSizing: 'border-box', padding: '11px 14px', fontSize: '14px',
    color: '#111827', background: '#fafafa', border: '1.5px solid #d1d5db',
    borderRadius: '10px', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  error: {
    display: 'block', fontSize: '12px', color: '#ef4444', marginTop: '5px',
  },
  eyeBtn: {
    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
    display: 'flex', alignItems: 'center',
  },
  btnPrimary: {
    width: '100%', padding: '12px 0', fontSize: '14px', fontWeight: 600, color: '#fff',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none',
    borderRadius: '10px', cursor: 'pointer', marginTop: '2px',
  },
  btnOutline: {
    width: '100%', padding: '11px 0', fontSize: '13px', fontWeight: 600, color: '#374151',
    background: '#fff', border: '1.5px solid #d1d5db', borderRadius: '10px', cursor: 'pointer',
  },
  dividerRow:  { display: 'flex', alignItems: 'center', gap: '10px', margin: '2px 0' },
  dividerLine: { flex: 1, height: '1px', background: '#e5e7eb' },
  dividerText: { fontSize: '12px', color: '#9ca3af', fontWeight: 500 },
};

export default SignIn;
