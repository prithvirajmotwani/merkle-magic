
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isMultiSigWalletConnected, setIsMultiSigWalletConnected] = useState(false);
  
  // This is a simplified version, you would typically have more auth-related state and functions
  const value = {
    isMultiSigWalletConnected,
    setIsMultiSigWalletConnected,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
