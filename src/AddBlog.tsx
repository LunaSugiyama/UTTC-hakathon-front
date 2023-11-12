import React, { useState, useEffect } from 'react';
import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';
import { fireAuth } from './firebase';

const AddBlog = () => {
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = fireAuth.onAuthStateChanged((user) => {
      if (user) {
        // The user is authenticated, you can access user.uid here
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleAddBlog = async () => {
    const user = fireAuth.currentUser;

    if (!user) {
      setMessage('Error: User is not authenticated.');
      return;
    }

    try {
      const response = await axios.post('https://uttc-hackathon-back1-lv2ftadd7a-uc.a.run.app/addBlog', {
        user_id: user.uid, // Use the Firebase User ID
        link: link,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error: Unable to add the blog entry');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Add Blog Entry</h1>
      <div>
        <label>Link: </label>
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>
      <button onClick={handleAddBlog}>Add Blog</button>
      <p>{message}</p>
    </div>
  );
};

export default AddBlog;
