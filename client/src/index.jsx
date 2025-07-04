import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './global.css';
import App from './App';
import Home from './home/home';
import Login from './login/login';
import Signup from './signup/signup';
import PrivateRoute from './PrivateRoute';

// grab token once at startup
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const router = createBrowserRouter([
  // public
  { path: '/login',  element: <Login/> },
  { path: '/signup', element: <Signup/> },

  // protected
  {
    path: '/',
    element: <PrivateRoute redirectTo="/login" />,
    children: [
      { index: true,  element: <Home/> },    // exact "/"
      { path: 'chat', element: <App/> },     // "/chat"
    ]
  },

  // catch-all → send back to login
  { path: '*', element: <Navigate to="/login" replace /> }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
