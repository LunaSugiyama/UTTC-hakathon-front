import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

//MUI
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // a shade of green
    },
    // ... other theme properties if needed
  },
  // ... other theme customization
});

interface CurriculumCheckboxProps {
  selectedCurriculumIds: number[];
  onCheckboxChange: (id: number) => void;
  disabled?: boolean;
}

const CurriculumCheckbox: React.FC<CurriculumCheckboxProps> = ({
  selectedCurriculumIds,
  onCheckboxChange,
}) => {
  const [curriculumData, setCurriculumData] = useState<any[]>([]);
  const token = Cookies.get('token');

  useEffect(() => {
    // Fetch curriculum data when the component mounts
    axios
      .get('http://localhost:8000/curriculums/showall', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCurriculumData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching curriculum data: ', error);
      });
  }, []);

  const handleCheckboxChange = (id: number) => {
    onCheckboxChange(id);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <h3>Curriculum Options:</h3>
        {curriculumData.map((curriculum) => (
          <FormControlLabel
            key={curriculum.id}
            control={
              <Checkbox
                checked={selectedCurriculumIds.includes(curriculum.id)}
                onChange={() => handleCheckboxChange(curriculum.id)}
                color="primary" // use the theme's primary color
              />
            }
            label={curriculum.name}
          />
        ))}
      </div>
    </ThemeProvider>
  );
};

export default CurriculumCheckbox;
