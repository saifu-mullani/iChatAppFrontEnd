// Import necessary modules from Material-UI
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { UserService } from '../../services/User';
// import "./popup.css"

// Create a functional component
const PopupDialog = (props) => {
  // State to manage the open/closed state of the dialog
  const [open, setOpen] = useState(true);
    const [username,setUsername] = useState("")

  // Function to handle opening the dialog
  const handleOpen = () => {
    setOpen(true);
  };

  // Function to handle closing the dialog
  const handleClose = () => {
    setOpen(false);
  };

  const handleKeyPress = (event) => {
    console.log("handleKeyPress",event)
      if (event.key === 'Enter') {
        // Handle sending the message here
      }
    };

  return (
    <>
      {/* Button to open the dialog */}
      {/* <Button className="button"  onClick={handleOpen}> */}
       
      {/* </Button> */}

      {/* The Dialog component */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{props.dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {/* Please Enter User Name : 
            <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e)=>{handleKeyPress(e)}}
            required
            /> */}
            {props.dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
        {props.dialogActions}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PopupDialog;
