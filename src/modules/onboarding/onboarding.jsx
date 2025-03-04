import { useNavigate } from 'react-router-dom';
import images from '../../constants/Images';

const Onboarding = () => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  const handleParentLogin = () => {
    navigate('/parent');
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-content">
        <div className="left-section">
          <h1 className="title">Welcome to the School ERP</h1>

          <div className="button-container">
            <button className="onboarding-button admin" onClick={handleAdminLogin}>
              Login as Admin
            </button>
            <button className="onboarding-button parent" onClick={handleParentLogin}>
              Login as Parent
            </button>
          </div>
        </div>

        <div className="right-section">
          <img
            src={images.onboardGirl} // Replace with your image URL
            alt="Onboarding Image"
            className="onboarding-image"
          />
        </div>
      </div>

      <style jsx>{`
        /* Adding Google Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600&family=Roboto:wght@400&display=swap');

        .onboarding-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #1c2534; /* Dark background */
        }

        .onboarding-content {
          display: flex;
          justify-content: space-between;
          width: 90%;
          max-width: 1200px;
          border-radius: 10px;
          overflow: hidden;
        }

        .left-section {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 40px 50px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          width: 50%;
          background-color: #ffffff; /* White background for text section */
        }

        .right-section {
          width: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #ffffff; /* White background for image section */
        }

        .onboarding-image {
          max-width: 90%;
          height: auto;
          border-radius: 10px;
        }

        .title {
          font-size: 3rem;
          font-weight: 700;
          color: #2e3b4e; /* Dark, muted color for the title */
          margin-bottom: 20px;
          font-family: 'Poppins', sans-serif;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
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
          font-family: 'Roboto', sans-serif; /* Different font for button text */
          letter-spacing: 1px; /* Slight letter spacing for button text */
        }

        .onboarding-button.admin {
          background-color: white;
          color: #1c2534;
          border-width: 1px;
          border-color: #1c2534;
          border-style: solid;
        }

        /* Hover effect for Admin button: darker shade of normal color */
        .onboarding-button.admin:hover {
          color: #1c2534; /* Dark text color */
          transform: scale(1.05); /* Hover effect: slight scaling */
        }

        .onboarding-button.parent {
          background-color: #1c2534;
          border-width: 2px;
          border-color: #1c2534;
          border-style: solid;
          color: white;
          width: 300px;
        }

        /* Hover effect for Parent button: lighter shade of normal color */
        .onboarding-button.parent:hover {
          transform: scale(1.05); 
        }

        .onboarding-button:hover {
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .onboarding-content {
            flex-direction: column;
            text-align: center;
          }

          .left-section,
          .right-section {
            width: 100%;
          }

          .onboarding-image {
            max-width: 80%;
            margin-top: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
