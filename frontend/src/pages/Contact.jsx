import React, { useState } from 'react';
import axios from 'axios';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const API_URL = import.meta.env.VITE_API_URL;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            await axios.post(`${API_URL}/api/contact`, formData);
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <div className="section container">
            <div style={{ maxWidth: '600px', margin: '0 auto', background: '#121212', padding: '40px', borderRadius: '10px' }}>
                <h1 className="text-center" style={{ marginBottom: '30px' }}>Get In <span className="text-accent">Touch</span></h1>

                {status === 'success' && <div style={{ background: 'green', color: 'white', padding: '10px', marginBottom: '20px', borderRadius: '5px' }}>Message sent successfully!</div>}
                {status === 'error' && <div style={{ background: 'red', color: 'white', padding: '10px', marginBottom: '20px', borderRadius: '5px' }}>Failed to send message.</div>}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Message</label>
                        <textarea name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={status === 'sending'}>
                        {status === 'sending' ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
