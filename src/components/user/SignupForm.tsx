import React, { useState } from 'react';
import { fireAuth } from '../../firebase';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged } from "firebase/auth";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Paper, Box, createTheme, ThemeProvider } from '@mui/material';
import CustomTheme from '../../item/theme/CustomTheme';

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [firebase_uid, sestFirebaseUID] = useState<string | null>(null);
  const navigate = useNavigate();

  // Listen for authentication state changes to get the firebase_uid
  onAuthStateChanged(fireAuth, (user) => {
    if (user) {
      sestFirebaseUID(user.uid);
    } else {
      sestFirebaseUID(null);
    }
  });

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(fireAuth, email, password);

      // Ensure the firebase_uid is set before making the POST request
      if (!firebase_uid) {
        alert('ユーザーfirebase_uidが取得できませんでした');
        return;
      }

      const userData = {
        email,
        name,
        age,
        firebase_uid, // Include the firebase_uid in the user data
      };

      const response = await axios.post('https://uttc-hakathon-front.vercel.app/users/register', userData);
      if (response.status === 200 || response.status === 201) {
        console.log('ユーザー作成成功');
        navigate('/login')
      } else {
        alert(`ユーザー作成失敗: ${response.data.error}`);
      }
      alert('新しいユーザーアカウントが作成されました');
    } catch (error) {
      if (error instanceof Error) {
        alert(`ユーザー作成エラー: ${error.message}`);
      } else {
        console.log('Unexpected error', error);
      }
    }
  };

  return (
    <ThemeProvider theme={CustomTheme}>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
      <Paper elevation={1} style={{ backgroundColor: '#e8f5e9', padding: '10px', borderRadius: '12px', width: 'calc(40% + 20px)' }}>
        <Paper elevation={3} style={{ padding: '20px', margin: '10px' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Register
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Name"
            type="text"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Age"
            type="number"
            variant="outlined"
            value={age != null ? age : ''}
            onChange={(e) => setAge(Number(e.target.value))}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleSignup} style={{ marginTop: '20px' }}>
            Create Account
          </Button>
        </Paper>
      </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default SignupForm;
