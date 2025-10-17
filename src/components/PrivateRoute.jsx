import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[var(--color-bg)] p-4">
        {/* The animate-pulse class from Tailwind CSS creates the loading effect */}
        <div className="w-full max-w-lg animate-pulse">
          <div className="w-full space-y-5 p-8 bg-white/5 backdrop-blur-md rounded-2xl">
            {/* Header Skeleton */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-gray-300/50 rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-300/50 rounded-md w-3/4"></div>
                <div className="h-4 bg-gray-300/50 rounded-md w-1/2"></div>
              </div>
            </div>
            
            {/* Content Skeleton */}
            <div className="space-y-3 pt-4">
              <div className="h-4 bg-gray-300/50 rounded-md w-full"></div>
              <div className="h-4 bg-gray-300/50 rounded-md w-full"></div>
              <div className="h-4 bg-gray-300/50 rounded-md w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;