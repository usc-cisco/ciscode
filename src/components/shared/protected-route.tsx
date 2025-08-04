"use client";

import { useAuth } from '@/contexts/auth.context';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin }) => {
    const router = useRouter();
    const { loading, isAuthenticated, isAdmin } = useAuth();

    useEffect(() => {
        if (loading) return

        if (!isAuthenticated) {
            console.log('User not authenticated, redirecting to auth page');
            router.push('/auth');
        } 

        if (requireAdmin && !isAdmin) {
            console.log('User is not an admin, redirecting to home page');
            router.push('/');
        }
    }, [loading, isAuthenticated, isAdmin]);

  return children;
}

export default ProtectedRoute
