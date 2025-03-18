import { pdf, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import React from 'react'
import { BASE_URL } from '../constants/Config';
import apiName from '../constants/ApiName';

function StudentReceiptPage({ student, school, setAdmissionReceptPage }) {

  const generateStudentReceipt = async () => {
    const blob = await pdf(
      <Document>
        <Page size="A4" style={styles.page} key={student._id}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Image source={school?.logo} style={styles.logo} />

              <View style={{ justifyContent: 'center', alignItems: 'center', width: '80%' }}>
                <Text style={styles.schoolName}>{school?.name}</Text>
                <Text style={styles.location}>{school?.address}</Text>
              </View>

              <Image source={school?.logo} style={styles.logo} />
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.rowContainer}>
                <View style={styles.leftColumn}>
                  <Text style={[styles.label, { borderTopWidth: 0 }]}>Admission Number:</Text>
                  <Text style={styles.label}>Roll Number:</Text>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.label}>Date of Birth:</Text>
                  <Text style={styles.label}>Contact Number:</Text>
                </View>
                <View style={styles.leftColumn}>
                  <Text style={[styles.value, { borderTopWidth: 0, }]}>{student?.admission_Number}</Text>
                  <Text style={styles.value}>{student?.roll_Number}</Text>
                  <Text style={styles.value}>{student?.first_Name} {student?.last_Name}</Text>
                  <Text style={styles.value}>{student?.date_Of_Birth}</Text>
                  <Text style={styles.value}>{student?.contact_Number}</Text>
                </View>
                <Image source={{ uri: student.student_Photo }} style={styles.profileImage} />
              </View>
            </View>

            <Text style={[styles.sectionTitle, { marginVertical: 20 }]}>Academic Details</Text>
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.7, borderLeftWidth: 0.7, borderBottomWidth: 0.7 }]}>

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
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.7, borderLeftWidth: 0.7, borderBottomWidth: 0.7 }]}>

              <View style={{ width: '50%' }}>
                <Text style={[styles.label, { borderTopWidth: 0 }]}>Permanent Address:</Text>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.label}>Category:</Text>
                <Text style={styles.label}>Blood Group:</Text>
                <Text style={styles.label}>Father's Name:</Text>
                <Text style={styles.label}>Mother's Name:</Text>
                <Text style={styles.label}>Aadhar Number:</Text>
                <Text style={styles.label}>Due Amount:</Text>
              </View>

              <View style={{ width: '50%' }}>
                <Text style={[styles.value, { borderTopWidth: 0 }]}>{student?.permanent_Address}</Text>
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
    // saveAs(blob, `Student_ID_Cards_${moment().format('YYYYMMDD')}.pdf`);
    generateUrl(blob)
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
    generateStudentReceipt()
    setTimeout(() => {
      window.print();
    }, 100);
  };


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
          onClick={handlePrint}
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  headerContainer: { marginBottom: 20, flexDirection: 'row', textAlign: 'center', borderBottomWidth: 0.7 },
  logo: { width: 80, height: 80, resizeMode: "contain" },
  schoolName: { fontSize: 18, fontWeight: "bold", color: "#000", textAlign: 'center' },
  location: { fontSize: 14, color: "gray", textAlign: 'center', marginTop: 5 },
  sectionContainer: { backgroundColor: "#fff", },
  sectionTitle: { fontSize: 15, fontFamily: 'RobotoB', fontWeight: "bold", marginBottom: 10, marginTop: 10 },
  rowContainer: { flexDirection: "row", borderWidth: 0.7 },
  leftColumn: { flex: 1 },
  label: { fontSize: 14, color: "#333", borderTopWidth: 0.5, borderRightWidth: 0.5, fontFamily: 'RobotoB', height: 35, padding: 8 },
  value: { fontSize: 14, borderTopWidth: 0.7, borderRightWidth: 0.7, height: 35, padding: 8 },
  profileImage: { width: 150, height: 150, padding: 10, alignSelf: 'center' },
  signatureContainer: { flexDirection: "row", justifyContent: 'space-evenly', marginTop: 30 },
  signatureText: { fontSize: 14, fontWeight: "bold", color: "#555" }
});

export default StudentReceiptPage