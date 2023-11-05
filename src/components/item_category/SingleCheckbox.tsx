import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {ItemCategory} from '../../interfaces/ItemCategory';
import Cookies from 'js-cookie';

interface SingleCheckboxProps {
  selectedCategoryId: number | null;
  onCheckboxChange: (categoryId: number | null, name: string | null) => void;
  disabled?: boolean;
}

const SingleCheckbox: React.FC<SingleCheckboxProps> = ({
    selectedCategoryId,
    onCheckboxChange,
  }) => {
  // const [selectedItemCategoryId, setSelectedItemCategoryId] = useState<number | null>(null);
  const [itemCategories, setItemCategories] = useState<ItemCategory[]>([]);
  const token = Cookies.get('token');

  useEffect(() => {
    axios
      .get('http://localhost:8000/item_categories/showall', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setItemCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching item categories: ', error);
      });
  }, []);

  const handleItemCategoryChange = (category: ItemCategory | null) => {
    if (category) {
      onCheckboxChange(category.ID, category.Name);
    } else {
      onCheckboxChange(null, null);
    }
  };
  

     return (
    <div>
      <h3>Item Categories: </h3>
        {itemCategories.map((category: ItemCategory) => (
          <label key={category.ID}>
            <input
                type="checkbox"
                checked={category.ID === selectedCategoryId}
                onChange={() => handleItemCategoryChange(category)}  
            />
            {category.Name}
            </label>
        ))}
    </div>
  );
};

export default SingleCheckbox;