
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
} from "@mui/material";
import { usePopup } from "../context/PopupContext";
import { useAuth } from "../context/AuthContext";
import QrCodeGenerator from "./QrCodeGenerator";
import { BlockchainInteractionService, ContractFunction } from "../utils/BlockchainInteractionService";
import { getErrorMessage } from "../utils/helperFunctions";
import VerifiedIcon from '@mui/icons-material/Verified';
import FingerprintIcon from '@mui/icons-material/Fingerprint';

const RegisterCredential = () => {
  const [merkleRoot, setMerkleRoot] = useState("");
  const [merkleTreeHeight, setMerkleTreeHeight] = useState("");
  const [numberOfCredentials, setNumberOfCredentials] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const { openPopup } = usePopup();
  const { isMultiSigWalletConnected } = useAuth();

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
        <Grid container spacing={4} justifyContent="center">
          {/* Left column - QR Code Scanner */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                height: "100%",
                backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
              }}
            >
              <Box sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <FingerprintIcon sx={{ fontSize: 32, color: "#007BFF", mr: 1 }} />
                  <Typography variant="h5" fontWeight="700" color="#333D4B">
                    Credential Scanner
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                <QrCodeGenerator
                  universityAddress={
                    isMultiSigWalletConnected
                      ? BlockchainInteractionService.multiSigWalletAddress
                      : BlockchainInteractionService.signer.address
                  }
                  setMerkleRoot={setMerkleRoot}
                  setMerkleTreeHeight={setMerkleTreeHeight}
                  setNumberOfLeaves={setNumberOfCredentials}
                />
              </Box>
            </Paper>
          </Grid>
          
          {/* Right column - Credential Registration */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={3}
              sx={{
                borderRadius: 4,
                height: "100%",
                backgroundImage: "linear-gradient(to right, #ffffff, #fafbfc)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <VerifiedIcon sx={{ fontSize: 32, color: "#007BFF", mr: 1 }} />
                  <Typography variant="h5" fontWeight="700" color="#333D4B">
                    Credential Registration
                  </Typography>
                </Box>
                <Divider sx={{ mb: 4 }} />
                
                <Box sx={{ mb: 4 }}>
                  {/* Credential Details */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      mb: 3,
                      borderRadius: 2,
                      backgroundColor: "rgba(255,255,255,0.8)",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="600" color="#333D4B" gutterBottom>
                      Credential Details
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="body2" color="#555" fontWeight="500">
                            Merkle Root
                          </Typography>
                          <Chip
                            label={merkleRoot ? `${merkleRoot.substring(0, 10)}...` : "Not Set"}
                            variant={merkleRoot ? "filled" : "outlined"}
                            size="small"
                            color={merkleRoot ? "primary" : "default"}
                            sx={{ fontFamily: "monospace" }}
                          />
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="body2" color="#555" fontWeight="500">
                            Tree Height
                          </Typography>
                          <Chip
                            label={merkleTreeHeight || "Not Set"}
                            variant={merkleTreeHeight ? "filled" : "outlined"}
                            size="small"
                            color={merkleTreeHeight ? "primary" : "default"}
                          />
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="body2" color="#555" fontWeight="500">
                            Number of Credentials
                          </Typography>
                          <Chip
                            label={numberOfCredentials || "Not Set"}
                            variant={numberOfCredentials ? "filled" : "outlined"}
                            size="small"
                            color={numberOfCredentials ? "primary" : "default"}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
                
                {/* Registration Button */}
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!merkleRoot || isRegistering}
                    size="large"
                    onClick={registerCredential}
                    startIcon={isRegistering ? <CircularProgress size={20} color="inherit" /> : <VerifiedIcon />}
                    sx={{
                      py: 1.5,
                      px: 4,
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
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RegisterCredential;
