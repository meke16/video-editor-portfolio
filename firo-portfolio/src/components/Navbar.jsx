import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Video } from 'lucide-react';
import './Navbar.css'; // We'll add some specific nav styles inline or in index.css

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);

    // Close menu when route changes
    React.useEffect(() => {
        setIsOpen(false);
    }, [location]);

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="logo">
                    <Video className="logo-icon" size={28} />
                    <span>FIRA <span className='text-green-700'>'</span> <span className="text-accent">OL</span></span>
                </Link>

                <div className="menu-icon" onClick={toggleMenu}>
                    {isOpen ? <X size={30} /> : <Menu size={30} />}
                </div>

                <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
                    <li><NavLink to="/" end>Home</NavLink></li>
                    <li><NavLink to="/portfolio">Portfolio</NavLink></li>
                    <li><NavLink to="/services">Services</NavLink></li>
                    <li><NavLink to="/about">About</NavLink></li>
                    <li><NavLink to="/contact">Contact</NavLink></li>
                </ul>
            </div>
        </nav>
    );
};

// Add this CSS to index.css or a separate file. 
// For simplicity in this tool usage, I'm appending the styles here in a comment 
// but actually I should have put them in index.css. 
// I'll update index.css in a subsequent step or just rely on the global CSS plus this structure.
// Let's rely on global CSS + inline for now if complex.
// Actually, I'll add specific Nav styles to a new CSS file.

export default Navbar;
