import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { fireAuth, firebaseStorage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import CurriculumCheckbox from '../curriculum/Checkbox';
import SingleCheckbox from '../item_category/SingleCheckbox';
import Layout from '../../item/layout/Layout';

// MUI
import { Button, TextField, ThemeProvider, createTheme, FormGroup, Paper, Typography, Box, CircularProgress } from '@mui/material';

// Create a green theme.
const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // Main green color
      contrastText: '#ffffff', // White text for contrast
    },
    // ... other theme properties
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff', // Grey background for TextField
          input: {
            color: '#000000', // White text color for TextField
          },
          label: {
            color: '#424242', // White label color
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#ffffff', // White text color for Button
        }
      }
    }
  }
  // ... other theme customization
});

const CreateItem = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    item_id: number | null;
    title: string;
    author: string;
    link: string;
    item_categories_id: number | null;
    item_categories_name: string | null;
    explanation: string;
    curriculum_ids: number[];
    images: File[];
  }>({
    item_id: null,
    title: '',
    author: '',
    link: '',
    item_categories_id: null,
    item_categories_name: '',
    explanation: '',
    curriculum_ids: [],
    images: [],
  });

  useEffect(() => {
    const unsubscribe = fireAuth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in, now you can use user.uid
        console.log(user.uid);
      } else {
        // User is signed out
        console.log('User is not authenticated');
        // Redirect to login or handle unauthenticated state
      }
    });
  
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleCheckboxChange = (id: number) => {
    if (formData.curriculum_ids.includes(id)) {
      setFormData({
        ...formData,
        curriculum_ids: formData.curriculum_ids.filter((curriculumId) => curriculumId !== id),
      });
    } else {
      setFormData({
        ...formData,
        curriculum_ids: [...formData.curriculum_ids, id],
      });
    }
  };

  const handleSingleCheckboxChange = (id: number | null, name: string | null) => {
    if (formData.item_categories_id === id) {
      setFormData({
        ...formData,
        item_categories_name: '',
        item_categories_id: null,
      });
    } else {
      setFormData({
        ...formData,
        item_categories_name: name,
        item_categories_id: id,
      });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedImages = Array.from(event.target.files);
      const updatedImages = [...formData.images, ...selectedImages].slice(0, 3); // Limit to three images
      if (updatedImages.length > 3) {
        setErrorMessage('You can only upload a maximum of three images.');
      } else {
        setErrorMessage('');
        setFormData({ ...formData, images: updatedImages });
      }
    }
  };
  

const uploadImages = async () => {
  const user = fireAuth.currentUser;
  console.log('user:', user);
  const firebase_UID = user ? user.uid : null;
  console.log('firebase_uid',firebase_UID);
  const imageUrls = [];

  for (const image of formData.images) {
    const storageRef = ref(firebaseStorage, `images/${firebase_UID}/${image.name}`);

    try {
      const uploadTask = uploadBytes(storageRef, image);
      await uploadTask;
      const imageUrl = await getDownloadURL(storageRef);
      imageUrls.push(imageUrl);
    } catch (error) {
      console.error('Error uploading image: ', error);
      return null;
    }
  }

  return imageUrls;
};

const removeImage = (index: number) => {
  const updatedImages = [...formData.images];
  updatedImages.splice(index, 1);
  setFormData({ ...formData, images: updatedImages });
};

const handleSubmit = async () => {
  const imageUrls = await uploadImages();
  const user = fireAuth.currentUser;
  const firebase_UID = user ? user.uid : null;
  setLoading(true);

  if (imageUrls) {
    if (!formData.item_categories_id) {
      setLoading(false);
      setErrorMessage('Please select a category.');
    } else if (!formData.curriculum_ids.length) {
      setLoading(false);
      setErrorMessage('Please select at least one curriculum.');
    } else if (!formData.title) {
      setLoading(false);
      setErrorMessage('Please enter a title.');
    } else if (!formData.author) {
      setLoading(false);
      setErrorMessage('Please enter an author.');
    } else if (!formData.link) {
      setLoading(false);
      setErrorMessage('Please enter a link.');
    } else if (!formData.explanation) {
      setLoading(false);
      setErrorMessage('Please enter an explanation.');
    } else {
      setErrorMessage(''); // Clear any previous error message
      const token = Cookies.get('token');
      const uid = Cookies.get('uid');
      console.log('token:', token);
      console.log('uid:', uid);

      const dataToSend = {
        ...formData,
        curriculum_ids: formData.curriculum_ids,
        item_categories_id: formData.item_categories_id,
        user_firebase_uid: firebase_UID,
        images: imageUrls, // Pass the array of image URLs
      };

      axios
        .post(`https://uttc-hakathon-front.vercel.app/${formData.item_categories_name}/create`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setLoading(false);
          window.location.href = `/item/${response.data.item_categories_name}/${response.data.id}}`;
        })
        .catch((error) => {
          setLoading(false);
          console.error('Error creating item: ', error);
        });
        setLoading(false);
    }
  }
};

    return (
      <Layout>
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
        <h2>Create a New Item</h2>
        {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress 
          color="primary" // This uses the primary color from your theme, which is green
          style={{ display: 'block', margin: 'auto' }} // Center the CircularProgress
        />
      </Box>
      )}        
      <form>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            label="Author"
            fullWidth
            margin="normal"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          />
          <TextField
            label="Link"
            fullWidth
            margin="normal"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />
          <TextField
            label="Explanation"
            fullWidth
            margin="normal"
            value={formData.explanation}
            onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          />
          <Button
            variant="contained"
            fullWidth
            style={{ margin: 'normal' }} // use inline style for margin
            component="label" // this makes the button act like a file input
          >
            Upload Image
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageChange}
            />
          </Button>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {formData.images.map((image, index) => (
          <div key={index}>
            <img 
            src={URL.createObjectURL(image)} 
            alt={image.name} 
            style={{maxWidth: '400px', maxHeight: '400px' }}
            />
            <button type="button" onClick={() => removeImage(index)}>
              Cancel
            </button>
          </div>
        ))}
         <div>
           <CurriculumCheckbox
            selectedCurriculumIds={formData.curriculum_ids}
            onCheckboxChange={handleCheckboxChange}
          />
        </div>
        <div>
          <SingleCheckbox
            selectedCategoryId={formData.item_categories_id}
            onCheckboxChange={handleSingleCheckboxChange}
          />
        </div>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Create
          </Button>
          <Button
            variant="outlined"
            style={{ color: '#66cc99', borderColor: '#66cc99', margin: '10px' }}
            href="/item"
          >
            Cancel
          </Button>
        </form>
      </Box>
    </ThemeProvider>
    </Layout>
    );
};


export default CreateItem;
