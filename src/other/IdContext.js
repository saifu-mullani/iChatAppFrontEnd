import React, { createContext, useContext, useState } from 'react';

// Create the context
const IdContext = createContext();

// Create a context provider component
export const IdProvider = ({ children }) => {
  const [receiverId, setReceiverId] = useState(null);
  const [senderId, setSenderId] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  const login = (user_id) => {
    // Add your authentication logic here
    localStorage.setItem('authenticated', 'true');
    localStorage.setItem('user_id', user_id);
    setAuthenticated(true);
  };

  const logout = () => {
    console.log("logging Out",senderId)
    localStorage.removeItem('authenticated');
    localStorage.removeItem('user_id');
    setAuthenticated(false);
    setSenderId("");
  };

  // Functions to update the receiverId and senderId individually
  const updateReceiverId = (newReceiverId) => {
    setReceiverId(newReceiverId);
  };

  const updateSenderId = (newSenderId) => {
    console.log("updateSenderId")
    setSenderId(newSenderId);
  };

  return (
    <IdContext.Provider value={{  receiverId, updateReceiverId, senderId, updateSenderId ,login, logout ,authenticated}}>
      {children}
    </IdContext.Provider>
  );
};

// Create a custom hook to access the context values
export const useId = () => {
  const context = useContext(IdContext);

  if (!context) {
    throw new Error('useId must be used within an IdProvider');
  }

  return context;
};
