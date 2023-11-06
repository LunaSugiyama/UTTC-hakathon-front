import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fireAuth } from '../../firebase';
import Cookies from 'js-cookie';

interface User {
  firebase_uid: string;
  name: string;
  email: string;
  age: number;
}

const UserPage: React.FC = () => {
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    // Initialize a variable to track if the user is authenticated
    let isUserAuthenticated = false;

    // Create an observer to listen for changes in authentication state
    const unsubscribe = fireAuth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        isUserAuthenticated = true;
        // If the user is authenticated, check for the token and fetch user data
        const token = Cookies.get('token');
        axios
          .get('http://localhost:8000/users/show', {
            params: {
              user_firebase_uid: currentUser.uid,
            },
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            const userData: User = response.data;
            setUser(userData);
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
          });
      } else {
        // If the user is not authenticated, handle the case gracefully
        setUser(null);
      }
    });

    // Unsubscribe from the observer when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>User Profile</h2>
      {user ? (
        <div>
          <p><strong>Firebase UID:</strong> {user.firebase_uid}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Age:</strong> {user.age}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default UserPage;
