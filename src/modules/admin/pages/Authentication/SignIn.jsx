import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiName from '../../../../constants/ApiName';
import { postService } from '../../../../constants/Service';
import { showToast } from '../../../../components/Toast';

const SignIn = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      showToast('All fields are required', 'error');
      return;
    }
  
    const body = {
      username: username,
      password: password,
      role: "admin"
    };
  
    try {
      const response = await postService(apiName.adminLogin, body);
      console.log('response:', response);  // Ensure the response has the token
  
      if (response.token) {
        sessionStorage.setItem("token", response.token); // Save token to sessionStorage
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
    <div className="sign-in-container">
      <div className="sign-in-form">
        <h2 className="sign-in-title">Admin Sign In</h2>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />

        <button className="sign-in-button" onClick={handleLogin}>
          Sign In
        </button>

        <p className="footer-text">
          {/* Don't have an account? <a href="/signup">Sign Up</a> */}
        </p>
      </div>

      <style jsx>{`
        .sign-in-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f4f7fc;
        }

        .sign-in-form {
          background-color: #ffffff;
          padding: 40px 50px;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          width: 90%;
          max-width: 400px;
        }

        .sign-in-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2d3e50;
          margin-bottom: 20px;
        }

        .input-field {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
        }

        .sign-in-button {
          width: 100%;
          padding: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .sign-in-button:hover {
          background-color: #0056b3;
        }

        .error-message {
          color: #e74c3c;
          margin-bottom: 15px;
        }

        .footer-text {
          text-align: center;
          margin-top: 20px;
        }

        .footer-text a {
          color: #007bff;
          text-decoration: none;
        }

        .footer-text a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default SignIn;
