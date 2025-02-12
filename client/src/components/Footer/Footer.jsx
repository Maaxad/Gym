import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaDribbble, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h6 className="footer-heading">Information</h6>
          <p className="footer-text">
          Gym Hell: Personalized workouts, expert instructors, and custom nutrition plans designed to help you reach your full potential. Subscribe and start your transformation today!
          </p>
        </div>
        <div className="footer-section">
          <h6 className="footer-heading">Quick Links</h6>
          <ul className="footer-links">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/plans">Plans</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h6 className="footer-heading">Support</h6>
          <ul className="footer-links">
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/help">Help Center</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h6 className="footer-heading">Contact</h6>
          <ul className="footer-links">
            <li><a href="mailto:info@betterfit.com">info@betterfit.com</a></li>
            <li><a href="tel:+15551234567">+1 (555) 123-4567</a></li>
          </ul>
        </div>
      </div>
      <hr className="footer-divider" />
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="social-icons-wrapper">
            <ul className="social-icons">
              <li>
                <a href="#" className="social-icon">
                  <FaFacebook />
                </a>
              </li>
              <li>
                <a href="#" className="social-icon">
                  <FaTwitter />
                </a>
              </li>
              <li>
                <a href="#" className="social-icon">
                  <FaDribbble />
                </a>
              </li>
              <li>
                <a href="#" className="social-icon">
                  <FaLinkedin />
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-copyright-wrapper">
            <p className="footer-copyright">
              Copyright &copy; 2024 All Rights Reserved by{' '}
              <Link to="/">Gym Hell</Link>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;