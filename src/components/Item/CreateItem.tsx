import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { fireAuth, firebaseStorage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import CurriculumCheckbox from '../curriculum/Checkbox';
import SingleCheckbox from '../item_category/SingleCheckbox';

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
  const firebase_UID = user ? user.uid : null;
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

  if (imageUrls) {
    if (!formData.item_categories_id) {
      setErrorMessage('Please select a category.');
    } else if (!formData.curriculum_ids.length) {
      setErrorMessage('Please select at least one curriculum.');
    } else if (!formData.title) {
      setErrorMessage('Please enter a title.');
    } else if (!formData.author) {
      setErrorMessage('Please enter an author.');
    } else if (!formData.link) {
      setErrorMessage('Please enter a link.');
    } else if (!formData.explanation) {
      setErrorMessage('Please enter an explanation.');
    } else {
      setErrorMessage(''); // Clear any previous error message
      setLoading(true);
      const token = Cookies.get('token');

      const dataToSend = {
        ...formData,
        curriculum_ids: formData.curriculum_ids,
        item_categories_id: formData.item_categories_id,
        user_id: firebase_UID,
        images: imageUrls, // Pass the array of image URLs
      };

      axios
        .post(`http://localhost:8000/${formData.item_categories_name}/create`, dataToSend, {
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
    }
  }
};



  return (
    <div>
      <h2>Create a New Item</h2>
      {loading && <p>Item is being created...</p>} {/* Display loading message */}
      <form>
        <label>Title:</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <label>Author:</label>
        <input
          type="text"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
        />
        <label>Link:</label>
        <input
          type="text"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
        />
        <label>Explanation:</label>
        <input
          type="text"
          value={formData.explanation}
          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
        />
        <label>Image:</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
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
        <button type="button" onClick={handleSubmit}>
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateItem;
