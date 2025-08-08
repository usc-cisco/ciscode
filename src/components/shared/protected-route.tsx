"use client";

import { useAuth } from '@/contexts/auth.context';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react'

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
    requireSuperAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin, requireSuperAdmin }) => {
    const { loading, isAuthenticated, isAdmin, isSuperAdmin } = useAuth();

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

        if (requireSuperAdmin && !isSuperAdmin) {
            console.log('User is not a super admin, redirecting to home page');
            redirect('/');
        }
    }, [loading, isAuthenticated, isAdmin, isSuperAdmin]);

    return (
        <div className="min-h-[calc(100vh-4rem)]">
            {!loading && isAuthenticated && (requireAdmin ? isAdmin : true) && (requireSuperAdmin ? isSuperAdmin : true) && children}
        </div>
    );
}

export default ProtectedRoute
