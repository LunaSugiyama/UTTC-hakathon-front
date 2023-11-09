import React from 'react';
import { signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { fireAuth } from './firebase';

export const GoogleLoginForm: React.FC = () => {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(fireAuth, provider);
      const user: User = result.user;

      // Check if it's the first sign-in
      const isFirstTimeSignIn = await isFirstSignIn(user.uid);

      if (isFirstTimeSignIn) {
        // You should collect the user's age from an input field or another source
        // const age: number | null = 
        const userData: UserData = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          // age: age,
          // Other user data you want to save
        };

        // Save the user data on the server
        await saveUserDataOnServer(userData);
      }

      alert('ログインユーザー: ' + user.displayName);
    } catch (err: any) {
      const errorMessage = err.message;
      alert(errorMessage);
    }
  };

  const isFirstSignIn = async (uid: string): Promise<boolean> => {
    console.log("isFirstSignIn")
    // Check if the user's Firebase UID already exists in Firebase Realtime Database
    const db = getDatabase();
    const userRef = ref(db, `users/${uid}`);

    try {
      const snapshot = await get(userRef);
      return !snapshot.exists();
    } catch (error) {
      console.error('Error checking if it\'s the first sign-in:', error);
      return false;
    }
  };

  const saveUserDataOnServer = async (userData: UserData) => {
    console.log("saveUserDataOnServer")
    try {
      // Make an API request to save user data on the server
      const response = await fetch('http://localhost:8000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert('User data saved on the server');
      } else {
        alert('Failed to save user data on the server');
      }
    } catch (error) {
      console.error('Error saving user data on the server: ', error);
      alert('Failed to save user data on the server');
    }
  };

  return (
    <div>
      <button onClick={signInWithGoogle}>Googleでログイン</button>
    </div>
  );
};

export default GoogleLoginForm;

interface UserData {
  uid: string;
  name: string | null;
  email: string | null;
  // age: number | null;
  // Other user data fields
}
