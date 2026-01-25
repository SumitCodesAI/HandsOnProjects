import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>React & Redux Portal</h3>
          <p>Your comprehensive learning resource for modern web development</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>React Documentation</li>
            <li>Redux Toolkit Docs</li>
            <li>GitHub Repository</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Learn More</h4>
          <ul>
            <li>React Hooks</li>
            <li>Redux Best Practices</li>
            <li>State Management</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 React & Redux Learning Portal. Built with ❤️ for learners</p>
      </div>
    </footer>
  );
};

export default Footer;
