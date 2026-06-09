import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  if (user === undefined) return null; // still checking session

  if (!user) return <Navigate to="/login?next=/admin" replace />;

  if (!user.isAdmin) return <Navigate to="/home" replace />;

  return children;
}
