import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <span className="logo-icon">⚛️</span>
          <span className="logo-text">React & Redux Portal</span>
        </Link>

        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Home
            </Link>
          </li>
          <li className="nav-item dropdown">
            <span className="nav-link dropdown-toggle">
              Learning 📚
            </span>
            <ul className="dropdown-menu">
              <li>
                <Link 
                  to="/react-notes" 
                  className={`dropdown-link ${isActive('/react-notes') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  React Notes
                </Link>
              </li>
              <li>
                <Link 
                  to="/redux-notes" 
                  className={`dropdown-link ${isActive('/redux-notes') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Redux Notes
                </Link>
              </li>
            </ul>
          </li>
          <li className="nav-item dropdown">
            <span className="nav-link dropdown-toggle">
              Demos 💻
            </span>
            <ul className="dropdown-menu">
              <li>
                <Link 
                  to="/counter" 
                  className={`dropdown-link ${isActive('/counter') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Counter
                </Link>
              </li>
              <li>
                <Link 
                  to="/todos" 
                  className={`dropdown-link ${isActive('/todos') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Todo List
                </Link>
              </li>
              <li>
                <Link 
                  to="/users" 
                  className={`dropdown-link ${isActive('/users') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  User Management
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
