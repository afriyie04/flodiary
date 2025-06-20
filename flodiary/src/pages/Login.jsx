import React from 'react'
import './Login.css'; // Assuming you have a CSS file for styles

const Login = () => {
  return (
    <>
    <div className='login-container'>
        <div className='left-section'>
            <img src='/authentification.svg' alt="Illustration" />
    </div>

        <div className='right-section'>
            <div className="login-box">
          <h2>Welcome to <span className="brand-name">FloDiary</span></h2>
          <form>
            <input type="text" placeholder="Username" required />
            <input type="password" placeholder="Password" required />
            <button type="submit" className='btn'>LOG IN</button>
          </form>
          <p className="register-link">Do not have an account? <a href="#">Create one!</a></p>
        </div> 
    </div>
    </div>
    </>
  )
}

export default Login