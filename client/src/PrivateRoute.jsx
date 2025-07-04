import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function PrivateRoute({ redirectTo = '/login' }) {
  const token = localStorage.getItem('token');
  const location = useLocation();

  return token
    ? <Outlet/>
    : <Navigate 
        to={redirectTo} 
        replace 
        state={{ from: location }} 
      />;
}
