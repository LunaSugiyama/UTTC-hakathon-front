import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fireAuth } from '../../firebase';
import { getAuth, updatePassword, updateEmail } from "firebase/auth";
import Cookies from 'js-cookie';
import { Container, Typography, CircularProgress, Avatar, Paper, Button, TextField, DialogActions, DialogContent, DialogTitle, Dialog } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { ThemeProvider } from '@mui/material/styles';
import CustomTheme from '../../item/theme/CustomTheme';
import Layout from '../../item/layout/Layout';
import InputAdornment from '@mui/material/InputAdornment';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';

interface User {
  firebase_uid: string;
  name: string;
  email: string;
  age: number;
  password: string;
}

const UserPage: React.FC = () => {
  const [user, setUser] = useState<User | null>();
  const [apiError, setApiError] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedUser, setEditedUser] = useState<User>({
    firebase_uid: '',
    name: '',
    email: '',
    age: 0,
    password: '',
  });
  const validateInputs = () => {
    let isValid = true;
    let newErrors = { name: '', email: '', age: '', password: '' };
  
    // Example validations
    if (!editedUser.name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!editedUser.email.includes('@')) {
      newErrors.email = 'Invalid email';
      isValid = false;
    }
    if (editedUser.age <= 0) {
      newErrors.age = 'Invalid age';
      isValid = false;
    }
    if (editedUser.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    // Add other validations as needed
  
    setErrors(newErrors);
    return isValid;
  };
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    age: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };  

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    const token = Cookies.get('token');
    const user_firebase_uid = fireAuth.currentUser?.uid;
  
    if (!user_firebase_uid) {
      console.error('User is not authenticated or UID is unavailable');
      return; // Exit the function if UID is not available
    }
  
    console.log('firebase', user_firebase_uid);
  
    axios.get(`http://localhost:8000/users/show?user_firebase_uid=${user_firebase_uid}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
      console.log(response.data);
      setUser(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  };
  

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
    if (apiError) {
      setApiError('');
    }
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleEditInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedUser({ ...editedUser, [name]: value });
  
    // Update errors state based on the new input
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      
      // Validate the changed input field and update the errors state accordingly
      switch (name) {
        case 'name':
          newErrors.name = value ? '' : 'Name is required';
          break;
        case 'email':
          newErrors.email = value.includes('@') ? '' : 'Invalid email';
          break;
        case 'age':
          const ageValue = parseInt(value, 10);
          newErrors.age = (!isNaN(ageValue) && ageValue > 0) ? '' : 'Invalid age';
          break;
        case 'password':
          newErrors.password = value.length >= 6 ? '' : 'Password must be at least 6 characters';
          break;
        default:
          break;
      }
      if (apiError) {
        setApiError('');
      }
      return newErrors;
    });
  };
  

  const handleUpdate = () => {
    if (validateInputs()) {
      handleUpdateProfile();
      handleUpdateEmailPassword();
    }
  }

  const handleUpdateProfile = () => {
    // Send a PUT request to update the user's profile
    axios
    .put('http://localhost:8000/users/update', {
      firebase_uid: fireAuth.currentUser?.uid,
      name: editedUser.name,
      email: editedUser.email,
      age: typeof editedUser.age === 'string' ? parseInt(editedUser.age, 10) : editedUser.age,
    }, {
      headers: {
        // Include any necessary headers here, like authorization tokens
      }
    })
    .then((response) => {
      console.log('User profile updated:', response.data);
      setIsEditDialogOpen(false);
      fetchUserData(); // Refresh user data after update
    })
    .catch((error) => {
      console.error('Error updating user profile:', error);
    });
  }

  const handleUpdateEmailPassword = () => {
    // Update Firebase email and password using Firebase Authentication methods
    const updatedEmail = editedUser.email;
    const updatedPassword = editedUser.password;
    const user = fireAuth.currentUser;

    if (!user) {
      console.error('User is not authenticated.');
      return;
    }
  
    // Update Email
      updateEmail(user, editedUser.email).then(() => {
        console.log('Firebase email updated successfully');
      }).catch((error) => {
        console.error('Error updating user profile:', error);
        if (error.response && error.response.data && error.response.data.error) {
          setApiError(error.response.data.error.message);
        } else {
          setApiError('An unexpected error occurred.');
        }
      });
  
    // Update Password
      updatePassword(user, editedUser.password).then(() => {
        console.log('Firebase password updated successfully');
      }).catch((error) => {
        console.error('Error updating user profile:', error);
        if (error.response && error.response.data && error.response.data.error) {
          setApiError(error.response.data.error.message);
        } else {
          setApiError('An unexpected error occurred.');
        }
      });
  };
  

  return (
<Layout>
      <ThemeProvider theme={CustomTheme}>
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ padding: 3, margin: 3 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            User Profile
          </Typography>
          {user ? (
            <div style={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  backgroundColor: CustomTheme.palette.secondary.main,
                  margin: '0 auto',
                }}
              >
                <PersonIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" component="div" gutterBottom>
                {user.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Firebase UID:</strong> {user.firebase_uid}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Age:</strong> {user.age}
              </Typography>
          <Button onClick={handleEditClick} variant="outlined" color="primary">
            Edit Profile
          </Button>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent sx={{ '& .MuiTextField-root': { marginBottom: '16px' } }}>
          <TextField
            label="Name"
            name="name"
            value={editedUser.name}
            onChange={handleEditInputChange}
            fullWidth
            required
            helperText={errors.name}
            error={!!errors.name}
          />
          <TextField
            label="Email"
            name="email"
            value={editedUser.email}
            onChange={handleEditInputChange}
            fullWidth
            required
            helperText={errors.email}
            error={!!errors.email}
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            value={editedUser.age}
            onChange={handleEditInputChange}
            fullWidth
            required
            helperText={errors.age}
            error={!!errors.age}
          />
          <TextField
            label="New Password"
            name="password"
            type={showPassword ? "text" : "password"} 
            value={editedUser.password}
            onChange={handleEditInputChange}
            fullWidth
            helperText={errors.password}
            error={!!errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        {apiError && (
    <Typography color="error" gutterBottom>
      {apiError}
    </Typography>
  )}
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate} 
            color="primary" 
            disabled={Object.values(errors).some(error => error !== '') || apiError !== ''}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
    </Container>
  </ThemeProvider>
    </Layout>
  );
};
export default UserPage;
