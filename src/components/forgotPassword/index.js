import React, { useState } from 'react';
import axios from 'axios';
import {UserService}  from '../../services/User'
import {useNavigate} from 'react-router-dom';

const ForgotPassword = () => {



  const [username,setUsername] = useState("")
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id : "",
    password: '',
    confirm_password: '',
    otp:""
  });
  const [showResetPassword,setShowResetPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('');

  const handleSendOtp = async () => {
    try {
        
        let forgotPasswordResp = await UserService.forgotPassword({user_id : username})
        console.log("forgotPasswordResp",forgotPasswordResp)
        if(forgotPasswordResp.status === "success"){
            setShowResetPassword(true)
            return alert("OTP Sent on Email")
        }
        return alert("Failed to send OTP ")
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleResetPassword = async () => {
    try {
        console.log("formaData",formData,username)
        let forgotPasswordResp = await UserService.resetPassword(formData)
        console.log("forgotPasswordResp",forgotPasswordResp)
        if(forgotPasswordResp.status === "success"){
            alert(forgotPasswordResp.result)
            navigate('/login');
            return true
        }
        return alert(forgotPasswordResp.error)
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      ['user_id']:username
    });

 
    
    let cfm_val = name === 'password' ? formData.confirm_password : formData.password

    if (name === 'password' || name === 'confirm_password') {
        setPasswordError(
            cfm_val !== value
            ? 'Passwords do not match'
            : ''
        );
      }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
        

        { showResetPassword ?
            ( <>
                <label>
                Enter OTP:
                <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
                />
                </label>
                <label>
                New Password:
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                </label>
                <label>
               Confirm:
                <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                />
                </label>
                {passwordError && <p className="error-message">{passwordError}</p>}
                <button onClick={handleResetPassword}>Reset Password</button>
                </>
            ) : 
            (
                <>
                <label> 
                         User Id: <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                </label>
                <button onClick={handleSendOtp}>Send Otp</button>
                </>
            ) 
        }
     
    </div>
  );
};

export default ForgotPassword;
