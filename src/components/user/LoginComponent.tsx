import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fireAuth } from '../../firebase';
import Cookies from 'js-cookie';

const LoginComponent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const auth = fireAuth
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);

      if (userCredential && userCredential.user) {
        const user = userCredential.user;
        const idToken = await user.getIdToken();
        Cookies.set('token', idToken, { expires: 1 / 24 }); // Set cookie to expire in 1 hour

        axios 
          .post('http://localhost:8000/users/login', {}, { 
          headers: { Authorization: `Bearer ${idToken}` } // Fixed the header format 
          }) 
          .then((response) => { 
          if (response.data && response.data.token) { 
          setToken(response.data.token); 
          setMessage('Login successful'); 
          navigate('/home'); 
          } else { 
          setMessage('Login failed: Invalid response data'); 
          } 
          }) 
          .catch((error) => {
            setMessage('Login failed: ' + (error.response?.data?.error || 'Unknown error'));
          });
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage('Login failed: ' + error.message);
      } else {
        console.log('Unexpected error', error);
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {message && <p>{message}</p>}
      {token && <p>Token: {token}</p>}
    </div>
  );
};

export default LoginComponent;
