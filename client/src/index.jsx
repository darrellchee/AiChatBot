import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import App from './App';
import Home from './home/home';
import Login from './login/login';
import Signup from './signup/signup';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Unauthorized from './unauth/Unauthorized';
import PrivateRoute from './PrivateRoute';


// 1a) Pull any existing token from localStorage
const token = localStorage.getItem('token');
if (token) {
  // 1b) Set the default Authorization header
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const router = createBrowserRouter([
    {
        path : '/login', element : <Login/>
    },
    {
        path : '/signup', element : <Signup/>
    },{ path: '/unauthorized', element: <Unauthorized/> },
    {
    element: <PrivateRoute redirectTo="/unauthorized" />,
    children: [
      { path: '/',         element: <Home/> },
      { path: '/chat',     element: <App/> },
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);
