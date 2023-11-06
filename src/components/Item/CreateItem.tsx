import React, { useState } from 'react';
import axios from 'axios';
import CurriculumCheckbox from '../curriculum/Checkbox'; // Import the CurriculumCheckbox component
import SingleCheckbox from '../item_category/SingleCheckbox';
import Cookies from 'js-cookie';
import {fireAuth} from '../../firebase';

const CreateItem = () => {
    const [formData, setFormData] = useState<{
        title: string;
        author: string;
        link: string;
        item_categories_id: number | null;
        item_categories_name: string | null;
        explanation: string;
        curriculum_ids: number[];
      }>({
        title: '',
        author: '',
        link: '',
        item_categories_id: null,
        item_categories_name: '',
        explanation: '',
        curriculum_ids: [], // Specify the type explicitly as number[]
      });

      const handleCheckboxChange = (id: number) => {
        // Toggle the selected curriculum ID
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
        // Toggle the selected item category
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

  const handleSubmit = () => {
    //get the firebase UID
    const user = fireAuth.currentUser;
    const firebase_UID = user ? user.uid : null;
    // Include selected curriculum IDs in the formData
    const dataToSend = {
      ...formData,
      curriculum_ids: formData.curriculum_ids,
      item_categories_id: formData.item_categories_id,
      user_id: firebase_UID,
    };
    const token = Cookies.get('token');

    axios
    .post(`http://localhost:8000/${formData.item_categories_name}/create`, dataToSend, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      window.location.href = `/home`;
        // Handle success, e.g., show a success message or redirect to another page
      })
      .catch((error) => {
        // Handle errors, e.g., show an error message
        console.error('Error creating item: ', error);
      });
  };

  return (
    <div>
      <h2>Create a New Item</h2>
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
        {/* Use the CurriculumCheckbox component here */}
        <div>
          <label>Curriculum:</label>
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
