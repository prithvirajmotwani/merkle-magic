
import React from 'react';
import { PopupProvider } from '../context/PopupContext';
import { AuthProvider } from '../context/AuthContext';
import RegisterCredential from '../components/RegisterCredential';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  return (
    <AuthProvider>
      <PopupProvider>
        <div className="p-4 md:p-6">
          <div className="mb-6 flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-bold ml-4">Register Credential</h1>
          </div>
          <RegisterCredential />
        </div>
      </PopupProvider>
    </AuthProvider>
  );
};

export default Index;
