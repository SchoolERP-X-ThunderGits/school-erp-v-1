// utils/generateIdCardPdf.js

import { pdf, Document, Page, Text, View, Image,StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';
import { useUserContext } from '../context/UserContext';
import images from '../constants/Images';

export const GenerateAdmitCardPdf = async ({ student,school,examSchedule, generateUrl }) => {
      const blob = await pdf(
               <Document>
                       <Page size="A4" style={styles.page} key={student._id}>
                           <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'black', paddingBottom: 10 }]}>
                               <View>
                                   <Image style={{ width: 50, height: 50 }} src={school?.logo} />
                               </View>
                               <View style={{ alignItems: 'center', justifyContent: 'center' }}>
   
                                   <Text style={styles.title}>{school?.name}</Text>
                                   <Text style={{ fontFamily: 'RobotoR', fontSize: 14, marginTop: 5 }}>{school?.address}</Text>
                                   <Text style={{ fontFamily: 'RobotoR', fontSize: 14 }}>{examSchedule[0]?.examName?.name}, {examSchedule[0]?.examName?.session}</Text>
                               </View>
                               <View>
                                   <Image style={{ width: 50, height: 50 }} src={school?.logo} />
                               </View>
                           </View>
                           {console.log('studentstudent', student)}
                           <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
                               <View>
   
                                   <Text style={styles.lable}>Roll Number:   <Text style={styles.bold}>{student.roll_Number}</Text></Text>
                                   <Text style={[styles.lable, { marginVertical: 5 }]}>Name:    <Text style={styles.bold}>{student.first_Name} {student?.last_Name}</Text></Text>
                                   <Text style={styles.lable}>Father's Name:    <Text style={styles.bold}>{student?.father_Name}</Text></Text>
                               </View>
                               <View>
   
                                   <Text style={styles.lable}>Admission Number:    <Text style={styles.bold}>{student.admission_Number}</Text></Text>
                                   <Text style={[styles.lable, { marginVertical: 5 }]}>Class:    <Text style={styles.bold}>{student.class_Id?.name}</Text></Text>
                                   <Text style={styles.lable}>D.O.B :    <Text style={styles.bold}>{moment(student.date_Of_Birth).format('DD/MM/YYYY')}</Text></Text>
                               </View>
                           </View>
                           <View style={styles.table}>
                               <View style={styles.tableRow}>
                                   <Text style={styles.tableCell}>Subject</Text>
                                   <Text style={styles.tableCell}>Date</Text>
                                   <Text style={styles.tableCell}>Start Time</Text>
                                   <Text style={styles.tableCell}>End Time</Text>
                               </View>
                               {examSchedule.map((exam, index) => (
                                   <View style={styles.tableRow} key={index}>
                                       {console.log('examSchedule', exam)}
                                       <Text style={styles.tableCell}>{exam.subject?.name}</Text>
                                       <Text style={styles.tableCell}>{moment(exam.date).format('DD/MM/YYYY')}</Text>
                                       <Text style={styles.tableCell}>{exam.startTime}</Text>
                                       <Text style={styles.tableCell}>{exam.endTime}</Text>
                                   </View>
                               ))}
                           </View>
                       </Page>
               </Document>
           ).toBlob();
           saveAs(blob, `Admit_Cards_${moment().format('YYYY-MM-DD')}.pdf`);
           generateUrl(blob)
};



const styles = StyleSheet.create({
  page: { padding: 20 },
  header: { textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 18, fontFamily: 'RobotoB' },
  table: { display: 'table', width: '100%', borderStyle: 'solid', borderWidth: 1, marginTop: 10 },
  tableRow: { flexDirection: 'row' },
  tableCell: { flex: 1, borderWidth: 1, padding: 5, fontSize: 10 },
  lable: { fontFamily: 'RobotoR', fontSize: 14 },
  bold: { fontFamily: 'RobotoB', fontSize: 14 },
});