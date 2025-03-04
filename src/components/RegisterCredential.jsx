
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { usePopup } from "../context/PopupContext";
import { useAuth } from "../context/AuthContext";
import QrCodeGenerator from "./QrCodeGenerator";
import { BlockchainInteractionService, ContractFunction } from "../utils/BlockchainInteractionService";
import { getErrorMessage } from "../utils/helperFunctions";

const RegisterCredential = () => {
  const [merkleRoot, setMerkleRoot] = useState("");
  const [merkleTreeHeight, setMerkleTreeHeight] = useState("");
  const [numberOfCredentials, setNumberOfCredentials] = useState("");

  const { openPopup } = usePopup();
  const { isMultiSigWalletConnected } = useAuth();

  const registerCredential = async () => {
    if (!merkleRoot) {
      openPopup("Cannot Register", "Merkle tree not constructed.");
      return;
    }

    try {
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
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#F9FAFB",
        padding: 4,
      }}
    >
      {/* QR Code Scanner Section */}
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

      {/* Merkle Information & Register Button */}
      <Card
        sx={{
          width: "90%",
          maxWidth: 500,
          padding: 3,
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#FFFFFFD9",
          backdropFilter: "blur(10px)",
          textAlign: "center",
          marginTop: 4,
        }}
      >
        <CardContent>
          <Typography variant="h5" fontWeight="bold" color="#333D4B" gutterBottom>
            Credential Registration
          </Typography>
          <Divider sx={{ marginY: 2 }} />
          <Typography variant="body1" color="#555">
            <strong>Merkle Root:</strong> {merkleRoot || "Not Set"}
          </Typography>
          <Typography variant="body1" color="#555">
            <strong>Merkle Tree Height:</strong> {merkleTreeHeight || "Not Set"}
          </Typography>
          <Typography variant="body1" color="#555">
            <strong>Number of Credentials:</strong> {numberOfCredentials || "Not Set"}
          </Typography>
          <Divider sx={{ marginY: 2 }} />

          {/* Register Button */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#007BFF",
              color: "#FFF",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#0056b3" },
            }}
            onClick={registerCredential}
          >
            Register Credential
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterCredential;
