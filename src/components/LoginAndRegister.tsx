import React, { useState, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fireAuth } from '../firebase';
import Cookies from 'js-cookie';

import { Button, TextField, Box, Typography, Paper, createTheme, ThemeProvider } from '@mui/material';
// Create a theme for Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#004d40', // Dark Green
    },
    secondary: {
      main: '#6ca977', // Light Green
    },
    success: {
      main: '#388e3c', // You can adjust this
    },
  },
});

const LoginAndRegister: React.FC = () => {
  // State for login component
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const auth = fireAuth
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);

      if (userCredential && userCredential.user) {
        const user = userCredential.user;
        const uid = user.uid;
        const idToken = await user.getIdToken();
        Cookies.set('token', idToken, { expires: 1 / 24 }); // Set cookie to expire in 1 hour

        axios 
          .post('http://localhost:8000/users/login', {uid, idToken}, { 
          headers: { Authorization: `Bearer ${idToken}` } // Fixed the header format 
          }) 
          .then((response) => { 
          if (response.data && response.data.token) { 
          setToken(response.data.token); 
          setMessage('Login successful'); 
          navigate('/item'); 
          } else { 
          setMessage('Login failed: Invalid response data'); 
          } 
          }) 
          .catch((error) => {
            setMessage('Login failed: ' + (error.response?.data?.error || 'Unknown error'));
          });
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage('Login failed: ' + error.message);
      } else {
        console.log('Unexpected error', error);
      }
    }
  };

  // Inline styles
  const rootStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column', // TypeScript infers the correct type
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  };

  const buttonStyle = {
    margin: '8px',
    backgroundColor: theme.palette.success.main,
    color: 'white',
  };

  const formStyle = {
    marginTop: '20px',
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        {/* Login Form */}
        <Paper
          sx={{
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2, // Spacing between elements
          }}
        >
          <Typography variant="h5" color="primary">
            Login
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
          >
            Login
          </Button>
          {message && <Typography color="secondary">{message}</Typography>}
          {token && <Typography>Token: {token}</Typography>}
        </Paper>

        {/* Register Button */}
        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
          No accounts? Then go to
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          component={Link}
          to="/signupform"
          sx={{ marginTop: 2 }}
        >
          Register
        </Button>
      </Box>
    </ThemeProvider>
  );
};
export default LoginAndRegister;
