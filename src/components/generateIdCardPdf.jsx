// utils/generateIdCardPdf.js

import { pdf, Document, Page, Text, View, Image,StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';
import { useUserContext } from '../context/UserContext';
import images from '../constants/Images';

export const generateMultipleIdCardPdf = async ({ student,school, selectedTemplate = 'visionSchool', generateUrl }) => {
    const blob = await pdf(
        <Document>
          {
            selectedTemplate == 'visionSchool' ?
              <Page
                size={'A6'}
                orientation={'portrait'}
                style={styles.portraitPage}
              >
                <View style={[{ position: 'absolute', zIndex: -100, width: '100%', height: '100%' }]}>
                  <Image style={{ width: '100%', height: '100%' }} src={images.VisionSchool} />
                </View>
                <View style={[{ position: 'absolute', zIndex: -101, width: '100%', height: '100%' }]}>
                  {/* Header */}
                  <View style={{ marginTop: 5 }}>
                    <View style={{ flexDirection: 'row', marginHorizontal: 10, alignItems: 'center' }}>
                      <View style={{ backgroundColor: 'white', borderRadius: 50, padding: 5 }}>
  
                        <Image style={{ width: 50, height: 50, objectFit: 'cover' }} src={school?.logo} />
                      </View>
                      <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
  
                        <Text style={{ fontSize: 45, color: 'white', fontFamily: 'ImpactB', letterSpacing: 2 }}>VISION</Text>
                        <Text style={{ fontSize: 20, color: 'white', fontFamily: 'RobotoB', fontWeight: 'bold' }}>PUBLIC SCHOOL</Text>
                      </View>
                    </View>
                    <Text style={{ marginTop: 5, fontSize: 18, fontFamily: 'RobotoB', fontWeight: '500', textAlign: 'center', color: '#fbf308' }}>{school?.address?.toUpperCase()}</Text>
                  </View>
                  <View style={styles.body}>
                    <View style={{}}>
                      <Image
                        src={student.student_Photo || '/default-photo.jpg'}
                        style={{ width: 80, height: 80, objectFit: 'cover', alignSelf: 'center', borderWidth: 1, borderColor: 'gray', borderRadius: 2 }}
                      />
                      <Text style={{ textAlign: 'center', fontFamily: 'RobotoB', marginTop: 10, fontSize: 18 }}>{student.first_Name} {student.last_Name}</Text>
                      <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', }}>
                          <Text style={{ fontFamily: 'RobotoB', fontSize: 13, width: '23%' }}>F_Name</Text>
                          <Text style={{ fontFamily: 'RobotoB', fontSize: 13, width: '4%' }}>:</Text>
                          <Text style={{ fontFamily: 'RobotoR', fontSize: 13, width: '70%' }}>{student.father_Name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
                          <View style={{ width: '45%', flexDirection: 'row', }}>
                            <Text style={{ fontFamily: 'RobotoB', fontSize: 13, width: '50%' }}>Roll No</Text>
                            <Text style={{ fontFamily: 'RobotoB', fontSize: 13, width: '10%' }}>:</Text>
                            <Text style={{ fontFamily: 'RobotoR', fontSize: 13, width: '40%' }}>{student.roll_Number}</Text>
                          </View>
                          <View style={{ width: '50%', flexDirection: 'row', }}>
                            <Text style={{ fontFamily: 'RobotoB', fontSize: 13, width: '40%' }}>DOB</Text>
                            <Text style={{ fontFamily: 'RobotoB', fontSize: 13, width: '10%' }}>:</Text>
                            <Text style={{ fontFamily: 'RobotoR', fontSize: 13, width: '60%' }}>{moment(student?.date_Of_Birth).format('DD-MM-YYYY') || 'Not Available'}</Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <View style={{ width: '45%', flexDirection: 'row', }}>
                            <Text style={{ fontFamily: 'RobotoB', fontSize: 13, width: '50%' }}>Class</Text>
                            <Text style={{ fontFamily: 'RobotoB', fontSize: 13, width: '10%' }}>:</Text>
                            <Text style={{ fontFamily: 'RobotoR', fontSize: 13, width: '40%' }}>{student.class_Id?.name}</Text>
                          </View>
                          <View style={{ width: '50%', flexDirection: 'row', }}>
                            <Text style={{ fontFamily: 'RobotoB', fontSize: 13, width: '40%' }}>Section</Text>
                            <Text style={{ fontFamily: 'RobotoB', fontSize: 13, width: '10%' }}>:</Text>
                            <Text style={{ fontFamily: 'RobotoR', fontSize: 13, width: '60%' }}>{student.section}</Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
                          <View style={{ width: '45%', flexDirection: 'row', }}>
                            <Text style={{ fontFamily: 'RobotoB', fontSize: 13, width: '50%' }}>Transport</Text>
                            <Text style={{ fontFamily: 'RobotoB', fontSize: 13, width: '10%' }}>:</Text>
                            <Text style={{ fontFamily: 'RobotoR', fontSize: 13, width: '40%' }}>Yes</Text>
                          </View>
                          <View style={{ width: '50%', flexDirection: 'row', }}>
                            <Text style={{ fontFamily: 'RobotoB', fontSize: 13, width: '40%' }}>Mobile</Text>
                            <Text style={{ fontFamily: 'RobotoB', fontSize: 13, width: '10%' }}>:</Text>
                            <Text style={{ fontFamily: 'RobotoR', fontSize: 13, width: '60%' }}>{student?.contact_Number}</Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                          <Text style={{ fontFamily: 'RobotoB', fontSize: 13, width: '23%' }}>Session</Text>
                          <Text style={{ fontFamily: 'RobotoB', fontSize: 13, width: '4%' }}>:</Text>
                          <Text style={{ fontFamily: 'RobotoR', fontSize: 13, width: '70%' }}>{student.session || 'Not Available'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                          <Text style={{ fontFamily: 'RobotoB', fontSize: 13, width: '23%' }}>Address</Text>
                          <Text style={{ fontFamily: 'RobotoB', fontSize: 13, width: '4%' }}>:</Text>
                          <Text style={{ fontFamily: 'RobotoR', fontSize: 13, width: '70%' }}>{student.address_for_id || 'Not Available'}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', position: 'absolute', width: '100%', bottom: 10, justifyContent: 'space-between', alignItems: 'center', }}>
                  <Text style={{ fontFamily: 'RobotoB', fontSize: 14, paddingTop: 5, alignSelf: 'center', marginLeft: 10 }}>Off.: {school?.contactNumber}</Text>
                  <View style={{ position: 'relative', top: 5 }}>
                    <Image style={{ width: 25, height: 25, objectFit: 'cover', marginLeft: 5 }} src={school?.directorSignature} />
                    <Text style={{ fontSize: 14, marginTop: 5, color: 'red', fontFamily: 'RobotoB', marginRight: 10 }}>Director</Text>
                  </View>
                </View>
              </Page>
              :
              <Page
                size={selectedTemplate === 'portrait' ? 'A6' : 'A6'}
                orientation={selectedTemplate === 'portrait' ? 'portrait' : 'landscape'}
                key={index}
                style={selectedTemplate === 'portrait' ? styles.portraitPage : styles.landscapePage}
              >
                {console.log('vllvclvc', student)}
                <View style={[{ position: 'absolute', zIndex: -100, width: '100%', height: '100%' }]}>
                  <Image style={{ width: '100%', height: '100%' }} src={'https://i2.wp.com/a.rgbimg.com/users/o/or/organza3/600/msE62kY.jpg'} />
                </View>
                <View style={[{ position: 'absolute', zIndex: -101, width: '100%', height: '100%' }]}>
                  {/* Header */}
                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ width: '20%', marginLeft: 10 }}>
  
                      <Image style={{ width: 50, height: 50, objectFit: 'cover' }} src={school?.logo} />
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '60%' }}>
  
                      <Text style={styles.schoolName}>{school?.name}</Text>
                      <Text style={{ marginTop: 5, fontSize: 12, fontFamily: 'RobotoRI', textAlign: 'center' }}>{school?.address}</Text>
                    </View>
                    <View style={{ width: '20%' }}>
  
                      <Image style={{ width: 50, height: 50, objectFit: 'cover' }} src={school?.qrCodeUrl} />
                    </View>
                  </View>
                  <View style={{ height: 1, backgroundColor: 'black', width: '100%', marginTop: 10 }}></View>
                  <View style={styles.body}>
                    <View style={styles.profileSection}>
                      <Image
                        src={student.student_Photo || '/default-photo.jpg'}
                        style={styles.profileImage}
                      />
                      <View style={styles.detailsSection}>
                        <Text style={styles.studentName}>{student.first_Name} {student.last_Name}</Text>
                        <Text style={styles.studentId}>ID:<Text style={{ fontFamily: 'RobotoR' }}> {student.admission_Number}</Text></Text>
                        <Text style={styles.studentRoll}>Roll No: <Text style={{ fontFamily: 'RobotoR' }}>{student.roll_Number}</Text></Text>
                      </View>
                    </View>
  
                    {/* Class, Section, Address, and DOB */}
                    <View style={selectedTemplate === 'portrait' ? styles.extraInfo : styles.extraInfo2}>
                      <View style={styles.row}>
                        <Text style={styles.label}>Class</Text>
                        <Text style={[styles.label, { width: '10%' }]}>:</Text>
                        <Text style={styles.value}>{student.class_Id?.name}</Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.label}>Section</Text>
                        <Text style={[styles.label, { width: '10%' }]}>:</Text>
                        <Text style={styles.value}>{student.section}</Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.label}>Address</Text>
                        <Text style={[styles.label, { width: '10%' }]}>:</Text>
                        <Text style={styles.value}>{student.address_for_id || 'Not Available'}</Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.label}>DOB</Text>
                        <Text style={[styles.label, { width: '10%' }]}>:</Text>
                        <Text style={styles.value}>{moment(student?.date_Of_Birth).format('DD MMMM, YYYY') || 'Not Available'}</Text>
                      </View>
                    </View>
                  </View>
                  {
                    school?.principalSignature &&
  
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', position: 'relative', bottom: 10, marginTop: selectedTemplate === 'portrait' ? 30 : 0 }}>
  
                      <View>
                        <Image style={{ width: 45, height: 45, objectFit: 'cover', alignSelf: 'center' }} src={school?.principalSignature} />
                        <Text style={{ fontSize: 12, marginTop: 5 }}>Principle Signature</Text>
                      </View>
                      <View>
                        <Image style={{ width: 45, height: 45, objectFit: 'cover', alignSelf: 'center' }} src={school?.directorSignature} />
                        <Text style={{ fontSize: 12, marginTop: 5 }}>Director Signature</Text>
                      </View>
                    </View>
                  }
                </View>
              </Page>
          }
        </Document>
      ).toBlob();
      saveAs(blob, `Student_ID_Cards_${moment().format('YYYYMMDD')}.pdf`);
      generateUrl(blob)
};



const styles = StyleSheet.create({
    card: {
      backgroundColor: '#fff',
      borderRadius: 10,
      border: '1px solid #ccc',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      height: '100%',
      width: '100%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      marginBottom: 10,
    },
    schoolName: {
      textAlign: 'center',
      fontSize: 16,
      fontFamily: 'RobotoBI',
      fontWeight: 'bold',
      color: '#a27d2a',
    },
    body: {
      marginTop: 10,
      display: 'flex',
      flexDirection: 'column',
    },
    profileSection: {
      flexDirection: 'row',
      marginBottom: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileImage: {
      width: 80,
      height: 80,
      objectFit: 'cover',
      borderRadius: 10,
      border: '3px solid #2C3E50',
      marginTop: 10,
      marginRight: 30,
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    },
    detailsSection: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    studentName: {
      fontFamily: 'RobotoB',
      fontSize: 16,
      fontWeight: 'bold',
      color: 'black',
    },
    studentId: {
      marginVertical: 5,
      fontFamily: 'RobotoM',
      fontSize: 14,
      color: 'black',
    },
    studentRoll: {
      fontFamily: 'RobotoM',
      fontSize: 14,
      color: 'black',
    },
    extraInfo: {
      marginLeft: 35,
      marginTop: 10,
      marginBottom: 15,
    },
    extraInfo2: {
      marginLeft: 100,
      marginTop: 10,
      marginBottom: 15,
    },
    row: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    label: {
      width: '30%',
      fontSize: 15,
      fontFamily: 'RobotoM',
      color: 'black',
    },
    value: {
      fontFamily: 'RobotoR',
      width: '50%',
      fontSize: 14,
      color: 'black',
    },
    footer: {
      marginTop: 20,
      textAlign: 'center',
    },
    footer2: {
      position: 'relative',
      bottom: 10,
      marginTop: 10,
      textAlign: 'center',
    },
    footerText: {
      fontSize: 12,
      color: 'black',
    },
  
    portraitPage: {
      width: '100%',
    },
    // Styles for landscape layout
    landscapePage: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  
    landscapeCard: {
      width: '100%',
      height: '100%',
      flexDirection: 'row',
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      border: '1px solid #ccc',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
  });