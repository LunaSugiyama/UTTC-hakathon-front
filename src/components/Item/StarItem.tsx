import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { fireAuth } from '../../firebase';

interface StarButtonProps {
  item: { id: number; isStarred: boolean; item_categories_id: number };
  onStar: (item: { id: number; isStarred: boolean; item_categories_id: number }) => void;
}

const StarButton: React.FC<StarButtonProps> = ({ item, onStar }) => {
  const [isStarred, setIsStarred] = useState(item.isStarred);

  useEffect(() => {
    // Update the button text based on the item's starred state
    checkIfItemIsStarred();
    console.log('checkIfItemIsStarred')
  }, [item.isStarred]);

  const toggleStar = () => {
    // Toggle the star/unstar action based on the current state
    if (isStarred) {
      unstarItem();
    } else {
      starItem();
    }
  };


  const checkIfItemIsStarred = () => {
    const user_id = fireAuth.currentUser?.uid;

  if (!user_id) {
    // Wait and try again after a short delay
    setTimeout(() => {
      checkIfItemIsStarred();
    }, 50); // Adjust the delay as needed
    return;
  }

    // Make an HTTP GET request to the /checkstarred endpoint
    axios
      .get(`http://localhost:8000/items/checkstarred`, {
        params: {
          item_id: item.id,
          item_categories_id: item.item_categories_id,
          user_firebase_uid: user_id,
        },
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      })
      .then((response) => {
        // Update the isStarred state based on the response
        setIsStarred(response.data.isStarred);
      })
      .catch((error) => {
        // Handle errors here
        console.error('Error checking if the item is starred:', error);
      });
  };

  const starItem = () => {
    const user_id = fireAuth.currentUser?.uid;

    if (!user_id) {
      console.error('Error starring the item: User ID is not available');
      return;
    }
  
    // Make an HTTP POST request to star the item with additional data in the payload
    axios
      .post(
        'http://localhost:8000/items/star',
        {
          item_id: item.id,
          item_categories_id: item.item_categories_id,
          user_firebase_uid: user_id, // Add the user_id to the payload
        },
        {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` },
        }
      )
      .then((response) => {
        // Update the state to reflect that the item is now starred
        setIsStarred(true);
  
        // Notify the parent component about the star action
        onStar({ id: item.id, isStarred: true, item_categories_id: item.item_categories_id });
      })
      .catch((error) => {
        // Handle errors here
        console.error('Error starring the item:', error);
      });
  };
  
  const unstarItem = () => {
    const user_id = fireAuth.currentUser?.uid;

    if (!user_id) {
      console.error('Error unstarring the item: User ID is not available');
      return;
    }
    
    // Make an HTTP POST request to unstar the item
    axios
      .post(
        'http://localhost:8000/items/unstar',
        {
          item_id: item.id,
          item_categories_id: item.item_categories_id,
          user_firebase_uid: user_id,
        },
        {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` },
        }
      )
      .then((response) => {
        // Update the state to reflect that the item is now unstarred
        setIsStarred(false);
  
        // Notify the parent component about the star action
        onStar({ id: item.id, isStarred: false, item_categories_id: item.item_categories_id });
      })
      .catch((error) => {
        // Handle errors here
        console.error('Error unstarring the item:', error);
      });
  };
  

  return (
    <button onClick={toggleStar}>
      {isStarred ? 'Unstar' : 'Star'}
    </button>
  );
};

export default StarButton;
