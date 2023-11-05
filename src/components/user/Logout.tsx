import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

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
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
