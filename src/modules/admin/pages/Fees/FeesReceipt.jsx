import { useState, useEffect } from 'react';
import "../../css/FeeReceipt.css";
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import { getService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import { pdf, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { useUserContext } from '../../../../context/UserContext';
import moment from 'moment';
import { BASE_URL } from '../../../../constants/Config';
const FeeReceipt = () => {
    const { paymentId } = useParams(); // Assume you are using React Router for route parameters
    const [invoiceData, setInvoiceData] = useState(null);
    const history = useNavigate();
    const { school } = useUserContext();
    const navigateToHome = () => {
        history('/admin/home');
    };

    useEffect(() => {
        // Function to fetch payment data by ID
        const fetchPaymentData = async () => {
            try {
                const { data } = await getService(`${apiName?.getPaymentById}/${paymentId}`)
                const processedData = {
                    date: moment(data.date).format('DD/MM/YYYY'),
                    receipt_no: data.receipt_no,
                    invoiceTo: {
                        name: data.studentId.first_Name + " " + data.studentId.last_Name,
                        roll_no: data.studentId.roll_Number,
                        class: data.studentId.class_Id.name,
                        father: data.studentId.father_Name,
                        contact: `${data.studentId.contact_Number}`,

                    },
                    payTo: {
                        name: school?.name,
                        address: school?.address,
                        stateCountry: 'India',
                        email: school?.email,
                    },
                    fees: data.feePaid.map(fee => ({
                        type: fee.feeType,
                        amount: `₹${fee.amount}/-`,
                    })),
                    totalFee: `₹${data.amountPaid - data.tax}/-`,
                    tax: `₹${data.tax ? data.tax : 0}/-`, // Assuming tax is a fixed value

                    paymentMethod: data.
                        paymentMethod,
                    totalPayable: `₹${data.amountPaid}/-`, // Total payable including tax
                };
                setInvoiceData(processedData);

            } catch (error) {
                console.error('Error fetching payment data:', error);
            }
        };

        fetchPaymentData();
    }, [paymentId]);


    const handlePrint = () => {
        generateFeeReceipt()
        setTimeout(() => {
            window.print();
        }, 100);
    };

    const generateFeeReceipt = async (forDownload) => {
        const blob = await pdf(
            <Document>
                <Page size="A4" style={styles.page} key={invoiceData._id}>
                    <View style={styles.container}>
                        <Text style={styles.header}>Fee Invoice</Text>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.date}>Date: <Text style={{ fontFamily: 'RobotoR', marginLeft: 5 }}>{invoiceData.date}</Text></Text>
                            <Text style={styles.invoiceNumber}>Invoice No: <Text style={{ fontFamily: 'RobotoR', marginLeft: 5 }}>{invoiceData.receipt_no}</Text></Text>
                            <Text style={styles.paymentMode}>Payment Mode: <Text style={{ fontFamily: 'RobotoR', marginLeft: 5 }}>{invoiceData?.paymentMethod}</Text></Text>
                        </View>

                        <View style={styles.schoolInfo}>
                            <Image source={school?.logo} style={styles.logo} />
                            <Text style={styles.schoolName}>{school?.name}</Text>
                            <Image source={school?.logo} style={styles.logo} />
                        </View>
                        <View style={styles.infoBox}>
                            <Text style={styles.label}>Invoice To:</Text>
                            <Text style={{ fontFamily: 'RobotoR', fontSize: 14 }}>Name: {invoiceData.invoiceTo.name}</Text>
                            <Text style={{ fontFamily: 'RobotoR', fontSize: 14 }}>Roll No: {invoiceData.invoiceTo.roll_no}</Text>
                            <Text style={{ fontFamily: 'RobotoR', fontSize: 14 }}>Class: {invoiceData.invoiceTo.class}</Text>
                            <Text style={{ fontFamily: 'RobotoR', fontSize: 14 }}>Father: {invoiceData.invoiceTo.father}</Text>
                            <Text style={{ fontFamily: 'RobotoR', fontSize: 14 }}>Ph: {invoiceData.invoiceTo.contact}</Text>
                        </View>

                        <View style={styles.paymentDetails}>
                            <Text style={styles.label}>Pay To:</Text>
                            <Text style={{ fontFamily: 'RobotoR', fontSize: 14 }}>{invoiceData.payTo.name}</Text>
                            <Text style={{ fontFamily: 'RobotoR', fontSize: 14 }}>{invoiceData.payTo.address}</Text>
                            <Text style={{ fontFamily: 'RobotoR', fontSize: 14 }}>{invoiceData.payTo.stateCountry}</Text>
                            <Text style={{ fontFamily: 'RobotoR', fontSize: 14 }}>{invoiceData.payTo.email}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', borderWidth: 0.7 }}>

                            <View style={styles.fees}>
                                <Text style={styles.feeHeader}>Fees Type</Text>
                                <Text style={[styles.feeHeader, { borderBottomWidth: 0 }]}>Fees Amount</Text>
                            </View>
                            <View style={styles.feeRow}>
                                <Text style={{ fontFamily: 'RobotoR', fontSize: 14, borderBottomWidth: 0.7, padding: 5 }}>April Fee</Text>
                                <Text style={{ fontFamily: 'RobotoR', fontSize: 14, padding: 5 }}>₹500</Text>
                            </View>
                        </View>

                        <View style={styles.totalContainer}>
                            <Text style={styles.total}>Total Fee: <Text style={{ fontFamily: 'RobotoR', marginLeft: 5 }}> ₹500</Text></Text>
                            <Text style={styles.total}>Tax: <Text style={{ fontFamily: 'RobotoR', marginLeft: 5 }}> ₹0</Text></Text>
                            <Text style={styles.total}>Total Payable: <Text style={{ fontFamily: 'RobotoR', marginLeft: 5 }}> ₹500</Text></Text>
                        </View>

                        <Text style={styles.footer}>
                            This is a computer-generated bill and does not require a physical signature.
                        </Text>
                    </View>
                </Page>
            </Document>
        ).toBlob();
        // saveAs(blob, `Student_ID_Cards_${moment().format('YYYYMMDD')}.pdf`);
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
            console.error('Error uploading PDF:', error);
        }
    };

    const handleDownloadPDF = () => {
        const printArea = document.getElementById('print-area');
        html2canvas(printArea).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            // Get the PDF page size
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Get the image properties
            const imgProps = pdf.getImageProperties(imgData);
            const imgWidth = imgProps.width;
            const imgHeight = imgProps.height;

            // Scale to fit content while preserving aspect ratio
            const scaleWidth = pdfWidth / imgWidth;
            const scaleHeight = pdfHeight / imgHeight;

            // Choose the smaller scale factor to ensure the image fits on the page
            const scale = Math.min(scaleWidth, scaleHeight);

            // Calculate the new image width and height after scaling
            const scaledWidth = imgWidth * scale;
            const scaledHeight = imgHeight * scale;

            // Center the image if needed (optional)
            const xOffset = (pdfWidth - scaledWidth) / 2;
            const yOffset = (pdfHeight - scaledHeight) / 2;

            // Add the image to the PDF
            pdf.addImage(imgData, 'PNG', xOffset, yOffset, scaledWidth, scaledHeight);

            // Save the PDF
            pdf.save('invoice.pdf');
        });
        generateFeeReceipt(true)
    };



    if (!invoiceData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="invoice-wrapper" id="print-area">
            <div className="invoice">
                <div className="invoice-container">
                    <div className="invoice-head">
                        <div className="invoice-head-top-right text-start">
                            <h3>Fee Invoice</h3>
                            <div className="invoice-head-middle-left text-start">
                                <p><span className="text-bold">Date</span>: {invoiceData.date}</p>
                            </div>
                            <div className="invoice-head-middle-right text-start">
                                <p><span className="text-bold">Invoice No:</span> {invoiceData.receipt_no}</p>
                            </div>
                            <div className="invoice-head-middle-right text-start">
                                <p><span className="text-bold">Payment mode:</span> {invoiceData.
                                    paymentMethod}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center' }}>
                            {/* Left side: Logo */}
                            <div className="invoice-head-top" style={{ display: 'flex', alignItems: 'center' }}>
                                <img
                                    style={{ width: 50, height: 50 }}
                                    src={school?.logo}
                                    alt="School Logo"
                                />
                            </div>

                            {/* Centered Text: School Name */}
                            <p style={{ fontSize: '20px', fontFamily: 'RobotoB', fontWeight: 'bold', whiteSpace: 'nowrap', flexGrow: 1, textAlign: 'center', marginLeft: 10, marginRight: 10 }}>
                                {school?.name}
                            </p>

                            {/* Right side: QR Logo */}
                            <div className="invoice-head-top" style={{ display: 'flex', alignItems: 'center' }}>
                                <img
                                    style={{ width: 50, height: 50 }}
                                    src={school?.logo}
                                    alt="School QR"
                                />
                            </div>
                        </div>



                    </div>
                    <div className="hr"></div>
                </div>
                <div className="hr"></div>
                <div className="invoice-head-bottom-left">
                    <ul className="right-list">
                        <li className="text-bold">Invoice To:</li>
                        <li>Name - {invoiceData.invoiceTo.name}</li>
                        <li>Roll No. - {invoiceData.invoiceTo.roll_no}</li>
                        <li>Class - {invoiceData.invoiceTo.class}</li>
                        <li>Father - {invoiceData.invoiceTo.father}</li>
                        <li>Ph. No. - {invoiceData.invoiceTo.contact}</li>
                    </ul>
                    <ul className="left-list">
                        <li className="text-bold">Pay To:</li>
                        <li>{invoiceData.payTo.name}</li>
                        <li>{invoiceData.payTo.address}</li>
                        <li>{invoiceData.payTo.stateCountry}</li>
                        <li>{invoiceData.payTo.email}</li>
                    </ul>
                </div>
                <div className="overflow-view">
                    <div className="invoice-body">
                        <table>
                            <thead>
                                <tr>
                                    <td className="text-bold">Fees Type</td>
                                    <td className="text-bold">Fees Amount</td>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceData.fees.map((fee, index) => (
                                    <tr key={index}>
                                        <td>{fee.type}</td>
                                        <td className="text-end">{fee.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="invoice-body-bottom">
                            <div className="invoice-body-info-item border-bottom">
                                <div className="info-item-td text-end text-bold">Total Fee:</div>
                                <div className="info-item-td text-end">{invoiceData.totalPayable}</div>
                            </div>
                            <div className="invoice-body-info-item border-bottom">
                                <div className="info-item-td text-end text-bold">Tax:</div>
                                <div className="info-item-td text-end">{invoiceData.tax ? invoiceData.tax : "0"}</div>
                            </div>
                            <div className="invoice-body-info-item">
                                <div className="info-item-td text-end text-bold">Total Payable:</div>
                                <div className="info-item-td text-end">{invoiceData.totalPayable}</div>
                            </div>
                        </div>
                    </div>
                    <div className="invoice-foot text-center">
                        <p>
                            <span className="text-bold text-center">NOTE:&nbsp;</span> This is a computer-generated bill and does not require physical signature.
                        </p>
                        <div className="invoice-btns header-to-hide">
                            <button type="button" className="button-29" onClick={handlePrint}>
                                <span>Print Bill</span>
                            </button>
                            <button type="button" className="button-30" onClick={handleDownloadPDF}>
                                <span>Download Bill</span>
                            </button>
                            <button type="button" className="invoice-btn" onClick={navigateToHome}>
                                <span>Back to Home</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    logo: { width: 80, height: 80, resizeMode: "contain" },
    date: {
        fontFamily: 'RobotoB',
        fontSize: 14,
        marginBottom: 8,
    },
    invoiceNumber: {
        fontFamily: 'RobotoB',
        fontSize: 14,
        marginBottom: 8,
    },
    paymentMode: {
        fontFamily: 'RobotoB',
        fontSize: 14,
        marginBottom: 16,
    },
    schoolInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    schoolName: {
        width: '80%',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    infoBox: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontFamily: 'RobotoB',
        marginBottom: 4,
    },
    paymentDetails: {
        marginBottom: 20,
    },
    fees: {
        width: '50%'
    },
    feeHeader: {
        padding: 5,
        borderRightWidth: 0.7,
        borderBottomWidth: 0.7,
        fontFamily: 'RobotoB',
        fontSize: 14,
        fontWeight: 'bold',
    },
    feeRow: {
        width: '50%'
    },
    totalContainer: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginTop: 16,
        marginBottom: 16,
    },
    total: {
        fontSize: 14,
        fontFamily: 'RobotoB',
        marginBottom: 4,
    },
    footer: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 20,
    },
});


export default FeeReceipt;
