"use client";

import { useAuth } from '@/contexts/auth.context';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react'

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin }) => {
    const { loading, isAuthenticated, isAdmin } = useAuth();

    useEffect(() => {
        if (loading) {
            console.log('Loading auth state, waiting...');
            return; // Wait until loading is complete
        }

        if (!isAuthenticated) {
            console.log('User not authenticated, redirecting to auth page');
            redirect('/');
        } 

        if (requireAdmin && !isAdmin) {
            console.log('User is not an admin, redirecting to home page');
            redirect('/');
        }
    }, [loading, isAuthenticated, isAdmin]);

    return (
        <div className="min-h-[calc(100vh-4rem)]">
            {!loading && isAuthenticated && (requireAdmin ? isAdmin : true) && children}
        </div>
    );
}

export default ProtectedRoute
