
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { usePopup } from "../context/PopupContext";
import { useAuth } from "../context/AuthContext";
import { BlockchainInteractionService, ContractFunction } from "../utils/BlockchainInteractionService";
import { getErrorMessage } from "../utils/helperFunctions";
import VerifiedIcon from '@mui/icons-material/Verified';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DownloadIcon from '@mui/icons-material/Download';

const RegisterCredential = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [merkleRoot, setMerkleRoot] = useState("");
  const [merkleTreeHeight, setMerkleTreeHeight] = useState("");
  const [numberOfCredentials, setNumberOfCredentials] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [qrVersion, setQrVersion] = useState(4);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("M");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTreeConstructed, setIsTreeConstructed] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

  const { openPopup } = usePopup();
  const { isMultiSigWalletConnected } = useAuth();

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const constructMerkleTree = () => {
    if (!selectedFile) {
      openPopup("Error", "Please upload a file first.");
      return;
    }

    // Mock implementation of Merkle tree construction
    const mockMerkleRoot = '0x' + Math.random().toString(16).substr(2, 40);
    const mockTreeHeight = Math.floor(Math.random() * 5) + 3; // Random height between 3 and 7
    const mockCredentials = Math.floor(Math.random() * 20) + 5; // Random number between 5 and 24

    setMerkleRoot(mockMerkleRoot);
    setMerkleTreeHeight(mockTreeHeight.toString());
    setNumberOfCredentials(mockCredentials.toString());
    setIsTreeConstructed(true);
    
    // Move to next step
    setActiveStep(1);
    
    // Show download dialog
    setDownloadDialogOpen(true);
  };

  const downloadQrCode = () => {
    // In a real implementation, this would generate and download a QR code
    openPopup("Success", "QR Code downloaded successfully.");
  };

  const downloadMerkleRoot = () => {
    // In a real implementation, this would download the Merkle root
    const element = document.createElement("a");
    const file = new Blob([merkleRoot], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "merkle-root.txt";
    document.body.appendChild(element);
    element.click();
    openPopup("Success", "Merkle Root downloaded successfully.");
  };

  const registerCredential = async () => {
    if (!merkleRoot) {
      openPopup("Cannot Register", "Merkle tree not constructed.");
      return;
    }

    try {
      setIsRegistering(true);
      openPopup("Processing Transaction", "", true);
      if (isMultiSigWalletConnected) {
        await BlockchainInteractionService.submitTransaction(ContractFunction.registerCredential, [merkleRoot]);
      } else {
        await BlockchainInteractionService.registerCredential(merkleRoot);
      }
      openPopup("Transaction Successful", `Registered credentials with Merkle Root: ${merkleRoot}`);
    } catch (error) {
      openPopup(
        "Transaction Failed",
        `Failed to register credentials. \nReason: ${getErrorMessage(error)}`
      );
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F9FAFB",
        padding: { xs: 2, md: 4 },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            backgroundImage: "linear-gradient(to right, #ffffff, #fafbfc)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="700" color="#333D4B" align="center" gutterBottom>
              Credential Registration System
            </Typography>
            <Typography variant="body1" color="#666" align="center" sx={{ mb: 4 }}>
              Generate QR codes and register credentials on the blockchain
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              <Step>
                <StepLabel>Generate QR Code</StepLabel>
              </Step>
              <Step>
                <StepLabel>Register Credential</StepLabel>
              </Step>
            </Stepper>

            {activeStep === 0 ? (
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <QrCodeIcon sx={{ fontSize: 28, color: "#007BFF", mr: 1 }} />
                        <Typography variant="h6" fontWeight="600" color="#333D4B">
                          QR Code Specifications
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 3 }} />

                      <Typography variant="subtitle2" color="#666" gutterBottom sx={{ mb: 2 }}>
                        Configure QR code specifications for degree and transcript credentials
                      </Typography>

                      <FormControl fullWidth margin="normal">
                        <InputLabel>QR Version</InputLabel>
                        <Select
                          value={qrVersion}
                          label="QR Version"
                          onChange={(e) => setQrVersion(e.target.value)}
                        >
                          {[1, 2, 3, 4, 5, 6].map((version) => (
                            <MenuItem key={version} value={version}>
                              Version {version}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth margin="normal">
                        <InputLabel>Error Correction Level</InputLabel>
                        <Select
                          value={errorCorrectionLevel}
                          label="Error Correction Level"
                          onChange={(e) => setErrorCorrectionLevel(e.target.value)}
                        >
                          <MenuItem value="L">Low (7%)</MenuItem>
                          <MenuItem value="M">Medium (15%)</MenuItem>
                          <MenuItem value="Q">Quartile (25%)</MenuItem>
                          <MenuItem value="H">High (30%)</MenuItem>
                        </Select>
                      </FormControl>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <CloudUploadIcon sx={{ fontSize: 28, color: "#007BFF", mr: 1 }} />
                        <Typography variant="h6" fontWeight="600" color="#333D4B">
                          Upload Credential File
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 3 }} />

                      <Box
                        sx={{
                          border: '2px dashed #ccc',
                          borderRadius: 2,
                          p: 3,
                          textAlign: 'center',
                          mb: 3,
                          backgroundColor: '#f8f9fa',
                          cursor: 'pointer',
                        }}
                        onClick={() => document.getElementById('file-upload').click()}
                      >
                        <input
                          id="file-upload"
                          type="file"
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                        />
                        <CloudUploadIcon sx={{ fontSize: 48, color: '#007BFF', mb: 1 }} />
                        <Typography variant="body1" gutterBottom>
                          {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          JSON, CSV, or TXT files supported
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<AccountTreeIcon />}
                        disabled={!selectedFile}
                        onClick={constructMerkleTree}
                        sx={{
                          py: 1.5,
                          backgroundColor: "#007BFF",
                          textTransform: "none",
                          fontSize: "1rem",
                          fontWeight: "600",
                          borderRadius: 2,
                          boxShadow: "0 4px 14px rgba(0, 123, 255, 0.25)",
                          "&:hover": {
                            backgroundColor: "#0056b3",
                            boxShadow: "0 6px 20px rgba(0, 123, 255, 0.35)",
                          },
                        }}
                      >
                        Construct Merkle Tree
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <AccountTreeIcon sx={{ fontSize: 28, color: "#007BFF", mr: 1 }} />
                        <Typography variant="h6" fontWeight="600" color="#333D4B">
                          Merkle Tree Details
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 3 }} />

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="#666" gutterBottom>
                          Merkle Root
                        </Typography>
                        <TextField
                          value={merkleRoot}
                          fullWidth
                          variant="outlined"
                          size="small"
                          InputProps={{
                            readOnly: true,
                            sx: { fontFamily: 'monospace', fontSize: '0.875rem' }
                          }}
                        />
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="#666" gutterBottom>
                          Tree Height
                        </Typography>
                        <Chip
                          label={merkleTreeHeight}
                          color="primary"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="#666" gutterBottom>
                          Number of Credentials
                        </Typography>
                        <Chip
                          label={numberOfCredentials}
                          color="primary"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<DownloadIcon />}
                            onClick={downloadQrCode}
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                            }}
                          >
                            Download QR
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<DownloadIcon />}
                            onClick={downloadMerkleRoot}
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                            }}
                          >
                            Download Root
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <VerifiedIcon sx={{ fontSize: 28, color: "#007BFF", mr: 1 }} />
                        <Typography variant="h6" fontWeight="600" color="#333D4B">
                          Register on Blockchain
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 3 }} />

                      <Typography variant="body1" paragraph>
                        Register these credentials on the blockchain to create a permanent, tamper-proof record.
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <VerifiedIcon color="success" />
                          <Typography variant="body2">Immutable blockchain record</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <VerifiedIcon color="success" />
                          <Typography variant="body2">Cryptographically secure</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <VerifiedIcon color="success" />
                          <Typography variant="body2">Verifiable by third parties</Typography>
                        </Box>
                      </Box>

                      <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        disabled={!merkleRoot || isRegistering}
                        size="large"
                        onClick={registerCredential}
                        startIcon={isRegistering ? <CircularProgress size={20} color="inherit" /> : <VerifiedIcon />}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          backgroundColor: "#007BFF",
                          textTransform: "none",
                          fontSize: "1rem",
                          fontWeight: "600",
                          boxShadow: "0 4px 14px rgba(0, 123, 255, 0.25)",
                          "&:hover": {
                            backgroundColor: "#0056b3",
                            boxShadow: "0 6px 20px rgba(0, 123, 255, 0.35)",
                          },
                        }}
                      >
                        {isRegistering ? "Registering..." : "Register Credential"}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Box>
        </Paper>
      </Container>

      {/* Download Options Dialog */}
      <Dialog
        open={downloadDialogOpen}
        onClose={() => setDownloadDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <DownloadIcon sx={{ mr: 1, color: "#007BFF" }} />
            Download Options
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Your Merkle tree has been successfully constructed! You can now download:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={downloadQrCode}
              fullWidth
            >
              Download QR Code
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={downloadMerkleRoot}
              fullWidth
            >
              Download Merkle Root
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDownloadDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RegisterCredential;
