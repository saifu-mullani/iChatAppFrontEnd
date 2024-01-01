import React, { useState } from 'react';
import axios from 'axios';
import {UserService}  from '../../services/User'
import {useNavigate} from 'react-router-dom';
import("./forgotPassword.css")
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
  const [disableButton,setDisableButton] = useState(true)
  const [passwordError, setPasswordError] = useState('');
  const time  = 60*1000;
  const [count , setCount] = useState(time) 
  const [isDivHidden, setDivHidden] = useState(false);

  const handleSendOtp = async () => {
    try {
        
        let forgotPasswordResp = await UserService.forgotPassword({user_id : username})
        console.log("forgotPasswordResp",forgotPasswordResp)
        if(forgotPasswordResp.status === "success"){
            setShowResetPassword(true)
            setDisableButton(true)
            setTimeout(()=>{
              setDisableButton(false)
              clearInterval(intervalId);
              setDivHidden(true)
            },time)
            const intervalId =  setInterval(()=>{
              setCount((prevCounter) => prevCounter - 1000)
              console.log(count)
            },1000)
            return alert("OTP Sent on Email")
        }
        return alert(forgotPasswordResp.error)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const validatePassword = (e)=> {
    e.preventDefault();
    if(formData.password){
      console.log("Yes")
      var passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordPattern.test(formData.password)) {
        console.log("Failed Valid")
        setPasswordError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.');
    }else{
      console.log("DOne")
      handleResetPassword(e)
    }
    } 
    
  }

  const handleResetPassword = async () => {
    try { 
      if(!(Object.values(formData).find((curr)=> curr === "") === "")){
        let forgotPasswordResp = await UserService.resetPassword(formData)
        if(forgotPasswordResp.status === "success"){
          alert(forgotPasswordResp.result)
          navigate('/login');
          return true
        }
        return alert(forgotPasswordResp.error)
      }
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
                <button onClick={validatePassword}>Reset Password</button>
                <button className={`${disableButton ? 'disabled':""}`} onClick={handleSendOtp} disabled={disableButton}>Re-send Otp</button>
                <div style={{ display: isDivHidden ? 'none' : 'block' }}>Resend OTP after {count/1000} seconds </div> 
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
