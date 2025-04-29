// import React, { useState, useEffect } from 'react';
// import { Container, Typography } from '@mui/material';
// import LeaveForm from '../components/LeaveForm';
// import LeaveList from '../components/LeaveList';
// import { getStudentLeaves } from '../services/api';

// const StudentDashboard = () => {
//   const [leaves, setLeaves] = useState([]);
//   const studentId = '123'; // Hardcoded for demo (replace with actual student ID)

//   useEffect(() => {
//     const fetchLeaves = async () => {
//       try {
//         const { data } = await getStudentLeaves(studentId);
//         setLeaves(data);
//       } catch (error) {
//         console.error('Error fetching leaves:', error);
//       }
//     };
//     fetchLeaves();
//   }, [studentId]);

//   return (
//     <Container maxWidth="md">
//       <Typography variant="h4" gutterBottom>Student Dashboard</Typography>
//       <LeaveForm studentId={studentId} />
//       <Typography variant="h5" gutterBottom style={{ marginTop: 20 }}>My Leave Applications</Typography>
//       <LeaveList leaves={leaves} />
//     </Container>
//   );
// };

// export default StudentDashboard;

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import LeaveForm from '../components/LeaveForm';
import LeaveList from '../components/LeaveList';
import { getStudentLeaves } from '../services/api';

const StudentDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Replace this with actual student ID from your authentication system
  // This should come from props, context, or your auth state
  const studentId = '65d25f1a5f1d2a3e8f7e1b2c'; // Example valid MongoDB ObjectId

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch leaves from API
        const data = await getStudentLeaves(studentId);
        
        // Check if we got valid data
        if (!data || !Array.isArray(data)) {
          throw new Error('Invalid data received from server');
        }
        
        setLeaves(data);
      } catch (err) {
        console.error('Error fetching leaves:', {
          error: err,
          response: err.response,
          studentId
        });
        
        setError(
          err.response?.data?.error || 
          err.response?.data?.message || 
          err.message || 
          'Failed to load leave data'
        );
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a studentId
    if (studentId) {
      fetchLeaves();
    } else {
      setError('No student ID provided');
      setLoading(false);
    }
  }, [studentId]);

  // Handle leave submission success
  const handleLeaveSubmitSuccess = (newLeave) => {
    setLeaves(prevLeaves => [newLeave, ...prevLeaves]);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
          <Box mt={1} fontSize="0.8rem">
            Student ID: {studentId}
          </Box>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        Student Dashboard
      </Typography>
      
      <LeaveForm 
        studentId={studentId} 
        onSubmitSuccess={handleLeaveSubmitSuccess} 
      />
      
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        My Leave Applications
      </Typography>
      
      {leaves.length > 0 ? (
        <LeaveList leaves={leaves} />
      ) : (
        <Alert severity="info">
          No leave applications found for this student
        </Alert>
      )}
    </Container>
  );
};

export default StudentDashboard;