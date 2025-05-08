import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';
import { MdOutlineModeEdit, MdDelete } from 'react-icons/md';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../components/ui/table';
import Loader from '../../../../components/Loader';

const SchoolDetails = () => {
  const { id } = useParams(); // Get the school ID from the URL
  const navigate = useNavigate();
  const [schoolDetails, setSchoolDetails] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolDetails = async () => {
      try {
        const schoolRes = await getService(`${apiName.schools}/${id}`); // Fetch the school details
        setSchoolDetails(schoolRes);

        const studentsRes = await getService(`${apiName.getStudentBySchoolId}/${id}`); // Fetch students related to this school
        setStudentsList(studentsRes);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching school details:', error);
        setLoading(false);
      }
    };

    fetchSchoolDetails();
  }, [id]);

  if (loading) {
    return (
     <Loader/>
    );
  }

  if (!schoolDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen text-2xl text-red-500">
        No school found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* School Details Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-10">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">School Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300"><strong>School Name:</strong> {schoolDetails.schoolName}</p>
            <p className="text-lg text-gray-700 dark:text-gray-300"><strong>Email:</strong> {schoolDetails.email}</p>
            <p className="text-lg text-gray-700 dark:text-gray-300"><strong>Website:</strong> <a href={`https://${schoolDetails.website}`} className="text-blue-500">{schoolDetails.website}</a></p>
            <p className="text-lg text-gray-700 dark:text-gray-300"><strong>Address:</strong> {schoolDetails.address}</p>
            <p className="text-lg text-gray-700 dark:text-gray-300"><strong>Status:</strong> {schoolDetails.isActive ? 'Active' : 'Inactive'}</p>
          </div>
          <div className="flex justify-center items-center">
            <img
              src={schoolDetails?.logo} // Use a real image for the school
              alt="School Logo"
              className="rounded-full shadow-lg w-40 h-40 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Students List Section */}
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Students List</h2>

      {studentsList.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No students found</p>
      ) : (
        <Table className="w-full text-left border-collapse">
          <TableHeader className="bg-gray-100 dark:bg-gray-800">
            <TableRow>
              {['Admission Number', 'Roll Number', 'Name', "Father's Name", 'Class', 'Section'].map((header) => (
                <th key={header} className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400">{header}</th>
              ))}
              {/* <th className="px-5 py-3 font-medium text-gray-500 dark:text-gray-300">Action</th> */}
            </TableRow>
          </TableHeader>

          <TableBody>
            {studentsList.map((student) => (
              <TableRow
                key={student._id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-300">{student.admission_Number}</TableCell>
                <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-300">{student.roll_Number}</TableCell>
                <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-300">
                  <button
                    onClick={() => navigate(`/admin/student/student-details/${student._id}`)}
                    className="text-blue-500 hover:text-blue-700 transition duration-200 dark:text-blue-400 dark:hover:text-blue-500"
                  >
                    {student.first_Name} {student.last_Name}
                  </button>
                </TableCell>
                <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-300">{student.father_Name}</TableCell>
                <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-300">{student.class_Id?.name}</TableCell>
                <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-300">{student.section}</TableCell>
                {/* <TableCell className="px-5 py-4">
                  <div className="flex gap-3 justify-start items-center">
                    <button
                      onClick={() => navigate(`/admin/edit-student/${student._id}`)}
                      className="text-gray-700 dark:text-white"
                    >
                      <MdOutlineModeEdit size={24} />
                    </button>
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="text-gray-700 dark:text-white"
                    >
                      <MdDelete size={24} />
                    </button>
                  </div>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default SchoolDetails;
