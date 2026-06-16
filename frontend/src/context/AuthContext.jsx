import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { api } from '../lib/axios';

const AuthContext = createContext(null);

const initialState = {
  isAuthenticated: false,
  user: null, // { role: 'ADMIN' | 'AGENT', ... }
  loading: true
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true, user: action.payload, loading: false };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null, loading: false };
    case 'INIT':
      return { ...state, ...action.payload, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get('/auth/me');
        // Role comes back as 'ADMIN' or 'AGENT'. Frontend expects lowercase.
        const normalizedUser = {
          role: data.user.role.toLowerCase(),
          data: data.user,
        };
        dispatch({ type: 'INIT', payload: { isAuthenticated: true, user: normalizedUser } });
      } catch (e) {
        dispatch({ type: 'INIT', payload: { isAuthenticated: false, user: null } });
      }
    };
    checkAuth();
  }, []);

  const loginAdmin = async (email, password) => {
    try {
      const { data } = await api.post('/auth/admin/login', { email, password });
      const normalizedUser = {
        role: data.user.role.toLowerCase(),
        data: data.user,
      };
      dispatch({ type: 'LOGIN', payload: normalizedUser });
      return true;
    } catch (e) {
      throw new Error(e.response?.data?.error || 'Login failed');
    }
  };

  const loginAgent = async (phone, otp) => {
    try {
      const { data } = await api.post('/auth/agent/verify-otp', { phone, otp });
      const normalizedUser = {
        role: data.user.role.toLowerCase(),
        data: data.user,
      };
      dispatch({ type: 'LOGIN', payload: normalizedUser });
      return true;
    } catch (e) {
      throw new Error(e.response?.data?.error || 'Invalid OTP');
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout failed on backend', e);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, loginAdmin, loginAgent, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
