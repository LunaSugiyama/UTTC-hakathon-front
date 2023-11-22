import axios from 'axios';

const axiosWithAuth = axios.create({
  baseURL: 'https://uttc-hakathon-front.vercel.app/', // Set your API base URL
});

export default axiosWithAuth;