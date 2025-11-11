import { pdf, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import React from 'react';
import { BASE_URL } from '../constants/Config';
import apiName from '../constants/ApiName';
import moment from 'moment';

function StudentReceiptPage({ student, school, setAdmissionReceptPage }) {
  const generateStudentReceipt = async () => {
    const blob = await pdf(
      <Document>
        <Page size="A4" style={styles.page} key={student._id}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Image source={school?.logo} style={styles.logo} />
              <View style={{ justifyContent: 'center', alignItems: 'center', width: '80%' }}>
                <Text style={styles.schoolName}>{school?.name?.toUpperCase()}</Text>
                <Text style={styles.location}
                  numberOfLines={0}   // allow unlimited lines
                  ellipsizeMode="tail" // optional; trims if needed
                >{school?.address}</Text>
                <Text style={styles.infoText}>
                  Registration No.: {school?.registrationNumber}
                </Text>

                <View style={styles.row}>
                  <Text style={styles.infoText}>
                    Mob No.: {school?.contactNumber}
                  </Text>
                  <Text style={styles.infoText}>
                    UDISE No.: {school?.udiseNumber}
                  </Text>
                </View>
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
                    {student?.admission_Number}
                  </Text>
                  <Text style={styles.value}>{student?.roll_Number}</Text>
                  <Text style={styles.value}>{student?.first_Name} {student?.last_Name}</Text>
                  <Text style={styles.value}>{moment(student?.date_Of_Birth).format('DD-MM-YYYY')}</Text>
                  <Text style={styles.value}>{student?.contact_Number}</Text>
                </View>
                <Image source={student?.student_Photo} style={styles.profileImage} />
              </View>
            </View>

            <Text style={[styles.sectionTitle]}>Academic Details</Text>
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.7, borderLeftWidth: 0.7, borderBottomWidth: 0.7, borderColor: 'gray' }]}>
              <View style={{ width: '50%' }}>
                <Text style={[styles.label, { borderTopWidth: 0 }]}>Class:</Text>
                <Text style={styles.label}>Section:</Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={[styles.value, { borderTopWidth: 0 }]}>{student?.class_Id?.name}</Text>
                <Text style={styles.value}>{student?.section}</Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { marginVertical: 20 }]}>Additional Details</Text>
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.7, borderLeftWidth: 0.7, borderBottomWidth: 0.7, borderColor: 'gray' }]}>
              <View style={{ width: '50%' }}>
                <Text style={[styles.label, { borderTopWidth: 0, height: student?.permanent_Address?.length > 40 ? 50 : 35 }]}>Permanent Address:</Text>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.label}>Category:</Text>
                <Text style={styles.label}>Blood Group:</Text>
                <Text style={styles.label}>Father's Name:</Text>
                <Text style={styles.label}>Mother's Name:</Text>
                <Text style={styles.label}>Aadhar Number:</Text>
                <Text style={styles.label}>Due Amount:</Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={[styles.value, { borderTopWidth: 0, height: student?.permanent_Address?.length > 40 ? 50 : 35 }]}>
                  {student?.permanent_Address}
                </Text>
                <Text style={styles.value}>{student?.email}</Text>
                <Text style={styles.value}>{student?.category}</Text>
                <Text style={styles.value}>{student?.blood_Group}</Text>
                <Text style={styles.value}>{student?.father_Name}</Text>
                <Text style={styles.value}>{student?.mother_Name}</Text>
                <Text style={styles.value}>{student?.aadhar_number}</Text>
                <Text style={styles.value}>{student?.due_amount}</Text>
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
    generateUrl(blob);
  };

  const generateUrl = async (blob) => {
    console.log('Uploading Blob', blob);

    // Prepare FormData to send the blob to the server
    const formData = new FormData();
    formData.append('file', blob, 'student-receipt.pdf');  // 'file' matches the multer field name

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
      window.ReactNativeWebView.postMessage(`PRINT${responseData.pdfUrl}`);
    } catch (error) {
      console.error('Error uploading PDF:', error);
    }
  };

  const handlePrint = () => {
    generateStudentReceipt();
  };

  return (
    <div className="admission-receipt bg-white dark:bg-gray-900 text-black dark:text-white p-6">
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
          onClick={handlePrint}
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
          <div className="school-address text-sm text-gray-400">Registration No.: {school?.registrationNumber}</div>
          <div className='flex gap-3'>
            <div className="school-address text-sm text-gray-400">Mob No.: {school?.contactNumber}</div>

            <div className="school-address text-sm text-gray-400">UDISE No.: {school?.udiseNumber}</div>
          </div>
        </div>
        <img src={school?.qrCodeUrl} alt="School QR" className="school-logo-adm-res" />
      </div>

      {/* Student Details */}
      <div className="student-details mt-4">
        <table className="w-full">
          <tbody>
            <tr>
              <td><strong>Admission Number:</strong></td>
              <td>{student.admission_Number}</td>
              <td rowSpan="7" className="text-center">
                {student.student_Photo && (
                  <img
                    className="w-48 h-48 object-cover mx-auto"
                    src={student.student_Photo}
                    alt="Student"
                  />
                )}
              </td>
            </tr>
            <tr><td><strong>Roll Number:</strong></td><td>{student.roll_Number}</td></tr>
            <tr><td><strong>Name:</strong></td><td>{student.first_Name} {student.last_Name}</td></tr>
            <tr><td><strong>Date of Birth:</strong></td><td>{moment(student?.date_Of_Birth).format('DD-MM-YYYY')}</td></tr>
            <tr><td><strong>Contact Number:</strong></td><td>{student.contact_Number}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Academic Details */}
      <div className="academic-details">
        <h3 className="font-semibold text-xl text-gray-800 dark:text-black">Academic Details</h3>
        <table className="w-full">
          <tbody>
            <tr><td><strong>Class:</strong></td><td>{student.class_Id?.name}</td></tr>
            <tr><td><strong>Section:</strong></td><td>{student.section}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Additional Details */}
      <div className="additional-details">
        <h3 className="font-semibold text-xl text-gray-800 dark:text-white">Additional Details</h3>
        <table className="w-full">
          <tbody>
            <tr><td><strong>Permanent Address:</strong></td><td>{student.permanent_Address ? student.permanent_Address : 'N/A'}</td></tr>
            <tr><td><strong>Email:</strong></td><td>{student.email ? student.email : 'N/A'}</td></tr>
            <tr><td><strong>Category:</strong></td><td>{student.category ? student.category : 'N/A'}</td></tr>
            <tr><td><strong>Blood Group:</strong></td><td>{student.blood_Group ? student.blood_Group : 'N/A'}</td></tr>
            <tr><td><strong>Father's Name:</strong></td><td>{student.father_Name}</td></tr>
            <tr><td><strong>Mother's Name:</strong></td><td>{student.mother_Name}</td></tr>
            <tr><td><strong>Aadhar Number:</strong></td><td>{student.aadhar_number}</td></tr>
            <tr><td><strong>Due Amount:</strong></td><td>{student.due_amount ? student.due_amount : 'N/A'}</td></tr>
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
  @media print {
    .header-to-hide {
      display: none;
    }

    .admission-receipt {
      background-color: white;
      color: #000;
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
}

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
    textAlign: 'center',
    color: '#666',
    marginTop: 4,
    width: '88%',
    alignSelf: 'center',
    lineHeight: 1.4,
    whiteSpace: 'normal',
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
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    marginTop: 4,
    fontSize: 10,
    color: '#666', // Tailwind text-gray-400 equivalent
  },
});

export default StudentReceiptPage;
