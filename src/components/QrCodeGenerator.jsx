
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Divider
} from '@mui/material';

const QrCodeGenerator = ({ universityAddress, setMerkleRoot, setMerkleTreeHeight, setNumberOfLeaves }) => {
  const [demoMerkleRoot, setDemoMerkleRoot] = useState('');
  const [demoTreeHeight, setDemoTreeHeight] = useState('');
  const [demoNumberOfCredentials, setDemoNumberOfCredentials] = useState('');

  // This is a simplified mock implementation of QR code generation
  const handleGenerateQR = () => {
    // In a real app, this would generate a QR code based on the university address
    // For now, we'll just set some example values
    const mockMerkleRoot = '0x' + Math.random().toString(16).substr(2, 40);
    setDemoMerkleRoot(mockMerkleRoot);
    setDemoTreeHeight('4');
    setDemoNumberOfCredentials('15');
  };

  const handleAcceptData = () => {
    setMerkleRoot(demoMerkleRoot);
    setMerkleTreeHeight(demoTreeHeight);
    setNumberOfLeaves(demoNumberOfCredentials);
  };

  return (
    <Card
      sx={{
        width: '90%',
        maxWidth: 500,
        padding: 3,
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#FFFFFFD9',
        backdropFilter: 'blur(10px)',
        textAlign: 'center',
      }}
    >
      <CardContent>
        <Typography variant="h5" fontWeight="bold" color="#333D4B" gutterBottom>
          QR Code Scanner
        </Typography>
        <Divider sx={{ marginY: 2 }} />
        
        <Typography variant="body1" color="#555" gutterBottom>
          <strong>University Address:</strong> {universityAddress}
        </Typography>
        
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#007BFF',
            color: '#FFF',
            fontWeight: 'bold',
            padding: '10px 20px',
            borderRadius: '8px',
            textTransform: 'none',
            mt: 2,
            mb: 3,
            '&:hover': { backgroundColor: '#0056b3' },
          }}
          onClick={handleGenerateQR}
        >
          Generate Demo QR Data
        </Button>

        {demoMerkleRoot && (
          <Box>
            <TextField
              label="Merkle Root"
              value={demoMerkleRoot}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Merkle Tree Height"
              value={demoTreeHeight}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Number of Credentials"
              value={demoNumberOfCredentials}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#28a745',
                color: '#FFF',
                fontWeight: 'bold',
                padding: '10px 20px',
                borderRadius: '8px',
                textTransform: 'none',
                mt: 2,
                '&:hover': { backgroundColor: '#218838' },
              }}
              onClick={handleAcceptData}
            >
              Accept Data
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default QrCodeGenerator;
