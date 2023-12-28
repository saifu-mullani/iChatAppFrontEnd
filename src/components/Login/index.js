
import React, { useState } from 'react'
import {UserService}  from '../../services/User'
import {useNavigate} from 'react-router-dom';
import { useId } from '../../other/IdContext';




export default function Login() {
  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")
  const [loginStatus,setLoginStatus] = useState(null)
  const navigate = useNavigate();
  const { receiverId, updateReceiverId, senderId, updateSenderId ,login} = useId();

  const handleLogin =async (e)=>{
    e.preventDefault()
    console.log(e)

    let loginResp = await UserService.login(username,password)
    console.log("loginResp",loginResp)
    if(loginResp.status === "success"){
      login(username)
      setLoginStatus("Logged in Successfully")
      updateSenderId(username)
      setTimeout(() => {
        navigate('/chatPage');;
      }, 1000);
    
    }else if(loginResp.error ==="Bad Password"){
      setLoginStatus("Username/Password Incorrect")
    }
    else if(loginResp.error ==="Not registered. Please Register first"){
      setLoginStatus("Not registered. Please Register first. Click on Register!!!")
    }
    else{
      setLoginStatus("Something Went Wrong !!!")
    }
    setTimeout(() => {
      setLoginStatus(null);
    }, 5000);
    
  }
  const redirectToRegister = ()=>{
    console.log("redirectToRegister")
    navigate('/register');
  }

  const handleResetPassword = async ()=>{
    console.log("redirectToRegister")
    navigate('/forgotPassword');
  }

  return (
  <div className="registration-container">
      <h1>Login</h1>
      {loginStatus && <p className={`login-status ${loginStatus === 'Logged in Successfully' ? 'success' : 'error'}`}>{loginStatus}</p>}
      <form onSubmit={handleLogin}>
        <div  className="form-group">
        <label>

          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
        </label>
        </div>
        <br />
        <div className="form-group">

        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </label>
          </div>
        <br />

        <button className="button" type="submit">Log In </button>
        <button className="button" type="submit" onClick={redirectToRegister}>Register</button>
        <button className="button" type="submit" onClick={handleResetPassword}>Reset Password</button>
        
        

      </form>
    </div>
  )
}
