import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <Video size={20} />
            <span>FIRA<span className="text-accent">OL</span></span>
          </Link>
        </div>
        <p className="footer-copyright">
          &copy; {year} Firaol Adane · Video Editor · All rights reserved.
        </p>
        <div className="footer-links">
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/services">Services</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login" className="footer-admin">Admin</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
