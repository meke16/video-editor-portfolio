import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail, registerWithEmail } from '../services/firebase';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await loginWithEmail(formData.email, formData.password);
            localStorage.setItem('isAdminLoggedIn', 'true');
            navigate('/admin');
        } catch (err) {
            if (err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-credential') {
                try {
                    await registerWithEmail(formData.email, formData.password);
                    localStorage.setItem('isAdminLoggedIn', 'true');
                    navigate('/admin');
                    return;
                } catch (registerError) {
                    if (registerError?.code === 'auth/email-already-in-use') {
                        setError('Incorrect password for this email.');
                        return;
                    }
                    if (registerError?.code === 'auth/weak-password') {
                        setError('Password must be at least 6 characters.');
                        return;
                    }
                    setError(registerError?.message || 'Unable to create user');
                    return;
                }
            }
            if (err?.code === 'auth/wrong-password') {
                setError('Incorrect password for this email.');
                return;
            }
            if (err?.code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
                return;
            }
            if (err?.code === 'auth/too-many-requests') {
                setError('Too many attempts. Try again later.');
                return;
            }
            setError(err?.message || 'Invalid email or password');
        }
    };

    return (
        <div style={{ height: 'calc(100vh - 80px - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '400px', background: '#121212', padding: '40px', borderRadius: '10px' }}>
                <h2 className="text-center" style={{ marginBottom: '30px' }}>Admin Login</h2>

                {error && <div style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
