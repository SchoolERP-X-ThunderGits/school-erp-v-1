import React, { useEffect, useState } from 'react';
import { FaDownload, FaCheckCircle } from 'react-icons/fa';
import { pdf, Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import apiName from '../../../../constants/ApiName'; // Importing API Names
import { showToast } from '../../../../components/Toast'; // Show Toast Notifications
import Loader from '../../../../components/Loader';
import moment from 'moment';
import { getService, postService } from '../../../../constants/Service';
import { useUserContext } from '../../../../context/UserContext';
import { BASE_URL } from '../../../../constants/Config';
import images from '../../../../constants/Images';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../../../components/ui/modal';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../components/ui/table/index';
import Select from '../../../../components/form/Select';
import Button from '../../../../components/ui/button/Button';
import Checkbox from '../../../../components/form/input/Checkbox';
import sspsLandScape from '../../../../assets/Images/CardBackgrounds/sspsLandScape.png';
// Template Modal Component
const TemplateModal = ({ open, onClose, onSelectTemplate, selectedTemplate }) => {
    return (
        <Modal isOpen={open} onClose={onClose} className="max-w-[700px] m-4">
            <div className="no-scrollbar relative w-full max-w-[700px] rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11 h-[500px] flex flex-col">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Select Template
                    </h4>
                    <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                        Please select template for your student id card.
                    </p>
                </div>

                {/* Scrollable content */}
                <div className="flex-grow overflow-y-auto px-2 pb-3 custom-scrollbar">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                        {/* Template 1 */}
                        <div
                            className="flex flex-col items-center cursor-pointer"
                            onClick={() => onSelectTemplate('portrait')}
                        >
                            <img
                                src={images.sspsPortrait}
                                alt="Portrait Template"
                                className="rounded-lg shadow-md transition-transform duration-300 object-contain"
                            />
                            <div className="flex items-center justify-center">
                                {selectedTemplate === 'portrait' && (
                                    <FaCheckCircle className="mr-2 mt-2 text-green-500" />
                                )}
                                <p className="mt-2 text-sm font-semibold text-gray-700 text-center">
                                    SSPS Portrait Template
                                </p>
                            </div>
                        </div>

                        {/* Template 2 */}
                        <div
                            className="flex flex-col items-center cursor-pointer"
                            onClick={() => onSelectTemplate('landscape')}
                        >
                            <img
                                src={sspsLandScape}
                                alt="Landscape Template"
                                className="rounded-lg shadow-md transition-transform duration-300 object-contain"
                            />
                            <div className="flex items-center justify-center">
                                {selectedTemplate === 'landscape' && (
                                    <FaCheckCircle className="mr-2 mt-2 text-green-500" />
                                )}
                                <p className="mt-2 text-sm font-semibold text-gray-700 text-center">
                                    SSPS Landscape Template
                                </p>
                            </div>
                        </div>

                        {/* Template 3 */}
                        <div
                            className="flex flex-col items-center cursor-pointer"
                            onClick={() => onSelectTemplate('visionSchool')}
                        >
                            <img
                                src={images.VisionSchool}
                                alt="VS Template"
                                className="rounded-lg shadow-md transition-transform duration-300 object-cover"
                            />
                            <div className="flex items-center justify-center">
                                {selectedTemplate === 'visionSchool' && (
                                    <FaCheckCircle className="mr-2 mt-2 text-green-500" />
                                )}
                                <p className="mt-2 text-sm font-semibold text-gray-700 text-center">
                                    VS Template
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>

    );
};
// Main StudentIDCard Component
const StudentIDCard = () => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [students, setStudents] = useState([]);
    const [classFilter, setClassFilter] = useState('');
    const [sectionFilter, setSectionFilter] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const { school } = useUserContext();
    const [templateModalOpen, setTemplateModalOpen] = useState(false); // Modal visibility
    const [selectedTemplate, setSelectedTemplate] = useState(); // Default to portrait template
    const navigate = useNavigate()
    useEffect(() => {
        setLoading(true);
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const result = await getService(apiName.getClassList); // Get Classes API
            setClasses(result);
            setLoading(false);
        } catch (error) {
            showToast('Error fetching classes', 'error');
            setLoading(false);
        }
    };

    const fetchSectionsForClass = (classId) => {
        const classSelected = classes.find(classItem => classItem._id === classId);
        if (classSelected) {
            setSections(classSelected.sections); // sections associated with the selected class
        }
    };

    const handleClassFilterChange = (e) => {
        console.log('bkbvkbv', e)
        const selectedClass = e;
        setClassFilter(selectedClass);
        setSectionFilter('');
        fetchSectionsForClass(selectedClass);
    };

    const handleSectionFilterChange = (e) => {
        setSectionFilter(e);
    };

    const handleSearch = (e) => {
        e.preventDefault()
        if (!classFilter || !sectionFilter) {
            showToast('Please select both class and section', 'error');
            return;
        }
        if (!selectedTemplate) {
            showToast('Please select a template first', 'error');
            return;
        }
        fetchFilteredStudents();
    };

    const fetchFilteredStudents = async () => {
        try {
            const result = await getService(`${apiName.getStudentByExam}/${classFilter}/${sectionFilter}`);
            setStudents(result);
            setSelectedStudents([])
            setLoading(false);
        } catch (error) {
            showToast('Error fetching filtered students', 'error');
            setLoading(false);
        }
    };

    const handleStudentSelect = (e, studentId) => {
        if (e) {
            setSelectedStudents([...selectedStudents, studentId]);
        } else {
            setSelectedStudents(selectedStudents.filter(id => id !== studentId));
        }
    };

    const renderStudentList = () => {
        const handleSelectAll = (e) => {
            if (e) {
                // Select all students
                setSelectedStudents(students.map((student) => student._id));
            } else {
                // Deselect all students
                setSelectedStudents([]);
            }
        };
    
        const isAllSelected = students.length > 0 && selectedStudents.length === students.length;
    
        return (
            <div className="container mx-auto p-4">
                <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
                    {students.length === 0 ?
                        <p style={{ textAlign: 'center', margin: 10 }}>No students found</p> :
                        <Table className="w-full text-left border-collapse">
                            <TableHeader className='bg-gray-100 dark:bg-gray-800'>
                                <TableRow>
                                    <th className='px-5 py-3 font-medium text-gray-500 text-left'>
                                        <Checkbox
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                            className="dark:bg-gray-600 dark:border-gray-600"
                                        />
                                    </th>
                                    {['Admission Number', 'Roll Number', 'Name', 'Class', 'Section'].map((header) => (
                                        <th key={header} className="px-5 py-3 font-medium text-gray-500 text-left dark:text-gray-400">
                                            {header}
                                        </th>
                                    ))}
                                </TableRow>
                            </TableHeader>
    
                            <TableBody>
                                {students?.map((student) => (
                                    <TableRow 
                                        className='border-gray-200 dark:border-gray-900 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800' 
                                        key={student._id}
                                    >
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                            <Checkbox
                                                id={student._id}
                                                checked={selectedStudents.includes(student._id)}
                                                onChange={(e) => handleStudentSelect(e, student._id)}
                                                className="dark:bg-gray-600 dark:border-gray-600"
                                            />
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{student?.admission_Number}</TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{student?.roll_Number}</TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                                            <button
                                                onClick={() => navigate(`/admin/student/student-details/${student?._id}`)} // Navigate to student details page
                                                className="text-blue-500 hover:text-blue-700 transition duration-200 dark:text-blue-400 dark:hover:text-blue-600"
                                            >
                                                {student?.first_Name} {student?.last_Name}
                                            </button>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{student?.class_Id?.name}</TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">{student?.section}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    }
                </div>
            </div>
        );
    };
    


    const generateMultipleIdCardPdf = async () => {
        const selectedStudentData = students.filter(student => selectedStudents.includes(student._id));
        const blob = await pdf(
            <Document>
                {selectedStudentData.map((student, index) => (
                    selectedTemplate == 'visionSchool' ?
                        <Page
                            size={'A6'}
                            orientation={'portrait'}
                            key={index}
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
                                            {/* <Text style={{ fontSize: 25,color:'white',fontFamily:'RobotoB' }}>{school.name.split(" ")[0]}</Text>
                                        <Text style={{fontSize:20,color:'white'}}>{school.name.split(" ")?.slice(1).join(' ')}</Text> */}
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
                ))}
            </Document>
        ).toBlob();
        saveAs(blob, `Student_ID_Cards_${moment().format('YYYYMMDD')}.pdf`);
        generateUrl(blob)
    };
    const generateUrl = async (blob) => {
        console.log('Uploading Blob', blob);

        // Prepare FormData to send the blob to the server
        const formData = new FormData();
        formData.append('file', blob, 'id-cards.pdf');  // 'file' matches the multer field name

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
            setSelectedStudents([])
            window.ReactNativeWebView.postMessage(responseData.pdfUrl);
            console.log('Uploaded successfully:', responseData);
        } catch (error) {
            console.error('Error uploading PDF:', error);
        }
    };


    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setTemplateModalOpen(false); // Close the modal
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-900">
        {/* Add Class Button */}
        <div className='w-full p-4 flex justify-between items-center'>
            <div className='text-3xl font-medium text-gray-800 dark:text-white'>Students ID Card</div>
        </div>
        {loading ? (
            <Loader />
        ) : (
            <div>
                {/* Filters */}
                <div className="grid grid-cols-2 p-4 gap-x-6 gap-y-5 lg:grid-cols-4">
                    <Select
                        placeholder='Filter by Class'
                        options={classes.map((classItem) => ({
                            value: classItem._id,
                            label: classItem.name,
                        }))}
                        value={classFilter}
                        onChange={handleClassFilterChange}
                        className="bg-white dark:bg-gray-700 dark:text-white text-black border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <Select
                        disabled={!classFilter}
                        placeholder='Filter by Section'
                        options={sections.map((section) => ({
                            value: section,
                            label: section,
                        }))}
                        value={sectionFilter}
                        onChange={handleSectionFilterChange}
                        className="bg-white dark:bg-gray-700 dark:text-white text-black border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <Button
                        disabled={!sectionFilter}
                        onClick={() => setTemplateModalOpen(true)} // Open the template selection modal
                        className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 dark:hover:bg-purple-700 transition duration-300"
                    >
                        Select Template
                    </Button>
                    <Button
                        onClick={handleSearch}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition duration-300"
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            setClassFilter('');
                            setSectionFilter('');
                            setStudents([]);
                            setSelectedStudents([]);
                        }}
                        className="px-6 py-3 bg-gray-200 !text-black rounded-lg hover:bg-gray-300 transition duration-300"
                    >
                        Clear Filters
                    </Button>
                    {selectedStudents.length > 0 && (
                        <Button
                            onClick={generateMultipleIdCardPdf}
                            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-gray-300 dark:hover:bg-green-600 transition duration-300"
                        >
                            <FaDownload className="mr-2" /> Download ID Cards
                        </Button>
                    )}
                </div>
    
                <div className="mt-6">{renderStudentList()}</div>
            </div>
        )}
    
        {/* Template Modal */}
        <TemplateModal
            selectedTemplate={selectedTemplate}
            open={templateModalOpen}
            onClose={() => setTemplateModalOpen(false)}
            onSelectTemplate={handleTemplateSelect}
        />
    </div>
    
    );
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

export default StudentIDCard;
