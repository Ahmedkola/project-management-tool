// frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  // --- State ---
  // We store the token and user info in state.
  // We initialize it by checking localStorage to see if the user was already logged in.
  const [token, setToken] = useState(() => localStorage.getItem('accessToken'));
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      return jwtDecode(storedToken);
    }
    return null;
  });

  // --- Login Function ---
  const login = (newToken) => {
    const decodedUser = jwtDecode(newToken);
    localStorage.setItem('accessToken', newToken);
    setToken(newToken);
    setUser(decodedUser);
  };

  // --- Logout Function ---
  const logout = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
    setUser(null);
  };

  // 3. Provide the context value to children
  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;