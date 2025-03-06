
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { setIsMultiSigWalletConnected } = useAuth();
  
  const handleConnectWallet = () => {
    // In a real implementation, this would connect to an existing wallet
    setIsMultiSigWalletConnected(true);
    navigate('/register-credential');
  };
  
  const handleCreateMultiSig = () => {
    // This would redirect to a multi-sig creation flow in a real implementation
    navigate('/create-multisig');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-4xl w-full text-center mb-12">
        <div className="flex justify-center mb-6">
          <Shield className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Cerberus</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Blockchain-based Accreditation and Verification System
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <Card className="flex flex-col h-full border border-border hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Key className="h-10 w-10 text-primary" />
              </div>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>
                Connect your existing wallet to access the Cerberus verification system
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">
                Access your existing credentials and manage your blockchain identity
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleConnectWallet}>
                Connect Wallet
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="flex flex-col h-full border border-border hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <CardTitle>Create Multi-Sig Wallet</CardTitle>
              <CardDescription>
                Set up a new multi-signature wallet for enhanced security
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">
                Establish a wallet requiring multiple signatures for credential management
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                variant="outline"
                onClick={handleCreateMultiSig}
              >
                Create Multi-Sig
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <div className="text-muted-foreground text-sm mt-auto">
        © {new Date().getFullYear()} Cerberus - Secure Blockchain Verification
      </div>
    </div>
  );
};

export default HomePage;
