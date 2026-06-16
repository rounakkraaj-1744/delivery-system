import React, { createContext, useContext, useReducer, useEffect } from 'react';

// TODO(security): Storing authentication tokens in localStorage is vulnerable to XSS.
// In a real production backend, use secure HttpOnly cookies for session management.
// This is done here only to fulfill the explicit mock requirement.

const AuthContext = createContext(null);

const initialState = {
  isAuthenticated: false,
  user: null, // { role: 'admin' | 'agent', data: {} }
  loading: true
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('auth_token', JSON.stringify(action.payload));
      return { ...state, isAuthenticated: true, user: action.payload, loading: false };
    case 'LOGOUT':
      localStorage.removeItem('auth_token');
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
    const stored = localStorage.getItem('auth_token');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        dispatch({ type: 'INIT', payload: { isAuthenticated: true, user } });
      } catch (e) {
        dispatch({ type: 'INIT', payload: { isAuthenticated: false, user: null } });
      }
    } else {
      dispatch({ type: 'INIT', payload: { isAuthenticated: false, user: null } });
    }
  }, []);

  const loginAdmin = async (email, password) => {
    if (email === 'admin@delivery.com' && password === 'admin123') {
      const user = { role: 'admin', data: { name: 'Admin User', email } };
      dispatch({ type: 'LOGIN', payload: user });
      return true;
    }
    throw new Error('Invalid credentials');
  };

  const loginAgent = async (phone, otp) => {
    if (otp === '1234') {
      const user = { role: 'agent', data: { name: 'Agent Test', phone } };
      dispatch({ type: 'LOGIN', payload: user });
      return true;
    }
    throw new Error('Invalid OTP');
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, loginAdmin, loginAgent, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
