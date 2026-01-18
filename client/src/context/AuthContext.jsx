import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in (on page refresh)
    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                setUser(JSON.parse(savedUser));
                // Optional: Verify token validity with backend here
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });

            // Save to storage
            localStorage.setItem('token', data.token);
            // We save non-sensitive user info (name, role) to keep UI fast
            localStorage.setItem('user', JSON.stringify(data));

            setUser(data);
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth easily
export const useAuth = () => useContext(AuthContext);