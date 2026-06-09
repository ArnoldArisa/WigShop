import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user === undefined) return null; // still checking session

  if (!user) {
    return <Navigate to={`/register?next=${location.pathname}`} replace />;
  }

  return children;
}
