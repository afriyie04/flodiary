

// import React from 'react';

// import './Section1.css'; // Assuming you have a CSS file for styles
// // import myImage from '../assets/blooming.svg';
// function Section1() {
//   return (
//     <div className="container">
     

//       <main className="hero">
//         <div className="hero-text">
//           <h1>
//             Track Your Cycle With <span className="highlight">FloDiary</span>
//           </h1>
//           <p>
//             Connect with your campus community to reunite lost items with their owners
//             through our simple, secure platform.
//           </p>
//           <div className="cta-buttons">
//             <button className="primary-button">Get Started</button>
//             <button className="secondary-button">Browse Items</button>
//           </div>
       
//         </div>
//         <div className="hero-image">

//           {/* Reference image from myassets */}
                    
//           <img src='/blooming.svg' alt="Illustration" />
        
//         </div>
//       </main>
//     </div>  
//   );
// }

// export default Section1;



// import React from "react";
// import "./Section1.css";

// export default function Section1() {
//   return (
//     <div className="homepage">
//       <header className="header">
//         <h1 className="logo">Sagittarius</h1>
//         <nav className="nav">
//           <a href="#">Features</a>
//           <a href="#">Why us</a>
//           <a href="#">Blog</a>
//           <a href="#">Testimonials</a>
//         </nav>
//         <div className="auth-buttons">
//           <button className="btn ghost">Log in</button>
//           <button className="btn black">Sign up</button>
//         </div>
//       </header>

//       <main className="main">
//         <h2 className="headline">Know Your Body, <span className="highlight">Own Your Cycle.</span></h2>
//         <p className="subtext">Gain deeper insights into your body’s signals and rhythms.</p>
//         <button className="btn primary">Download Apps</button>

//         <section className="card-section">
//           <div className="card">
//             <h3>Cycle History</h3>
//             <p>Track your cycle and length over months</p>
//           </div>

//           <div className="card">
//             <h3>Day 15</h3>
//             <p>Ovulation Phase</p>
//             <button className="btn primary">Log Period</button>
//           </div>

//           <div className="card">
//             <h3>Community</h3>
//             <p>Connect, share, and learn from others.</p>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }


import React from "react";
import "./Section1.css";
import { Link } from "react-router-dom";
export default function Section1() {
  return (
    <div className="homepage">
      <header className="navbar">
        <div className="logo">FloDiary</div>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#download">Download</a>
        </nav>
        <div className="auth-buttons">
          <Link to="/login" className="btn ghost">Log In</Link>
          <Link to="/signup" className="btn primary">Sign Up</Link>
        </div>
      </header>

      <section className="hero-section full-image">
        <div className="overlay">
          <h1>Know Your Body,<br /><span>Own Your Cycle.</span></h1>
          <p>Track your period, understand your body, and take control of your health.</p>
          <button className="btn primary">Get Started</button>
        </div>
      </section>

      <section id="features" className="features-section minimal">
        <div className="features-elegant-layout">
          <div className="illustration-block">
            {/* <img src="/flower.jpg" alt="Elegant cycle tracking" /> */}
          </div>
          <div className="features-intro">
            <h2>Why CycleSync?</h2>
            <p>Designed to bring you clarity, comfort and control. Our AI-backed features help you tune into your body with confidence.</p>
          </div>
        </div>
        <div className="features-grid elegant">
          <div className="feature-card">
            <h3>Smart Predictions</h3>
            <p>AI-driven forecasts for period, ovulation, and mood tracking with simplicity and accuracy.</p>
          </div>
          <div className="feature-card">
            <h3>Reminders That Matter</h3>
            <p>Get elegant, non-intrusive alerts tailored to your needs and lifestyle.</p>
          </div>
          <div className="feature-card">
            <h3>Insightful Logs</h3>
            <p>Track symptoms beautifully to understand the rhythm of your health and hormones.</p>
          </div>
        </div>
      </section>

      <section id="testimonials" className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial">
            <p>"CycleSync has changed how I understand my body. It's accurate and so easy to use!"</p>
            <strong>- Ama B.</strong>
          </div>
          <div className="testimonial">
            <p>"I love the simplicity and the reminders. I feel more in control of my health."</p>
            <strong>- Nana K.</strong>
          </div>
          <div className="testimonial">
            <p>"The insights I’ve gotten have helped me explain symptoms to my doctor more clearly."</p>
            <strong>- Esi M.</strong>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 FloDiary. All rights reserved.</p>
        <nav className="footer-nav">
          {/* <a href="#features">Features</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#download">Download</a> */}
        </nav>
      </footer>
    </div>
  );
}
