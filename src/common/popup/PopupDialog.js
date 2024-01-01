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
  const [open, setOpen] = useState(false);
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
        handleStartChat();
      }
    };

  const handleStartChat = async()=>{
    if(username === ""){
      return alert("Please Enter User ID")
    }
    if(props.currentUser === username){
      return alert("Cannot Chat With Self")
    }
    let fetchUsersResp = await UserService.fetchUsers(`user_id=${username}`)
    if(fetchUsersResp.status === "success" && fetchUsersResp.result.length){
      console.log(fetchUsersResp.result)
      props.handleUserSelect(username)
      props.setChatMememberList([{name:username}])
      setUsername("")
      handleClose()
    }
    else{
      alert("Invalid username! Please try again.")
    }

  }
  return (
    <>
      {/* Button to open the dialog */}
      {/* <Button className="button"  onClick={handleOpen}> */}
      <button className="button" onClick={handleOpen}> New Chat</button>
       
      {/* </Button> */}

      {/* The Dialog component */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Chat</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Enter User Name : 
            <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e)=>{handleKeyPress(e)}}
            required
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* Button to close the dialog */}
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
          <Button onClick={handleStartChat} variant="outlined">
            Start Chat
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PopupDialog;
