import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export const PostLoginRedirect: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // After successful login, redirect to dashboard
    if (user) {
      console.log('User logged in, redirecting to dashboard');
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  return null;
};