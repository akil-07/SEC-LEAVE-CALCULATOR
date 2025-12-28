import React, { createContext, useState, useEffect, useContext } from 'react';
import { storageService } from '../services/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for active session (simplified for demo)
        const storedUser = localStorage.getItem('attendance_active_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (username, password) => {
        const u = storageService.getUser(username);
        if (u && u.password === password) {
            setUser(u);
            localStorage.setItem('attendance_active_user', JSON.stringify(u));
            return true;
        }
        return false;
    };

    const signup = (username, password) => {
        try {
            const u = storageService.createUser(username, password);
            // Auto login
            setUser(u);
            localStorage.setItem('attendance_active_user', JSON.stringify(u));
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('attendance_active_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
