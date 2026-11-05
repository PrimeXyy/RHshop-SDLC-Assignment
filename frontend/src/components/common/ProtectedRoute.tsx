import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAppSelector } from '../../redux/hooks';
import Spinner from './Spinner';

interface Props {
  children: ReactNode;
  adminOnly?: boolean;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, adminOnly = false, allowedRoles }: Props) => {
  const { user, isInitialized } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (!isInitialized) return <Spinner fullPage />;

  const staffToken = typeof localStorage !== 'undefined' ? localStorage.getItem('store_staff_token') : null;
  const customerToken = typeof localStorage !== 'undefined' ? localStorage.getItem('store_customer_token') : null;

  if (adminOnly) {
    if (user?.role === 'admin' || user?.role === 'ADMIN' || staffToken) {
      return <>{children}</>;
    }
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (staffToken && (allowedRoles.includes('WAREHOUSE') || allowedRoles.includes('ADMIN'))) {
      return <>{children}</>;
    }
    if (user && allowedRoles.map((r) => r.toLowerCase()).includes(user.role?.toLowerCase())) {
      return <>{children}</>;
    }
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!user && !customerToken && !staffToken) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
