import React from 'react'

function StudentReceiptPage({ student, school, setAdmissionReceptPage }) {
    return (
        <div className="admission-receipt">
            <div className="flex gap-4 justify-center header-to-hide">
                <button
                    onClick={() => {
                        setAdmissionReceptPage(false);
                    }}
                    className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Back
                </button>
                <button
                    className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                    onClick={() => {
                        setTimeout(() => {
                            window.print();
                        }, 100);
                    }}
                >
                    Print
                </button>
            </div>

            <div className="school-info">
                <img
                    src={school?.logo}
                    alt="School Logo"
                    className="school-logo-adm-res"
                />
                <div style={{ textAlign: 'center' }}>
                    <h1 className="school-name-adm-res">{school?.name}</h1>
                    <div className="school-address">
                        <p>{school?.address}</p>
                    </div>
                </div>
                <img
                    src={school?.logo}
                    alt="School QR"
                    className="school-logo-adm-res"
                />
            </div>

            <hr className="divider" />
            {/* Student Details */}
            <div className="student-details">
                <table>
                    <tbody>
                        <tr>
                            <td><strong>Admission Number:</strong></td>
                            <td>{student.admission_Number}</td>
                            <td rowSpan="7" style={{}}>
                                {student.student_Photo && (
                                    <img
                                        style={{ width: 200, height: 200, objectFit: 'cover', alignSelf: 'center' }}
                                        src={student.student_Photo}
                                        alt="Student"
                                    />
                                )}
                            </td>
                        </tr>
                        <tr><td><strong>Roll Number:</strong></td><td>{student.roll_Number}</td></tr>
                        <tr><td><strong>Name:</strong></td><td>{student.first_Name} {student.last_Name}</td></tr>
                        <tr><td><strong>Date of Birth:</strong></td><td>{student?.date_Of_Birth}</td></tr>
                        <tr><td><strong>Contact Number:</strong></td><td>{student.contact_Number}</td></tr>
                    </tbody>
                </table>
            </div>

            {/* Academic Details */}
            <div className="academic-details">
                <h3>Academic Details</h3>
                <table>
                    <tbody>
                        <tr><td><strong>Class:</strong></td><td>{student?.class_Id?.name}</td></tr>
                        <tr><td><strong>Section:</strong></td><td>{student.section}</td></tr>
                    </tbody>
                </table>
            </div>

            {/* Additional Details */}
            <div className="additional-details">
                <h3>Additional Details</h3>
                <table>
                    <tbody>
                        <tr><td><strong>Permanent Address:</strong></td><td>{student.permanent_Address}</td></tr>
                        <tr><td><strong>Email:</strong></td><td>{student.email}</td></tr>
                        <tr><td><strong>Category:</strong></td><td>{student.category}</td></tr>
                        <tr><td><strong>Blood Group:</strong></td><td>{student.blood_Group}</td></tr>
                        <tr><td><strong>Father's Name:</strong></td><td>{student.father_Name}</td></tr>
                        <tr><td><strong>Mother's Name:</strong></td><td>{student.mother_Name}</td></tr>
                        <tr><td><strong>Aadhar Number:</strong></td><td>{student.aadhar_number}</td></tr>
                        <tr><td><strong>Due Amount:</strong></td><td>{student.due_amount}</td></tr>
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
    )
}

export default StudentReceiptPage