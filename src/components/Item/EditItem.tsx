import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CurriculumCheckbox from '../curriculum/Checkbox';
import SingleCheckbox from '../item_category/SingleCheckbox';
import Cookies from 'js-cookie';
import { fireAuth } from '../../firebase';
import { ItemDetails } from '../../interfaces/ItemDetails';
import { useParams } from 'react-router-dom';

const EditItem = () => {
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
    item_categories_name: null, // Initialize with null instead of an empty string
    explanation: '',
    curriculum_ids: [], // Specify the type explicitly as number[]
  });
  
 
  const [item, setItem] = useState<ItemDetails | null>(null);
  const { item_categories_name, item_id } = useParams();
  const token = Cookies.get('token');
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    const itemId = item_id;

    axios
      .get(`http://localhost:8000/${item_categories_name}/get?id=${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data);
        setItem(response.data);
        setFormData({
          title: response.data.title,
          author: response.data.author,
          link: response.data.link,
          item_categories_id: response.data.item_categories_id,
          item_categories_name: response.data.item_categories_name,
          explanation: response.data.explanation,
          curriculum_ids: response.data.curriculum_ids,
        });
      })
      .catch((error) => {
        console.error('Error fetching item details: ', error);
      });
  }, [item_categories_name, item_id, token]);

  const handleSaveChanges = () => {
    if (item) {
      if (fireAuth.currentUser) {
        const updatedItem = {
          id: item.id,
          title: formData.title,
          author: formData.author,
          link: formData.link,
          item_categories_id: formData.item_categories_id,
          explanation: formData.explanation,
          curriculum_ids: formData.curriculum_ids,
          user_id: fireAuth.currentUser.uid,
        };

        axios
          .put(`http://localhost:8000/${item_categories_name}/update`, updatedItem, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            console.log(response);
            // Redirect to the item details page after a successful update
            window.location.href = `/item/${item.item_categories_name}/${item.id}`;
          })
          .catch((error) => {
            console.error('Error updating item: ', error);
          });
      } else {
        console.error('User is not authenticated.');
      }
    }
  };

  return (
    <div>
      <h2>Edit Item</h2>
      <form>
        <label>Title:</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          disabled={!isEditing}
        />
        <label>Author:</label>
        <input
          type="text"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          disabled={!isEditing}
        />
        <label>Link:</label>
        <input
          type="text"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          disabled={!isEditing}
        />
        <label>Explanation:</label>
        <input
          type="text"
          value={formData.explanation}
          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          disabled={!isEditing}
        />
        <div>
          <label>Curriculum:</label>
          <CurriculumCheckbox
            selectedCurriculumIds={formData.curriculum_ids}
            onCheckboxChange={(id) => {
              if (isEditing) {
                setFormData((prevData) => ({
                  ...prevData,
                  curriculum_ids: prevData.curriculum_ids.includes(id)
                    ? prevData.curriculum_ids.filter((curriculumId) => curriculumId !== id)
                    : [...prevData.curriculum_ids, id],
                }));
              }
            }}
            disabled={!isEditing}
          />
        </div>
        <div>
          <SingleCheckbox
            selectedCategoryId={formData.item_categories_id}
            onCheckboxChange={(id, name) => {
              if (isEditing) {
                setFormData((prevData) => ({
                  ...prevData,
                  item_categories_name: prevData.item_categories_id === id ? '' : name,
                  item_categories_id: prevData.item_categories_id === id ? null : id,
                }));
              }
            }}
            disabled={!isEditing}
          />
        </div>
      </form>
      <button type="button" onClick={handleSaveChanges}>
        Save Changes
      </button>
    </div>
  );
};

export default EditItem;