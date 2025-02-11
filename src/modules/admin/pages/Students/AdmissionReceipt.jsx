import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiName from "../../../../constants/ApiName";
import { getService } from "../../../../constants/Service";

const AdmissionReceipt = ({ studentData, setRegistrationCompleted }) => {
  const [className, setClassName] = useState("");
  const [formattedDateOfAdmission, setFormattedDateOfAdmission] = useState("");
  const [formattedDateOfBirth, setFormattedDateOfBirth] = useState("");

  const fetchClassName = async () => {
    try {
      const result = await getService(`${apiName.getClassById}/${studentData.class_Id}`); // Get Classes API
      setClassName(result.name);
    } catch (error) {
      console.error("Error fetching class data:", error);
    }
  };

  useEffect(() => {
    fetchClassName()
    // Format date of admission
    const dateOfAdmission = new Date(studentData.date_Of_Admission);
    const formattedDate = `${dateOfAdmission.getDate()}-${dateOfAdmission.getMonth() + 1}-${dateOfAdmission.getFullYear()}`;
    setFormattedDateOfAdmission(formattedDate);

    // Format date of birth
    const dateOfBirth = new Date(studentData.date_Of_Birth);
    const formattedDateOfBirth = `${dateOfBirth.getDate()}-${dateOfBirth.getMonth() + 1}-${dateOfBirth.getFullYear()}`;
    setFormattedDateOfBirth(formattedDateOfBirth);
  }, [studentData.class_Id, studentData.date_Of_Admission, studentData.date_Of_Birth]);

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="no-scrollbar admission-receipt">
      <div className="flex gap-4 justify-center header-to-hide">
        <Link to="/admin/add-student" reloadDocument>
          <button
            onClick={() => {
              setRegistrationCompleted(false);
            }}
            className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Add new Student
          </button>
        </Link>
        <button
          className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={handlePrint}
        >
          Print
        </button>
      </div>

      <div className="school-info">
        <img
          src="https://vissionclasses.in/assets/vision-img/logo.jpeg"
          alt="School Logo"
          className="school-logo-adm-res"
        />
        <div className="school-details">
          <h1 className="school-name-adm-res">Vision Public School</h1>
          <div className="school-address">
            <p>Amra Talav, Sasaram ( Rohtas )</p>
          </div>
        </div>
        <img
          src="https://vissionclasses.in/assets/vision-img/logo.jpeg"
          alt="School QR"
          className="school-logo-adm-res"
        />
      </div>

      <hr className="divider" />

      {/* Student Details */}
      <div className="student-details">
        <h3>Student Details</h3>
        <table>
          <tbody>
            <tr>
              <td><strong>Admission Number:</strong></td>
              <td>{studentData.admission_Number}</td>
              <td rowSpan="7" style={{}}>
                {studentData.student_Photo && (
                  <img
                    style={{ width: 200, height: 200, objectFit: 'cover', alignSelf: 'center' }}
                    src={studentData.student_Photo}
                    alt="Student"
                  />
                )}
              </td>
            </tr>
            <tr><td><strong>Roll Number:</strong></td><td>{studentData.roll_Number}</td></tr>
            <tr><td><strong>Name:</strong></td><td>{studentData.first_Name} {studentData.last_Name}</td></tr>
            <tr><td><strong>Date of Birth:</strong></td><td>{formattedDateOfBirth}</td></tr>
            <tr><td><strong>Contact Number:</strong></td><td>{studentData.contact_Number}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Academic Details */}
      <div className="academic-details">
        <h3>Academic Details</h3>
        <table>
          <tbody>
            <tr><td><strong>Class:</strong></td><td>{className}</td></tr>
            <tr><td><strong>Section:</strong></td><td>{studentData.section}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Additional Details */}
      <div className="additional-details">
        <h3>Additional Details</h3>
        <table>
          <tbody>
            <tr><td><strong>Permanent Address:</strong></td><td>{studentData.permanent_Address}</td></tr>
            <tr><td><strong>Email:</strong></td><td>{studentData.email}</td></tr>
            <tr><td><strong>Religion:</strong></td><td>{studentData.religion}</td></tr>
            <tr><td><strong>Category:</strong></td><td>{studentData.category}</td></tr>
            <tr><td><strong>Blood Group:</strong></td><td>{studentData.blood_Group}</td></tr>
            <tr><td><strong>Father's Name:</strong></td><td>{studentData.father_Name}</td></tr>
            <tr><td><strong>Mother's Name:</strong></td><td>{studentData.mother_Name}</td></tr>
            <tr><td><strong>Aadhar Number:</strong></td><td>{studentData.aadhar_number}</td></tr>
            <tr><td><strong>Due Amount:</strong></td><td>{studentData.due_amount}</td></tr>
          </tbody>
        </table>
      </div>

      <div className="sign-section">
        <div className="signatures">
          <div className="signature">
            <p>Parent Signature</p>
          </div>
          <div className="signature">
            <p>Admission Incharge Signature</p>
          </div>
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .admission-receipt {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        .header-to-hide {
          margin-bottom: 10px;
        }
        .school-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .school-logo-adm-res {
          width: 80px;
          height: auto;
        }
        .school-name-adm-res {
          font-size: 24px;
          font-weight: bold;
        }
        .divider {
          margin-top: 20px;
          margin-bottom: 20px;
        }
        .student-details, .academic-details, .additional-details {
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        td {
          padding: 8px;
          border: 1px solid #ddd;
        }
        .sign-section {
          margin-top: 20px;
        }
        .signatures {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
        .signature {
          width: 45%;
          text-align: center;
          padding-top: 10px;
        }
        .signature p {
          margin-top: 10px;
        }

        /* Print Specific Styles */
        @media print {
          .admission-receipt {
            width: 100%;
            margin: 0;
            box-sizing: border-box;
          }

         
          table {
            width: 100%;
            page-break-before: always;
          }

          .school-info, .student-details, .academic-details, .additional-details {
            page-break-inside: avoid;
          }

          .school-logo-adm-res {
            width: 100px;
          }

          /* Adjust font size for print */
          body {
            font-size: 12pt;
          }
        }
      `}</style>
    </div>
  );
};

export default AdmissionReceipt;
