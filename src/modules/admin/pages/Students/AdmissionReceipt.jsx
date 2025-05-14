import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getService } from "../../../../constants/Service";
import { useUserContext } from "../../../../context/UserContext";
import { pdf, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { BASE_URL } from '../../../../constants/Config';
import apiName from "../../../../constants/ApiName";
import moment from "moment";

const AdmissionReceipt = ({ studentData, setRegistrationCompleted, resetForm }) => {
  const [className, setClassName] = useState("");
  const [formattedDateOfBirth, setFormattedDateOfBirth] = useState("");
  const { school } = useUserContext();
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
    // Format date of birth
    const dateOfBirth = new Date(studentData.date_Of_Birth);
    const formattedDateOfBirth = `${dateOfBirth.getDate()}-${dateOfBirth.getMonth() + 1}-${dateOfBirth.getFullYear()}`;
    setFormattedDateOfBirth(formattedDateOfBirth);
  }, [studentData.class_Id, studentData.date_Of_Admission, studentData.date_Of_Birth]);

  const handlePrint = (e) => {
    e.preventDefault()
    generateFeeReceipt()
    // setTimeout(() => {
    //     window.print();
    // }, 100);
  };
  const generateFeeReceipt = async (forDownload) => {
    const blob = await pdf(
      <Document>
        <Page size="A4" style={styles.page} key={studentData._id}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Image source={school?.logo} style={styles.logo} />
              <View style={{ justifyContent: 'center', alignItems: 'center', width: '80%' }}>
                <Text style={styles.schoolName}>{school?.name?.toUpperCase()}</Text>
                <Text style={styles.location}>{school?.address}</Text>
              </View>
              <Image source={school?.qrCodeUrl} style={styles.logo} />
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.rowContainer}>
                <View style={styles.leftColumn}>
                  <Text style={[styles.label, { borderTopWidth: 0.5, borderTopColor: 'gray' }]}>Admission Number:</Text>
                  <Text style={styles.label}>Roll Number:</Text>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.label}>Date of Birth:</Text>
                  <Text style={styles.label}>Contact Number:</Text>
                </View>
                <View style={styles.leftColumn}>
                  <Text style={[styles.value, { borderTopWidth: 0.5, borderTopColor: 'gray' }]}>
                    {studentData?.admission_Number}
                  </Text>
                  <Text style={styles.value}>{studentData?.roll_Number}</Text>
                  <Text style={styles.value}>{studentData?.first_Name} {studentData?.last_Name}</Text>
                  <Text style={styles.value}>{moment(studentData?.date_Of_Birth).format('DD-MM-YYYY')}</Text>
                  <Text style={styles.value}>{studentData?.contact_Number}</Text>
                </View>
                <Image source={studentData?.student_Photo} style={styles.profileImage} />
              </View>
            </View>

            <Text style={[styles.sectionTitle]}>Academic Details</Text>
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.7, borderLeftWidth: 0.7, borderBottomWidth: 0.7, borderColor: 'gray' }]}>
              <View style={{ width: '50%' }}>
                <Text style={[styles.label, { borderTopWidth: 0 }]}>Class:</Text>
                <Text style={styles.label}>Section:</Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={[styles.value, { borderTopWidth: 0 }]}>{className}</Text>
                <Text style={styles.value}>{studentData?.section}</Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { marginVertical: 20 }]}>Additional Details</Text>
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.7, borderLeftWidth: 0.7, borderBottomWidth: 0.7, borderColor: 'gray' }]}>
              <View style={{ width: '50%' }}>
                <Text style={[styles.label, { borderTopWidth: 0, height: studentData?.permanent_Address?.length > 40 ? 50 : 35 }]}>Permanent Address:</Text>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.label}>Category:</Text>
                <Text style={styles.label}>Blood Group:</Text>
                <Text style={styles.label}>Father's Name:</Text>
                <Text style={styles.label}>Mother's Name:</Text>
                <Text style={styles.label}>Aadhar Number:</Text>
                <Text style={styles.label}>Due Amount:</Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={[styles.value, { borderTopWidth: 0, height: studentData?.permanent_Address?.length > 40 ? 50 : 35 }]}>
                  {studentData?.permanent_Address}
                </Text>
                <Text style={styles.value}>{studentData?.email?studentData?.email:'N/A'}</Text>
                <Text style={styles.value}>{studentData?.category?studentData?.category:'N/A'}</Text>
                <Text style={styles.value}>{studentData?.blood_Group?studentData?.blood_Group:'N/A'}</Text>
                <Text style={styles.value}>{studentData?.father_Name}</Text>
                <Text style={styles.value}>{studentData?.mother_Name}</Text>
                <Text style={styles.value}>{studentData?.aadhar_number}</Text>
                <Text style={styles.value}>{studentData?.due_amount?studentData?.due_amount:'N/A'}</Text>
              </View>
            </View>

            <View style={styles.signatureContainer}>
              <Text style={styles.signatureText}>Parent Signature</Text>
              <Text style={styles.signatureText}>Admission Incharge Signature</Text>
            </View>
          </View>
        </Page>
      </Document>
    ).toBlob();
    saveAs(blob, `Admission_Receipt_${moment().format('YYYYMMDD')}.pdf`);
    generateUrl(blob, forDownload)
  };
  const generateUrl = async (blob, forDownload) => {
    console.log('Uploading Blob', blob);
    // Prepare FormData to send the blob to the server
    const formData = new FormData();
    formData.append('file', blob, 'fee-receipt.pdf');  // 'file' matches the multer field name

    try {
      // Post the FormData to the server's /upload-pdf endpoint
      const response = await fetch(`${BASE_URL}${apiName.uploadCard}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload PDF');
      }
      const responseData = await response.json();
      console.log('Uploaded successfully:', responseData?.pdfUrl);
      if (forDownload) {

        window.ReactNativeWebView.postMessage(responseData.pdfUrl);
      } else {

        window.ReactNativeWebView.postMessage(`PRINT${responseData.pdfUrl}`);
      }
    } catch (error) {
      window.ReactNativeWebView.postMessage(studentData?.student_Photo);
      console.error('Error uploading PDF:', error);
    }
  };

  return (
    <div className="admission-receipt bg-white dark:bg-gray-900 text-black dark:text-white p-6">
      <div className="flex gap-4 justify-center header-to-hide">
        <Link to="/admin/add-student">
          <button
            onClick={() => {
              resetForm()
              setRegistrationCompleted(false);
            }}
            className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Add new Student
          </button>
        </Link>
        <button
          className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={(e) => {
            handlePrint(e)
          }}
        >
          Download Receipt
        </button>
      </div>

      <div className="school-info flex justify-between items-center bg-white p-4 rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
        <img src={school?.logo} alt="School Logo" className="school-logo-adm-res" />
        <div style={{ textAlign: 'center' }}>
          <h1 className="text-2xl text-center font-bold text-[20px] uppercase tracking-wider 
             text-transparent bg-clip-text 
             bg-gradient-to-r from-blue-800 to-blue-400 
             dark:bg-gradient-to-r dark:from-indigo-200 dark:to-blue-400">{school?.name}</h1>
          <div className="school-address text-sm text-gray-400">{school?.address}</div>
        </div>
        <img src={school?.qrCodeUrl} alt="School QR" className="school-logo-adm-res" />
      </div>

      {/* Student Details */}
      <div className="student-details mt-4">
        <table className="w-full">
          <tbody>
            <tr>
              <td><strong>Admission Number:</strong></td>
              <td>{studentData.admission_Number}</td>
              <td rowSpan="7" className="text-center">
                {studentData.student_Photo && (
                  <img
                    className="w-48 h-48 object-cover mx-auto"
                    src={studentData.student_Photo}
                    alt="Student"
                  />
                )}
              </td>
            </tr>
            <tr><td><strong>Roll Number:</strong></td><td>{studentData.roll_Number}</td></tr>
            <tr><td><strong>Name:</strong></td><td>{studentData.first_Name} {studentData.last_Name}</td></tr>
            <tr><td><strong>Date of Birth:</strong></td><td>{moment(studentData?.date_Of_Birth).format('DD-MM-YYYY')}</td></tr>
            <tr><td><strong>Contact Number:</strong></td><td>{studentData.contact_Number}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Academic Details */}
      <div className="academic-details">
        <h3 className="font-semibold text-xl text-gray-800 dark:text-black">Academic Details</h3>
        <table className="w-full">
          <tbody>
            <tr><td><strong>Class:</strong></td><td>{className}</td></tr>
            <tr><td><strong>Section:</strong></td><td>{studentData.section}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Additional Details */}
      <div className="additional-details">
        <h3 className="font-semibold text-xl text-gray-800 dark:text-white">Additional Details</h3>
        <table className="w-full">
          <tbody>
            <tr><td><strong>Permanent Address:</strong></td><td>{studentData.permanent_Address}</td></tr>
            <tr><td><strong>Email:</strong></td><td>{studentData.email}</td></tr>
            <tr><td><strong>Category:</strong></td><td>{studentData.category}</td></tr>
            <tr><td><strong>Blood Group:</strong></td><td>{studentData.blood_Group}</td></tr>
            <tr><td><strong>Father's Name:</strong></td><td>{studentData.father_Name}</td></tr>
            <tr><td><strong>Mother's Name:</strong></td><td>{studentData.mother_Name}</td></tr>
            <tr><td><strong>Aadhar Number:</strong></td><td>{studentData.aadhar_number}</td></tr>
            <tr><td><strong>Due Amount:</strong></td><td>{studentData.due_amount}</td></tr>
          </tbody>
        </table>
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
      </div>

      {/* CSS Styles */}
      <style jsx>{`
  .admission-receipt {
    font-family: 'Inter', Arial, sans-serif;
    padding: 20px;
  }

  .header-to-hide {
    margin-bottom: 20px;
  }

  .school-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border: 1px solid #ddd;
  }

  .school-logo-adm-res {
    width: 90px;
    height: auto;
  }

  .school-name-adm-res {
    font-size: 26px;
    font-weight: 700;
    color: #000;
  }

  .school-address {
    font-size: 14px;
    margin-top: 5px;
  }

  .divider {
    margin: 20px 0;
    border-top: 1px solid #ccc;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    // border-radius: 8px;
    overflow: hidden;
    
  }

  td {
    padding: 12px 10px;
    border: 1px solid #ccc;
    font-size: 14px;
  }

  h3 {
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 16px;
    border-radius: 4px 4px 0 0;
  }

  .signatures {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    padding: 0 10px;
  }

  .signature {
    text-align: center;
    width: 45%;
  }

  .signature p {
    border-top: 1px solid #000;
    margin-top: 40px;
    padding-top: 10px;
  }

  /* Print Styles */
  @media screen and (max-width: 768px) {
    .admission-receipt {
      // background-color: white;
      // color: #000;
      font-size: 12pt;
      padding: 0;
    }

    .divider {
      display: none;
    }

    table {
      page-break-inside: avoid;
    }

    .signature p {
      font-size: 12pt;
    }
  }
`}</style>
    </div>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#ffffff",
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    objectFit: "contain",
  },
  schoolName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  location: {
    marginHorizontal: 10,
    fontSize: 12,
    textAlign: "center",
    color: "#666",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
    // textDecoration: "underline",
  },
  rowContainer: {
    flexDirection: "row",
  },
  leftColumn: {
    flex: 1,
  },
  label: {
    padding: 6,
    borderBottomWidth: 0.5,
    borderLeftWidth: 0.5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRightColor: 'black',
    borderLeftColor: 'black',
    borderColor: "#ccc",
    fontWeight: "bold",
  },
  value: {
    padding: 6,
    borderBottomWidth: 0.5,
    borderRightWidth: 1,
    borderRightColor: 'black',
    borderColor: "#ccc",
  },
  profileImage: {
    width: 120,
    height: 120,
    margin: 10,
    alignSelf: "center",
    objectFit: "cover",
    borderRadius: 5,
  },
  signatureContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    paddingHorizontal: 10,
  },
  signatureText: {
    fontSize: 12,
    borderTopWidth: 1,
    borderColor: "#000",
    width: "40%",
    textAlign: "center",
    paddingTop: 5,
  },
});

export default AdmissionReceipt;
