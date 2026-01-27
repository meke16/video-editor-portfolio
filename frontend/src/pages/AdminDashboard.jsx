import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('portfolio');
    const [items, setItems] = useState([]);
    const [services, setServices] = useState([]);
    const [aboutContent, setAboutContent] = useState('');

    // Forms
    const [newItem, setNewItem] = useState({ title: '', description: '', youtubeUrl: '', featured: false });
    const [newService, setNewService] = useState({ title: '', description: '' });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        if (activeTab === 'portfolio') {
            const res = await axios.get('http://localhost:5000/api/portfolio');
            setItems(res.data);
        } else if (activeTab === 'services') {
            const res = await axios.get('http://localhost:5000/api/services');
            setServices(res.data);
        } else if (activeTab === 'about') {
            const res = await axios.get('http://localhost:5000/api/about');
            setAboutContent(res.data.content);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAdminLoggedIn');
        navigate('/login');
    };

    // Handlers
    const addPortfolioItem = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/api/portfolio', newItem);
        setNewItem({ title: '', description: '', youtubeUrl: '', featured: false });
        fetchData();
    };

    const deletePortfolioItem = async (id) => {
        if (window.confirm('Are you sure?')) {
            await axios.delete(`http://localhost:5000/api/portfolio/${id}`);
            fetchData();
        }
    };

    const addService = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/api/services', newService);
        setNewService({ title: '', description: '' });
        fetchData();
    };

    const deleteService = async (id) => {
        if (window.confirm('Are you sure?')) {
            await axios.delete(`http://localhost:5000/api/services/${id}`);
            fetchData();
        }
    };

    const updateAbout = async () => {
        await axios.post('http://localhost:5000/api/about', { content: aboutContent });
        alert('About section updated!');
    };

    return (
        <div className="section container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Admin <span className="text-accent">Panel</span></h1>
                <button onClick={handleLogout} className="btn">Logout</button>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                <button className={`btn ${activeTab === 'portfolio' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('portfolio')}>Portfolio</button>
                <button className={`btn ${activeTab === 'services' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('services')}>Services</button>
                <button className={`btn ${activeTab === 'about' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('about')}>About Me</button>
            </div>

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
                <div>
                    <div style={{ background: '#121212', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
                        <h3>Add New Video</h3>
                        <form onSubmit={addPortfolioItem} style={{ marginTop: '20px' }}>
                            <input placeholder="Title" value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} required />
                            <input placeholder="Video Description" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} required />
                            <input placeholder="YouTube URL" value={newItem.youtubeUrl} onChange={e => setNewItem({ ...newItem, youtubeUrl: e.target.value })} required />
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={newItem.featured} onChange={e => setNewItem({ ...newItem, featured: e.target.checked })} style={{ width: 'auto', marginBottom: 0 }} />
                                Feature on Homepage
                            </label>
                            <button className="btn btn-primary">Add Video</button>
                        </form>
                    </div>

                    <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {items.map(item => (
                            <div key={item.id} style={{ background: '#121212', borderRadius: '8px', padding: '15px' }}>
                                <h4>{item.title}</h4>
                                <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '10px' }}>{item.youtubeUrl}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    {item.featured && <span style={{ color: 'var(--accent-red)' }}>Featured</span>}
                                    <button onClick={() => deletePortfolioItem(item.id)} style={{ color: 'red', background: 'transparent', border: 'none', cursor: 'pointer' }}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
                <div>
                    <div style={{ background: '#121212', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
                        <h3>Add Service</h3>
                        <form onSubmit={addService} style={{ marginTop: '20px' }}>
                            <input placeholder="Service Title" value={newService.title} onChange={e => setNewService({ ...newService, title: e.target.value })} required />
                            <textarea placeholder="Description" rows="3" value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} required />
                            <button className="btn btn-primary">Add Service</button>
                        </form>
                    </div>

                    <div style={{ display: 'grid', gap: '20px' }}>
                        {services.map(s => (
                            <div key={s.id} style={{ background: '#121212', padding: '20px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3>{s.title}</h3>
                                    <p style={{ color: '#aaa' }}>{s.description}</p>
                                </div>
                                <button onClick={() => deleteService(s.id)} style={{ color: 'red', background: 'transparent', border: 'none', cursor: 'pointer' }}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
                <div style={{ background: '#121212', padding: '40px', borderRadius: '10px' }}>
                    <h3>Edit About Section</h3>
                    <textarea
                        rows="10"
                        value={aboutContent}
                        onChange={e => setAboutContent(e.target.value)}
                        style={{ marginTop: '20px' }}
                    />
                    <button onClick={updateAbout} className="btn btn-primary">Save Changes</button>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
