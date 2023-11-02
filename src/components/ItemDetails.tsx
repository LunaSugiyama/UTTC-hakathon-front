import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface ItemDetails {
  id: number;
  user_id: number;
  title: string;
  author: string;
  link: string;
  likes: number;
  item_categories_id: number;
  item_categories_name: string;
  explanation: string;
  curriculum_ids: number[];
  // Add other properties as needed
}

const ItemDetails: React.FC = () => {
    const { id, category }: { id?: string, category?: string } = useParams();
    const [item, setItem] = useState<ItemDetails | null>(null);

  useEffect(() => {
    if (id) {
      const itemId = parseInt(id, 10);

      // Fetch item details based on the ID from the URL
      axios.get(`http://localhost:8000/${category}/get?id=${itemId}`)
        .then((response) => {
          setItem(response.data);
        })
        .catch((error) => {
          console.error('Error fetching item details: ', error);
        });
    }
  }, [category, id]);

  const [curriculumNames, setCurriculumNames] = useState<string[]>([]);
  const [loadingCurriculumNames, setLoadingCurriculumNames] = useState(true);

  useEffect(() => {
  if (item && item.curriculum_ids) {
    // Map through curriculum_ids and fetch curriculum names for each ID
    Promise.all(
      item.curriculum_ids.map((curriculumId) =>
        axios.get(`http://localhost:8000/curriculums/get?id=${curriculumId}`)
      )
    )
      .then((responses) => {
        const names = responses.map((response) => response.data.name);
        setCurriculumNames(names);
        setLoadingCurriculumNames(false);
      })
      .catch((error) => {
        console.error('Error fetching curriculum names: ', error);
        setLoadingCurriculumNames(false);
      });
  } else {
    setLoadingCurriculumNames(false);
  }
}, [item]);

  return (
    <div>
      {item ? (
        <div>
          <h2>Item Details</h2>
          <p>ID: {item.id}</p>
          <p>User ID: {item.user_id}</p>
          <p>Title: {item.title}</p>
          <p>Author: {item.author}</p>
          <p>Link: {item.link}</p>
          <p>Likes: {item.likes}</p>
          <p>Item Category: {item.item_categories_name}</p>
          <p>Explanation: {item.explanation}</p>
          <p>Curriculum: {loadingCurriculumNames ? 'Loading...' : curriculumNames.join(', ')}</p>
          {/* Add more details as needed */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ItemDetails;
