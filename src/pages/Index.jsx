
import React from 'react';
import { PopupProvider } from '../context/PopupContext';
import { AuthProvider } from '../context/AuthContext';
import RegisterCredential from '../components/RegisterCredential';

const Index = () => {
  return (
    <AuthProvider>
      <PopupProvider>
        <RegisterCredential />
      </PopupProvider>
    </AuthProvider>
  );
};

export default Index;
