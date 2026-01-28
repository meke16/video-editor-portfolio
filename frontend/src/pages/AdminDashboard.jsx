import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('portfolio');
    const [items, setItems] = useState([]);
    const [services, setServices] = useState([]);
    const [aboutContent, setAboutContent] = useState('');
    const [heroData, setHeroData] = useState({ title: '', subtitle: '', imageUrl: '' });
    const [socials, setSocials] = useState([]);
    const [messages, setMessages] = useState([]);

    // Forms
    const [newItem, setNewItem] = useState({ title: '', description: '', youtubeUrl: '', featured: false });
    const [newService, setNewService] = useState({ title: '', description: '' });
    const [newSocial, setNewSocial] = useState({ platform: '', url: '' });

    const API_URL = import.meta.env.VITE_API_URL;
    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'portfolio') {
                const res = await axios.get(`${API_URL}/portfolio`);
                setItems(res.data);
            } else if (activeTab === 'services') {
                const res = await axios.get(`${API_URL}/services`);
                setServices(res.data);
            } else if (activeTab === 'about') {
                const res = await axios.get(`${API_URL}/about`);
                setAboutContent(res.data.content);
            } else if (activeTab === 'hero') {
                const heroRes = await axios.get(`${API_URL}/hero`);
                setHeroData(heroRes.data);
                const socialsRes = await axios.get(`${API_URL}/socials`);
                setSocials(socialsRes.data);
            } else if (activeTab === 'messages') {
                const res = await axios.get(`${API_URL}/messages`);
                setMessages(res.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAdminLoggedIn');
        navigate('/login');
    };

    // --- Handlers ---

    // Portfolio
    const addPortfolioItem = async (e) => {
        e.preventDefault();
        await axios.post(`${API_URL}/portfolio`, newItem);
        setNewItem({ title: '', description: '', youtubeUrl: '', featured: false });
        fetchData();
    };
    const deletePortfolioItem = async (id) => {
        if (window.confirm('Are you sure?')) {
            await axios.delete(`${API_URL}/portfolio/${id}`);
            fetchData();
        }
    };

    // Services
    const addService = async (e) => {
        e.preventDefault();
        await axios.post(`${API_URL}/services`, newService);
        setNewService({ title: '', description: '' });
        fetchData();
    };
    const deleteService = async (id) => {
        if (window.confirm('Are you sure?')) {
            await axios.delete(`${API_URL}/services/${id}`);
            fetchData();
        }
    };

    // About
    const updateAbout = async () => {
        await axios.post(`${API_URL}/about`, { content: aboutContent });
        alert('About section updated!');
    };

    // Hero & Socials
    const updateHero = async (e) => {
        e.preventDefault();
        await axios.post(`${API_URL}/hero`, heroData);
        alert('Hero section updated!');
    };
    const addSocial = async (e) => {
        e.preventDefault();
        await axios.post(`${API_URL}/socials`, newSocial);
        setNewSocial({ platform: '', url: '' });
        fetchData();
    };
    const deleteSocial = async (id) => {
        await axios.delete(`${API_URL}/socials/${id}`);
        fetchData();
    };

    // Messages
    const deleteMessage = async (id) => {
        if (window.confirm('Delete this message?')) {
            await axios.delete(`${API_URL}/messages/${id}`);
            fetchData();
        }
    };


    const SidebarItem = ({ id, label }) => (
        <div
            onClick={() => setActiveTab(id)}
            style={{
                padding: '15px 20px',
                cursor: 'pointer',
                background: activeTab === id ? 'var(--accent-red)' : 'transparent',
                color: 'white',
                fontWeight: activeTab === id ? 'bold' : 'normal',
                borderLeft: activeTab === id ? '4px solid white' : '4px solid transparent',
                transition: '0.2s'
            }}
        >
            {label}
        </div>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <div style={{ width: '250px', background: '#0a0a0a', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '30px 20px', borderBottom: '1px solid #222' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>Admin<span className="text-accent">Panel</span></h2>
                </div>
                <div style={{ flex: 1, paddingTop: '20px' }}>
                    <SidebarItem id="portfolio" label="Portfolio" />
                    <SidebarItem id="services" label="Services" />
                    <SidebarItem id="about" label="About Me" />
                    <SidebarItem id="hero" label="Hero & Socials" />
                    <SidebarItem id="messages" label="Messages" />
                </div>
                <div style={{ padding: '20px' }}>
                    <button onClick={handleLogout} className="btn" style={{ width: '100%', fontSize: '0.9rem' }}>Logout</button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '40px', overflowY: 'auto', maxHeight: '100vh' }}>
                <h1 style={{ marginBottom: '30px', borderBottom: '1px solid #222', paddingBottom: '20px' }}>
                    Manage <span className="text-accent">{activeTab.replace(/^\w/, c => c.toUpperCase())}</span>
                </h1>

                {/* Portfolio Tab */}
                {activeTab === 'portfolio' && (
                    <div>
                        <div style={{ background: '#121212', padding: '25px', borderRadius: '8px', marginBottom: '30px' }}>
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

                        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                            {items.map(item => (
                                <div key={item.id} style={{ background: '#121212', borderRadius: '8px', padding: '20px', border: '1px solid #222' }}>
                                    <h4>{item.title}</h4>
                                    <p style={{ fontSize: '0.8rem', color: '#888', margin: '10px 0' }}>{item.description}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                                        {item.featured ? <span style={{ color: 'var(--accent-red)', fontSize: '0.8rem' }}>★ FEATURED</span> : <span></span>}
                                        <button onClick={() => deletePortfolioItem(item.id)} style={{ color: '#ff4444', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Services Tab */}
                {activeTab === 'services' && (
                    <div>
                        <div style={{ background: '#121212', padding: '25px', borderRadius: '8px', marginBottom: '30px' }}>
                            <h3>Add Service</h3>
                            <form onSubmit={addService} style={{ marginTop: '20px' }}>
                                <input placeholder="Service Title" value={newService.title} onChange={e => setNewService({ ...newService, title: e.target.value })} required />
                                <textarea placeholder="Description" rows="3" value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} required />
                                <button className="btn btn-primary">Add Service</button>
                            </form>
                        </div>
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {services.map(s => (
                                <div key={s.id} style={{ background: '#121212', padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #222' }}>
                                    <div>
                                        <h3>{s.title}</h3>
                                        <p style={{ color: '#aaa', marginTop: '5px' }}>{s.description}</p>
                                    </div>
                                    <button onClick={() => deleteService(s.id)} style={{ color: '#ff4444', background: 'transparent', border: 'none', cursor: 'pointer' }}>Delete</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* About Tab */}
                {activeTab === 'about' && (
                    <div style={{ background: '#121212', padding: '30px', borderRadius: '8px' }}>
                        <h3>Edit About Details</h3>
                        <p style={{ color: '#888', marginBottom: '20px' }}>This content will appear in the About Me section.</p>
                        <textarea
                            rows="12"
                            value={aboutContent}
                            onChange={e => setAboutContent(e.target.value)}
                            style={{ background: '#000', border: '1px solid #333' }}
                        />
                        <button onClick={updateAbout} className="btn btn-primary">Save Changes</button>
                    </div>
                )}

                {/* Hero & Socials Tab */}
                {activeTab === 'hero' && (
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            <div style={{ background: '#121212', padding: '25px', borderRadius: '8px' }}>
                                <h3>Hero Section</h3>
                                <form onSubmit={updateHero} style={{ marginTop: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#888' }}>Main Title</label>
                                    <input value={heroData.title} onChange={e => setHeroData({ ...heroData, title: e.target.value })} placeholder="e.g. Video Editor" />

                                    <label style={{ display: 'block', marginBottom: '5px', color: '#888' }}>Subtitle</label>
                                    <input value={heroData.subtitle} onChange={e => setHeroData({ ...heroData, subtitle: e.target.value })} placeholder="e.g. Specializing in..." />

                                    <label style={{ display: 'block', marginBottom: '5px', color: '#888' }}>Hero Image / Profile Photo URL</label>
                                    <input value={heroData.imageUrl} onChange={e => setHeroData({ ...heroData, imageUrl: e.target.value })} placeholder="https://..." />

                                    <button className="btn btn-primary">Update Hero</button>
                                </form>
                            </div>

                            <div style={{ background: '#121212', padding: '25px', borderRadius: '8px' }}>
                                <h3>Social Links</h3>
                                <form onSubmit={addSocial} style={{ marginTop: '20px', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input
                                            value={newSocial.platform}
                                            onChange={e => setNewSocial({ ...newSocial, platform: e.target.value })}
                                            placeholder="Platform (e.g. Instagram)"
                                            style={{ marginBottom: 0 }}
                                        />
                                        <input
                                            value={newSocial.url}
                                            onChange={e => setNewSocial({ ...newSocial, url: e.target.value })}
                                            placeholder="URL"
                                            style={{ marginBottom: 0 }}
                                        />
                                    </div>
                                    <button className="btn btn-primary" style={{ marginTop: '10px', width: '100%' }}>Add Link</button>
                                </form>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {socials.map(s => (
                                        <div key={s.id} style={{ background: '#000', padding: '10px 15px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span><b>{s.platform}</b>: <a href={s.url} target="_blank" rel="noreferrer" style={{ color: '#888' }}>{s.url}</a></span>
                                            <button onClick={() => deleteSocial(s.id)} style={{ color: '#ff4444', background: 'transparent', border: 'none', cursor: 'pointer' }}>×</button>
                                        </div>
                                    ))}
                                    {socials.length === 0 && <p style={{ color: '#666', textAlign: 'center' }}>No social links yet.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Messages Tab */}
                {activeTab === 'messages' && (
                    <div>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {messages.map(msg => (
                                <div key={msg.id} style={{ background: '#121212', padding: '25px', borderRadius: '8px', borderLeft: '4px solid var(--accent-red)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem' }}>{msg.name}</h3>
                                            <p style={{ color: '#888', fontSize: '0.9rem' }}>{msg.email}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ display: 'block', color: '#666', fontSize: '0.8rem', marginBottom: '5px' }}>
                                                {new Date(msg.createdAt).toLocaleDateString()}
                                            </span>
                                            <button onClick={() => deleteMessage(msg.id)} style={{ color: '#ff4444', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>Delete</button>
                                        </div>
                                    </div>
                                    <p style={{ background: '#0a0a0a', padding: '15px', borderRadius: '5px', lineHeight: '1.6' }}>{msg.message}</p>
                                </div>
                            ))}
                            {messages.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                                    <h3>No Messages Yet</h3>
                                    <p>Messages from your contact form will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
