import React from 'react';
import { Link } from 'react-router-dom';
import { Button, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#004d40', // Dark Green
    },
    secondary: {
      main: '#a5d6a7', // Light Green
    },
  },
});

const Header: React.FC = () => {
  // Inline styles
  const rootStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Center vertically in the viewport
  };

  const buttonStyle = {
    margin: '8px', // Approximation of theme.spacing(1)
    backgroundColor: theme.palette.success.main,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  };

  return (
    <div style={rootStyle}>
      <Button
        component={Link}
        to="/login"
        style={buttonStyle}
      >
        Login
      </Button>
      <Button
        component={Link}
        to="/signupform"
        style={buttonStyle}
      >
        Register
      </Button>
    </div>
  );
};

export default Header;
