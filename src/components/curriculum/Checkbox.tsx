import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import SchoolIcon from '@mui/icons-material/School'; // Example icon for curriculums

//MUI
import {
  ThemeProvider,
  createTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

export const accordionStyle = {
  backgroundColor: 'transparent', // Removing the default background
  boxShadow: 'none', // Removing the default shadow
  borderRadius: '8px', // Matching the border radius
  overflow: 'hidden', // Ensuring the child components' border-radius is visible
};

export const accordionSummaryStyle = {
  color: '#ffffff', // White text color
  backgroundColor: '#9CCC65', // Light green color
  borderRadius: '8px', // Curvy edges
  marginTop: '10px', // Margin at the top
  marginBottom: '5px' // Optional: add a little space at the bottom as well
};

export const accordionDetailsStyle = {
  backgroundColor: '#e8f5e9', // Lighter green color
  // borderRadius: '8px', // Curvy edges
  // marginTop: '5px', // Optional: add a little space at the top as well
  marginBottom: '10px' // Margin at the bottom
};

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
      .get('https://uttc-hakathon-front.vercel.app/curriculums/showall', {
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
      <Accordion
      style={accordionStyle}>
      <AccordionSummary
          style={accordionSummaryStyle}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="curriculum-options-content"
          id="curriculum-options-header"
        >
          <SchoolIcon />
          <h3>Curriculum Options:</h3>
        </AccordionSummary>
        <AccordionDetails
        style={accordionDetailsStyle}>
        <div>
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
      </AccordionDetails>
      </Accordion>
    </ThemeProvider>
  );
};

export default CurriculumCheckbox;
