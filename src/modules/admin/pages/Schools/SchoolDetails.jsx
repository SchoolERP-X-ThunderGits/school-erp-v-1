import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';

const SchoolDetails = () => {
  const { id } = useParams(); // Get the school ID from the URL
  const [schoolDetails, setSchoolDetails] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolDetails = async () => {
      try {
        const schoolRes = await getService(`${apiName.schools}/${id}`); // Fetch the school details
        setSchoolDetails(schoolRes);

        const studentsRes = await getService(`${apiName.students}?schoolId=${id}`); // Fetch students related to this school
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
    return <div>Loading...</div>;
  }

  if (!schoolDetails) {
    return <div>No school found</div>;
  }

  return (
    <div>
      <h1>School Details</h1>
      <div>
        <h2>{schoolDetails.schoolName}</h2>
        <p>Email: {schoolDetails.email}</p>
        <p>Website: {schoolDetails.website}</p>
        <p>Address: {schoolDetails.address}</p>
        <p>Status: {schoolDetails.isActive ? 'Active' : 'Inactive'}</p>

        <h3>Students List</h3>
        <ul>
          {studentsList.map((student) => (
            <li key={student._id}>
              {student.fullName} - {student.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SchoolDetails;
