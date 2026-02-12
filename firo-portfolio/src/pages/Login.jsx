import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithEmail, registerWithEmail } from '../services/firebase';
import { Video, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <Link to="/" className="login-logo">
            <Video size={32} />
            <span>FIRA<span className="text-accent">OL</span></span>
          </Link>
          <h1 className="login-title">Admin Login</h1>
          <p className="login-subtitle">Sign in to manage your portfolio</p>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <Mail size={20} className="login-field-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="login-field">
              <Lock size={20} className="login-field-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <Link to="/" className="login-back">
            ← Back to portfolio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
