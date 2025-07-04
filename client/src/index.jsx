// src/index.js (or wherever you call ReactDOM.createRoot)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import Home from './home/home';
import Login from './login/login';
import Signup from './signup/signup';
import PrivateRoute from './PrivateRoute';
import { Analytics } from '@vercel/analytics/react';

// set auth header if token exists
const token = localStorage.getItem('token');
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

const router = createBrowserRouter([
  { path: '/login',  element: <Login/> },
  { path: '/signup', element: <Signup/> },
  {
    path: '/',
    element: <PrivateRoute redirectTo="/login" />,
    children: [
      { index: true,  element: <Home/> },
      { path: 'chat', element: <App/> }
    ]
  },
  { path: '*', element: <Navigate to="/login" replace /> }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
    <Analytics />
  </React.StrictMode>
);
