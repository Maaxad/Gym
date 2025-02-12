import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './navbar.css';
import Logo from '../../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link to="/" className="logo-link">
          <img src={Logo} alt="BetterFit Logo" className="logo-image" />
          <div className="logo-text">Gym Hell</div>
        </Link>
      </div>
      <ul className="nav-links">
        <li><NavLink to="/programs" activeClassName="active-link">Programs</NavLink></li>
        <li><NavLink to="/nutrition" activeClassName="active-link">Healthy Diet</NavLink></li>
        <li><NavLink to="/membership" activeClassName="active-link">Become A Member</NavLink></li>
        <li><NavLink to="/login" activeClassName="active-link">Log In</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
