import React from 'react';

const Footer = () => {
    return (
        <footer style={{ padding: '40px 0', textAlign: 'center', backgroundColor: '#000', borderTop: '1px solid #222' }}>
            <p style={{ color: '#666' }}>&copy; {new Date().getFullYear()} Video Editor Portfolio. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
