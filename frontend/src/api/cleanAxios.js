// src/api/cleanAxios.js
import axios from 'axios';

const cleanAxios = axios.create({
  baseURL: 'http://localhost:5000', // backend port
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default cleanAxios;
