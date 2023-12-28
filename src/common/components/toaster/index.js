import React, { useState, useEffect } from 'react';
import './Toaster.css';

const Toaster = ({ toasts, position = 'bottom-right', autoDismissTime = 3000 ,clearToasts}) => {
  const [visibleToasts, setVisibleToasts] = useState([]);

  useEffect(() => {
    if (toasts.length > 0) {
      // Show the new toast
      console.log("autoDismissTime",autoDismissTime)
      setVisibleToasts([...toasts]);
      // Remove the toast after a certain time
      setTimeout(() => {
        setVisibleToasts([]);
        clearToasts()
      }, autoDismissTime);

    }
  }, [toasts,autoDismissTime]);

  return (
    <div className={`toaster-container ${position}`}>
      {visibleToasts.map((toast, index) => (
        <div key={index} className="toast">
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default Toaster;
