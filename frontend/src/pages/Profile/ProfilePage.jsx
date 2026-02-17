import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import JobSeekerProfile from './JobSeekerProfile';
import RecruiterProfile from './RecruiterProfile';
import AdminProfile from './AdminProfile';
import Loader from '../../components/Common/Loader';

const ProfilePage = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Route to appropriate profile based on user role
  switch (user.role) {
    case 'jobseeker':
      return <JobSeekerProfile />;
    case 'recruiter':
      return <RecruiterProfile />;
    case 'admin':
      return <AdminProfile />;
    default:
      return <JobSeekerProfile />;
  }
};

export default ProfilePage;