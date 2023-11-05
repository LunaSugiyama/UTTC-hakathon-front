import axios from 'axios';

const axiosWithAuth = axios.create({
  baseURL: 'http://localhost:8000', // Set your API base URL
});

export default axiosWithAuth;