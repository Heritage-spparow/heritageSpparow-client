// src/pages/GoogleAuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GoogleAuthCallback() {
  const { login } = useAuth(); // ← we won't use login directly
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // Most important line ↓
        // This will trigger getCurrentUser() inside AuthProvider
        // because token cookie is already set by backend
        const user = await authAPI.getMe(); // or just rely on AuthProvider

        // Optional: you can dispatch manually if you want
        // but usually not needed if AuthProvider already handles it

        navigate('/', { replace: true });
      } catch (err) {
        console.error('Google auth verification failed', err);
        navigate('/login?error=google_auth_failed', { replace: true });
      }
    };

    checkAuthAndRedirect();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Finishing Google Login...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}