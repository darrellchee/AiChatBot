import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import App from './App';
import Home from './home/home';
import Login from './login/login';
import Signup from './signup/signup';
import 'bootstrap/dist/css/bootstrap.min.css';

const router = createBrowserRouter([
    {
        path : '/', element : <Home/>
    },
    {
        path : '/chat', element : <App/>
    },
    {
        path : '/login', element : <Login/>
    },
    {
        path : '/signup', element : <Signup/>
    }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);
