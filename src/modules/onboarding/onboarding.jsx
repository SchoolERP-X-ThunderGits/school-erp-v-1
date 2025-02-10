import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate('/admin');
  };

  const handleParentLogin = () => {
    navigate('/parent');
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-content">
        <h1 className="title">Welcome to the Dashboard</h1>
        <p className="subtitle">Please select your login type:</p>
        
        <div className="button-container">
          <button className="onboarding-button admin" onClick={handleAdminLogin}>
            Login as Admin
          </button>
          <button className="onboarding-button parent" onClick={handleParentLogin}>
            Login as Parent
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .onboarding-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f4f7fc;
        }

        .onboarding-content {
          text-align: center;
          background-color: #ffffff;
          padding: 40px 50px;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          width: 90%;
          max-width: 400px;
        }

        .title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3e50;
          margin-bottom: 20px;
        }

        .subtitle {
          font-size: 1.1rem;
          color: #6c7a89;
          margin-bottom: 40px;
        }

        .button-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .onboarding-button {
          padding: 12px 20px;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .onboarding-button.admin {
          background-color: #007bff;
          color: white;
        }

        .onboarding-button.parent {
          background-color: #28a745;
          color: white;
        }

        .onboarding-button:hover {
          opacity: 0.9;
        }

        .onboarding-button.admin:hover {
          background-color: #0056b3;
        }

        .onboarding-button.parent:hover {
          background-color: #218838;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
