import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

interface LikeCountProps {
  itemID: number;
  itemCategoriesID: number;
    isItemLiked: boolean;
}

const LikeCount: React.FC<LikeCountProps> = ({ itemID, itemCategoriesID, isItemLiked }) => {
  const [likeCount, setLikeCount] = useState<number | null>(null);

  useEffect(() => {
    // Make an API request to get the like count for the specified item
    axios.get(`http://localhost:8000/items/countlikes?item_id=${itemID}&item_categories_id=${itemCategoriesID}`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    })
      .then((response) => {
        setLikeCount(response.data.count);
        isItemLiked = true;

      })
      .catch((error) => console.error('Error fetching like count:', error));
  }, [itemID, itemCategoriesID, isItemLiked]);

  return (
    <div>
      {likeCount === null ? (
        <p>Loading like count...</p>
      ) : (
        <p>Number of Likes: {likeCount}</p>
      )}
    </div>
  );
};

export default LikeCount;
