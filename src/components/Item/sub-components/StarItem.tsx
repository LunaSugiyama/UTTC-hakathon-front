import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { fireAuth } from '../../../firebase';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import IconButton from '@mui/material/IconButton';

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
    const user_firebase_uid = fireAuth.currentUser?.uid;

  if (!user_firebase_uid) {
    // Wait and try again after a short delay
    setTimeout(() => {
      checkIfItemIsStarred();
    }, 50); // Adjust the delay as needed
    return;
  }

    // Make an HTTP GET request to the /checkstarred endpoint
    axios
      .get(`https://uttc-hackathon-back1-lv2ftadd7a-uc.a.run.app/items/checkstarred`, {
        params: {
          item_id: item.id,
          item_categories_id: item.item_categories_id,
          user_firebase_uid: user_firebase_uid,
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
    const user_firebase_uid = fireAuth.currentUser?.uid;

    if (!user_firebase_uid) {
      console.error('Error starring the item: User ID is not available');
      return;
    }
  
    // Make an HTTP POST request to star the item with additional data in the payload
    axios
      .post(
        'https://uttc-hackathon-back1-lv2ftadd7a-uc.a.run.app/items/star',
        {
          item_id: item.id,
          item_categories_id: item.item_categories_id,
          user_firebase_uid: user_firebase_uid, // Add the user_firebase_uid to the payload
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
    const user_firebase_uid = fireAuth.currentUser?.uid;

    if (!user_firebase_uid) {
      console.error('Error unstarring the item: User ID is not available');
      return;
    }
    
    // Make an HTTP POST request to unstar the item
    axios
      .post(
        'https://uttc-hackathon-back1-lv2ftadd7a-uc.a.run.app/items/unstar',
        {
          item_id: item.id,
          item_categories_id: item.item_categories_id,
          user_firebase_uid: user_firebase_uid,
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
<IconButton
  onClick={toggleStar}
  aria-label={isStarred ? 'Unstar' : 'Star'}
  sx={{
    color: isStarred ? '#ffc107' : '#e0e0e0', // gold color for starred, light gray for unstarred
    '&:hover': {
      bgcolor: 'transparent', // remove the default grey background on hover
      fontSize: '4rem', // increase the font size on hover
    },
  }}
>
  {isStarred ? <StarIcon fontSize='large'/> : <StarBorderIcon fontSize='large'/>}
</IconButton>
  );
};

export default StarButton;
