import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();


  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace state={{ from: location }} />;
};
