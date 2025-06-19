import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import CarList from './components/CarList';
import axios from 'axios';

axios.defaults.baseURL = 'https://09b1-80-29-143-44.ngrok-free.app';
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('app')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/cars" element={<CarList />} />
    </Routes>
  </BrowserRouter>
);
