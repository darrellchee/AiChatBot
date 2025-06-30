import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateRoute({ redirectTo = '/login' }) {
  const token = localStorage.getItem('token')
  return token
    ? <Outlet/>
    : <Navigate to={redirectTo} replace/>
}
