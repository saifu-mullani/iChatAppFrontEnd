import React, { useState } from 'react';
import './RegistrationPage.css'; // Import your CSS file for styling
import {UserService}  from '../../services/User'
import {useNavigate} from 'react-router-dom';

 

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile: '',
    email: '',
    password: '',
    confirm_password: '',
    age: '',
  });

  const [registrationStatus, setRegistrationStatus] = useState(null);
  const navigate = useNavigate();



  const [passwordError, setPasswordError] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Add your registration logic here
    if (formData.password !== formData.confirm_password) {
        setPasswordError('Passwords do not match');
        return;
      }
    console.log('Form data submitted:', formData);
    let registerUserResp = await UserService.registerUser(formData)
    console.log("registerUser",registerUserResp)
    if (registerUserResp.status === "success") {
        setRegistrationStatus('Registration successful!');
        redirectToLogin();
      } else if (registerUserResp.status === "fail" && registerUserResp.error === "Duplicate User Error") {
        setRegistrationStatus('User is already registered. Please click on login');
      } else {
        setRegistrationStatus('Registration failed. Please try again.');
      }
      setTimeout(() => {
        setRegistrationStatus(null);
      }, 5000);
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
      handleSubmit(e)
    }
    } 
    
  }
  const redirectToLogin = ()=>{
    setTimeout(() => {
      navigate('/login');
    }, 2000);

  }

  return (
    <div className="registration-container">
      <h2>Registration Page</h2>

      {registrationStatus && <p className={`registration-status ${registrationStatus === 'Registration successful!' ? 'success' : 'error'}`}>{registrationStatus}</p>}

      <form onSubmit={validatePassword}>
        <div className="form-group">
          <label>
            First Name:
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              placeholder="Enter your first name"
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Last Name:
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              placeholder="Enter your last name"
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Mobile:
            <input
              type="text"
              name="mobile"
              maxlength="10"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Enter your email id"
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Age:
            <input
              type="number"
              name="age"
              value={formData.age}
              placeholder="Enter your age"
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Confirm Password:
            <input
              type="password"
              name="confirm_password"
              placeholder="Enter confirm password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
             {passwordError && <p className="error-message">{passwordError}</p>}
          </label>
        </div>
       
        <div className="form-group">
          <button className="button" type="submit">Register</button>
          <button className="button" type="button" onClick={redirectToLogin}>Log In</button>
        </div>
      </form>
      
    </div>
  );
};

export default RegistrationPage;
