import React from 'react'

const Signup = () => {
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
            
            <input type="text" placeholder="First name" required />
            <input type="text" placeholder="Last name" required />
            <input type="text" placeholder="Username" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit" className='btn'>SIGNUP</button>
          </form>
         
        </div> 
    </div>
    </div>
    </>
  )
}

export default Signup