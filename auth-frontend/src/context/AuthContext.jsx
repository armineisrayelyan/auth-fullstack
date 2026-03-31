import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { setAuthToken } from '../api/axios';
import {
    setAccessToken as storeToken,
    clearAccessToken,
} from '../auth/tokenService';
import {socket} from "../api/socket.js";


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const register = async (payload) => {
        try {
            const res = await api.post('/auth/register', payload);

            setAccessToken(res.data.accessToken);
            setAuthToken(res.data.accessToken);
            setUser(res.data.user);

            return res.data;
        } catch (err) {
            throw err.response?.data?.message || 'Register failed';
        }
    };
    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });

            setAccessToken(res.data.accessToken);
            storeToken(res.data.accessToken);
            setAuthToken(res.data.accessToken);
            setUser(res.data.user);

            socket.auth.token = res.data.accessToken;
            socket.connect();

            return res.data;
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                'Something went wrong';

            throw message;
        }
    };
    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.warn("Logout request failed", error);
        } finally {
            clearAccessToken();
            setAccessToken(null);
            setAuthToken(null);
            setUser(null);
            socket.disconnect();
        }
    };
    const refresh = async () => {
        try {
            const res = await api.post('/auth/refresh');
            setAccessToken(res.data.accessToken);
            storeToken(res.data.accessToken);
            setAuthToken(res.data.accessToken);
            setUser(res.data.user);
            socket.auth.token = res.data.accessToken;
            socket.connect();
        } catch {
            clearAccessToken();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, accessToken, login, register, logout, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);