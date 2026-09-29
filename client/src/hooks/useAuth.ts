'use client';

import { useAuth as useAuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
    const auth = useAuthContext();

    return {
        ...auth,
        isLoggedIn: auth.isAuthenticated,
        getUserId: () => auth.userId,
        getToken: () => auth.token,
    };
};

export const useUserId = () => {
    const { userId } = useAuthContext();
    if (!userId) {
        throw new Error(
            'useRequiredUserId must be used inside an authenticated route'
        );
    }
    return userId;
};

export const useIsAuthenticated = () => {
    const { isAuthenticated } = useAuthContext();
    return isAuthenticated;
};

export const useToken = () => {
    const { token } = useAuthContext();
    return token;
};
