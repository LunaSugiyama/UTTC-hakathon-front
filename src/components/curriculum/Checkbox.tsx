import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

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
    <div>
      <h3>Curriculum Options:</h3>
      {curriculumData.map((curriculum: any) => (
        <label key={curriculum.id}>
          <input
            type="checkbox"
            checked={selectedCurriculumIds.includes(curriculum.id)}
            onChange={() => handleCheckboxChange(curriculum.id)}
          />
          {curriculum.name}
        </label>
      ))}
    </div>
  );
};

export default CurriculumCheckbox;
