import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Button } from '@mui/material';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token and user-related data
    Cookies.remove('token');

    // Redirect to the login page or update the UI as needed
    navigate('/'); // Redirect to the login page
  };

  return (
    <div>
      <Button 
        onClick={handleLogout}
        variant="contained" 
        style={{ backgroundColor: '#81c784', color: 'white' }} // Light green background with white text
      >
        Logout
      </Button>
    </div>
  );
};

export default Logout;
