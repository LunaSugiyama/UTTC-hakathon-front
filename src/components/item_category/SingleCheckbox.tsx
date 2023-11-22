import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {ItemCategory} from '../../interfaces/ItemCategory';
import Cookies from 'js-cookie';

// MUI
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // a shade of green
    },
    // ... other theme properties if needed
  },
  // ... other theme customization
});

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
      .get('https://uttc-hakathon-front.vercel.app/item_categories/showall', {
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
      <ThemeProvider theme={theme}>
        <div>
          <h3>Item Categories: </h3>
          {itemCategories.map((category) => (
            <FormControlLabel
              key={category.ID}
              control={
                <Checkbox
                  checked={category.ID === selectedCategoryId}
                  onChange={() => handleItemCategoryChange(category)}  
                  color="primary" // use the theme's primary color
                />
              }
              label={category.Name}
            />
          ))}
        </div>
      </ThemeProvider>
    );
  };

export default SingleCheckbox;