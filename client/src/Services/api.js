// src/Services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tableros-53ww.onrender.com',
});

export default api;
