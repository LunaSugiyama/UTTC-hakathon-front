import axios from 'axios';

const axiosWithAuth = axios.create({
  baseURL: 'https://uttc-hackathon-back1-lv2ftadd7a-uc.a.run.app', // Set your API base URL
});

export default axiosWithAuth;