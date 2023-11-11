import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { fireAuth } from '../../../firebase';
import { on } from 'events';

// MUI
import { TextField, Button, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

// Define the item object properties with data types
interface Item {
  item_id: number;
  item_categories_id: number;
}

interface CommentInputProps {
  item: Item;
  onCommentSubmit: () => void;
}

const CommentInput: React.FC<CommentInputProps> = ({ item, onCommentSubmit }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    const firebase_UID = fireAuth.currentUser?.uid;
    if (item) {
      // Send the comment to the server (you can use Axios or any other HTTP library)
      // You need to pass the `item.item_id` and `item.item_categories_id` when sending the comment.
      axios
        .post(`http://localhost:8000/items/comments/create`, {
          item_id: item.item_id,
          item_categories_id: item.item_categories_id,
          comment: comment, // This should be the user's input
          user_firebase_uid: firebase_UID,
        }, {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` },
        })
        .then((response) => {
          // Handle a successful comment submission
          console.log('Comment submitted:', response);
          onCommentSubmit(); // Call the onCommentSubmit callback prop
          setComment(''); // Reset the comment input
          // You may also want to update the comment list on the front end.
        })
        .catch((error) => {
          console.error('Error submitting comment: ', error);
        });
    }
  };

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2, // Spacing between elements
          margin: '16px 0',
        }}
      >
        <TextField
          multiline
          placeholder="Add your comment here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          variant="outlined"
          rows={4}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSubmit}
          disabled={!comment.trim()} // Disable the button if the comment is empty
        >
          Submit Comment
        </Button>
      </Box>
    );
};

export default CommentInput;
