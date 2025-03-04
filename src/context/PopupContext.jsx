
import React, { createContext, useContext, useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Box
} from '@mui/material';

const PopupContext = createContext();

export const usePopup = () => useContext(PopupContext);

export const PopupProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const openPopup = (newTitle, newMessage, isLoading = false) => {
    setTitle(newTitle);
    setMessage(newMessage);
    setLoading(isLoading);
    setOpen(true);
  };

  const closePopup = () => {
    setOpen(false);
  };

  return (
    <PopupContext.Provider value={{ openPopup, closePopup }}>
      {children}
      <Dialog open={open} onClose={!loading ? closePopup : undefined}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <DialogContentText style={{ whiteSpace: 'pre-line' }}>
              {message}
            </DialogContentText>
          )}
        </DialogContent>
        {!loading && (
          <DialogActions>
            <Button onClick={closePopup} color="primary">
              Close
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </PopupContext.Provider>
  );
};
