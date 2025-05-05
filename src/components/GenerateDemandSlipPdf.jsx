// utils/generateIdCardPdf.js

import { pdf, Document, Page, Text, View, Image,StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';
import { useUserContext } from '../context/UserContext';
import images from '../constants/Images';

export const GenerateDemandSlipPdf = async ({ student,school, generateUrl }) => {
      const blob = await pdf(
                <Document>
                        <Page key={student.studentId} size="A4" style={styles.page}>
                            <View style={styles.container}>
                                {/* Header Section */}
                                <View style={styles.header}>
                                    <Text style={styles.headerText}>{school?.name}</Text>
                                    <Text style={styles.subHeaderText}>Fee Demand Slip</Text>
                                </View>
    
                                {/* Introduction */}
                                <Text style={styles.introText}>Please deposit the following fee for your child</Text>
    
                                {/* Student Details Section */}
                                <View style={styles.detailsContainer}>
                                    <View style={{ width: '50%' }}>
                                        <View style={styles.row}>
                                            <Text style={styles.label}>SID:</Text>
                                            <Text style={styles.value}>{student.studentDetails?.admission_Number}</Text>
                                        </View>
                                        <View style={styles.row}>
                                            <Text style={styles.label}>Name:</Text>
                                            <Text style={styles.value}>{student?.studentDetails?.first_Name} {student?.studentDetails?.last_Name}</Text>
                                        </View>
                                        {student?.studentDetails?.father_Name && (
                                            <View style={styles.row}>
                                                <Text style={styles.label}>Father:</Text>
                                                <Text style={styles.value}>{student?.studentDetails?.father_Name}</Text>
                                            </View>
                                        )}
                                        {student?.studentDetails?.contact_Number && (
                                            <View style={styles.row}>
                                                <Text style={styles.label}>Mobile:</Text>
                                                <Text style={styles.value}>{student?.studentDetails?.contact_Number}</Text>
                                            </View>
                                        )}
                                    </View>
    
                                    <View style={{ width: '50%' }}>
                                        {student?.studentDetails?.roll_Number && (
                                            <View style={styles.row}>
                                                <Text style={styles.label}>Roll:</Text>
                                                <Text style={styles.value}>{student?.studentDetails?.roll_Number}</Text>
                                            </View>
                                        )}
                                        {student?.studentDetails?.class_Id?.name && (
                                            <View style={styles.row}>
                                                <Text style={styles.label}>Class:</Text>
                                                <Text style={styles.value}>{student?.studentDetails?.class_Id?.name}</Text>
                                            </View>
                                        )}
                                        {student?.studentDetails?.section && (
                                            <View style={styles.row}>
                                                <Text style={styles.label}>Section:</Text>
                                                <Text style={styles.value}>{student?.studentDetails?.section}</Text>
                                            </View>
                                        )}
                                        {student?.studentDetails?.date_Of_Admission && (
                                            <View style={styles.row}>
                                                <Text style={styles.label}>Date:</Text>
                                                <Text style={styles.value}>{moment(student?.studentDetails?.date_Of_Admission).format('DD/MM/YYYY')}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
    
                                {/* Fee Details Table */}
                                <View style={styles.feeTable}>
                                    {/* Table Header */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        <Text style={{ width: '50%', fontFamily: 'RobotoB', textAlign: 'center', borderTopWidth: 1, borderLeftWidth: 1, fontSize: 17, paddingVertical: 5, borderBottomWidth: 1, }}>
                                            Details
                                        </Text>
                                        <Text style={{ width: '50%', fontFamily: 'RobotoB', textAlign: 'center', borderTopWidth: 1, borderLeftWidth: 1, fontSize: 17, paddingVertical: 5, borderBottomWidth: 1, borderRightWidth: 1 }}>
                                            Amount
                                        </Text>
                                    </View>
                                    {console.log('feeDetails?.dueFees', student)}
                                    {/* Table Rows */}
                                    {
                                        student?.dueFees?.length == 0 ?
    
                                            <View style={{ width: '100%', fontFamily: 'RobotoR', textAlign: 'center', borderLeftWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, fontSize: 15, paddingVertical: 5 }}>
                                                <Text>No dues</Text>
                                            </View>
                                            :
                                            student?.dueFees?.map((item, index) => (
                                                <View key={index} style={{ flexDirection: 'row' }}>
                                                    <Text style={{ width: '50%', fontFamily: 'RobotoR', textAlign: 'center', borderLeftWidth: 1, borderBottomWidth: 1, fontSize: 15, paddingVertical: 5 }}>
                                                        {item.feeType}
                                                    </Text>
                                                    <Text style={{ width: '50%', fontFamily: 'RobotoR', textAlign: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, fontSize: 15, paddingVertical: 5 }}>
                                                        Rs. {item.amountDue}
                                                    </Text>
                                                </View>
                                            ))
                                    }
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ width: '50%', fontFamily: 'RobotoB', textAlign: 'center', borderLeftWidth: 1, borderBottomWidth: 1, fontSize: 15, paddingVertical: 5 }}>
                                            Total Fee Due
                                        </Text>
                                        <Text style={{ width: '50%', fontFamily: 'RobotoB', textAlign: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, fontSize: 15, paddingVertical: 5 }}>
                                            Rs. {student?.totalDue}
                                        </Text>
                                    </View>
                                </View>
    
    
                                {/* Reminder */}
                                <View style={styles.reminder}>
                                    <Text style={styles.reminderText}>Kindly pay the fee before the 15th of this month</Text>
                                </View>
    
                                {/* Footer */}
                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>School’s Sign & Stamp</Text>
                                </View>
                            </View>
                        </Page>
                </Document>
    
            ).toBlob();
            saveAs(blob, `Demand_Slips_Students.pdf`);
            generateUrl(blob)
};



const styles = StyleSheet.create({
    page: {
        backgroundColor: '#fff',
    },
    container: {
        padding: 15,
        borderColor: '#ddd',
        borderWidth: 1,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    },
    header: {
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'black',
        paddingVertical: 25,
        paddingHorizontal: 30,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontFamily: 'RobotoB',
        fontSize: 30,
        color: 'black',
        letterSpacing: 2,
    },
    subHeaderText: {
        fontFamily: 'RobotoM',
        fontSize: 20,
        color: '#F5A623',
        fontWeight: 'bold',
        marginTop: 10,
        letterSpacing: 1.5,
    },
    introText: {
        textAlign: 'center',
        fontFamily: 'RobotoR',
        fontSize: 16,
        marginVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 10,
    },
    detailsContainer: {
        flexDirection: 'row',
        marginVertical: 15,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    label: {
        width: '35%',
        fontFamily: 'RobotoB',
        color: '#1c2534',
        fontSize: 16,
    },
    value: {
        width: '65%',
        fontFamily: 'RobotoR',
        marginLeft: 10,
        fontSize: 16,
    },
    feeContainer: {
        flexDirection: 'row',
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    feeHeader: {
        width: '20%',
        fontFamily: 'RobotoB',
        fontSize: 16,
        color: '#333',
    },
    months: {
        width: '75%',
        fontFamily: 'RobotoB',
        fontSize: 14,
        color: '#ff4f58',
    },
    feeTable: {
        marginVertical: 20,
        paddingHorizontal: 15,
    },
    feeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    feeLabel: {
        fontFamily: 'RobotoB',
        fontSize: 17,
        textAlign: 'left',
    },
    feeAmount: {
        fontFamily: 'RobotoR',
        fontSize: 17,
        textAlign: 'right',
    },
    amountInWords: {
        fontFamily: 'RobotoR',
        fontSize: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    reminder: {
        backgroundColor: '#f0f4f8',
        paddingVertical: 15,
        marginVertical: 20,
        alignItems: 'center',
    },
    reminderText: {
        fontFamily: 'RobotoR',
        fontSize: 15,
        color: '#1c2534',
    },
    footer: {
        alignItems: 'flex-end',
        marginTop: 40,
        marginRight: 20,
    },
    footerText: {
        fontFamily: 'RobotoB',
        fontSize: 14,
        color: '#333',
    },
});