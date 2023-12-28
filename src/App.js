import './App.css';
import {BrowserRouter,Navigate,Routes, Route} from "react-router-dom"

import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import ChatApp from './components/ChatApp';
import Registration from './components/Registration';
import ChatSelectionPage from './components/ChatSelectionPage';
import ChatPage from './components/ChatPage';
import ForgotPassword from './components/forgotPassword';
import { useId } from './other/IdContext';
import MyComponent from './components/EmojiPicker/Emoji2';



function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const { receiverId, updateReceiverId, senderId, updateSenderId ,login} = useId();
  const storedAuth = localStorage.getItem('authenticated');
  const user_id = localStorage.getItem('user_id');


  useEffect(() => {
    
    console.log("storedAuth",storedAuth)
    if (storedAuth) {
      console.log("aaa",authenticated)
      setAuthenticated(true)
      updateSenderId(user_id)
      login(user_id)
    }

  }, []);

  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />}/>
        <Route path="/login" element={<Login></Login>}/>
        <Route path="/chatApp" element={<ChatApp></ChatApp>}/>
        <Route path="/emoji" element={<MyComponent/>}/>
        <Route path="/forgotPassword" element={<ForgotPassword></ForgotPassword>}/>
        
        <Route path="/register" element={ <Registration></Registration>}/>
        <Route path="/chatPage" element={  storedAuth ?<ChatPage></ChatPage> :  <Navigate to="/login" />}/>
        <Route path="/chatSelectionPage" element={ storedAuth ? <ChatSelectionPage> </ChatSelectionPage> : <Navigate to="/login" />}/>
       
      </Routes>
   </BrowserRouter>
  );
}

export default App;
