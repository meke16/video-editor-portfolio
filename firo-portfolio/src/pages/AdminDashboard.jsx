import React, { useEffect, useState, useCallback } from 'react';
import {
    getPortfolioItems,
    addPortfolioItem as createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem as removePortfolioItem,
    getServices,
    addService as createService,
    updateService,
    deleteService as removeService,
    getAboutContent,
    saveAboutContent,
    getHeroData,
    saveHeroData,
    getSocialLinks,
    addSocialLink as createSocialLink,
    updateSocialLink,
    deleteSocialLink as removeSocialLink,
    getMessages,
    deleteMessage as removeMessage,
    logout as firebaseLogout
} from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const SidebarItem = ({ id, label, activeTab, onSelect }) => (
    <div
        onClick={() => onSelect(id)}
        style={{
            padding: '15px 20px',
            cursor: 'pointer',
            background: activeTab === id ? 'var(--admin-accent)' : 'transparent',
            color: 'white',
            fontWeight: activeTab === id ? 'bold' : 'normal',
            borderLeft: activeTab === id ? '4px solid white' : '4px solid transparent',
            transition: '0.2s'
        }}
    >
        {label}
    </div>
);

const Modal = ({ open, title, children, onClose, actions }) => {
    if (!open) return null;
    return (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
            <div className="admin-modal">
                <div className="admin-modal-header">
                    <h3>{title}</h3>
                    <button className="admin-modal-close" onClick={onClose} aria-label="Close">×</button>
                </div>
                <div className="admin-modal-body">{children}</div>
                <div className="admin-modal-actions">{actions}</div>
            </div>
        </div>
    );
};

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

    const [confirmModal, setConfirmModal] = useState({
        open: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        onConfirm: null,
        onCancel: null
    });
    const [infoModal, setInfoModal] = useState({
        open: false,
        title: '',
        message: '',
        buttonText: 'OK'
    });
    const [editModal, setEditModal] = useState({ open: false, type: '', data: null });
    const [editForm, setEditForm] = useState(null);
    const [modalBusy, setModalBusy] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            if (activeTab === 'portfolio') {
                const data = await getPortfolioItems();
                setItems(data);
            } else if (activeTab === 'services') {
                const data = await getServices();
                setServices(data);
            } else if (activeTab === 'about') {
                const data = await getAboutContent();
                setAboutContent(data.content || '');
            } else if (activeTab === 'hero') {
                const heroRes = await getHeroData();
                setHeroData(heroRes);
                const socialsRes = await getSocialLinks();
                setSocials(socialsRes);
            } else if (activeTab === 'messages') {
                const data = await getMessages();
                setMessages(data);
            }
        } catch (err) {
            console.error(err);
        }
    }, [activeTab]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 0);

        return () => clearTimeout(timer);
    }, [fetchData]);

    const handleLogout = async () => {
        await firebaseLogout();
        localStorage.removeItem('isAdminLoggedIn');
        navigate('/login');
    };

    const openConfirm = (config) => {
        setConfirmModal({
            open: true,
            title: 'Please Confirm',
            message: '',
            confirmText: 'Confirm',
            cancelText: 'Cancel',
            onConfirm: null,
            onCancel: null,
            ...config
        });
    };

    const closeConfirm = () => {
        setConfirmModal((prev) => ({ ...prev, open: false }));
    };

    const openInfo = (config) => {
        setInfoModal({
            open: true,
            title: 'Done',
            message: '',
            buttonText: 'OK',
            ...config
        });
    };

    const closeInfo = () => {
        setInfoModal((prev) => ({ ...prev, open: false }));
    };

    const handleConfirm = async () => {
        if (!confirmModal.onConfirm) return;
        setModalBusy(true);
        try {
            await confirmModal.onConfirm();
        } finally {
            setModalBusy(false);
            closeConfirm();
        }
    };

    const handleCancel = () => {
        if (confirmModal.onCancel) confirmModal.onCancel();
        closeConfirm();
    };

    const openEdit = (type, data) => {
        setEditModal({ open: true, type, data });
        setEditForm({ ...data });
    };

    const closeEdit = () => {
        setEditModal({ open: false, type: '', data: null });
        setEditForm(null);
    };

    // --- Handlers ---

    // Portfolio
    const addPortfolioItem = async (e) => {
        e.preventDefault();
        openConfirm({
            title: 'Add Portfolio Item',
            message: 'Create this portfolio item?',
            confirmText: 'Add',
            onConfirm: async () => {
                await createPortfolioItem(newItem);
                setNewItem({ title: '', description: '', youtubeUrl: '', featured: false });
                fetchData();
                openInfo({ title: 'Added', message: 'Portfolio item created successfully.' });
            }
        });
    };
    const deletePortfolioItem = async (id) => {
        openConfirm({
            title: 'Delete Portfolio Item',
            message: 'This action cannot be undone. Continue?',
            confirmText: 'Delete',
            onConfirm: async () => {
                await removePortfolioItem(id);
                fetchData();
                openInfo({ title: 'Deleted', message: 'Portfolio item deleted.' });
            }
        });
    };

    // Services
    const addService = async (e) => {
        e.preventDefault();
        openConfirm({
            title: 'Add Service',
            message: 'Create this service?',
            confirmText: 'Add',
            onConfirm: async () => {
                await createService(newService);
                setNewService({ title: '', description: '' });
                fetchData();
                openInfo({ title: 'Added', message: 'Service created successfully.' });
            }
        });
    };
    const deleteService = async (id) => {
        openConfirm({
            title: 'Delete Service',
            message: 'This action cannot be undone. Continue?',
            confirmText: 'Delete',
            onConfirm: async () => {
                await removeService(id);
                fetchData();
                openInfo({ title: 'Deleted', message: 'Service deleted.' });
            }
        });
    };

    // About
    const updateAbout = async () => {
        openConfirm({
            title: 'Update About Section',
            message: 'Save changes to About section?',
            confirmText: 'Save',
            onConfirm: async () => {
                await saveAboutContent(aboutContent);
                openInfo({ title: 'Updated', message: 'About section updated.' });
            }
        });
    };

    // Hero & Socials
    const updateHero = async (e) => {
        e.preventDefault();
        openConfirm({
            title: 'Update Hero Section',
            message: 'Save changes to hero section?',
            confirmText: 'Save',
            onConfirm: async () => {
                await saveHeroData(heroData);
                openInfo({ title: 'Updated', message: 'Hero section updated.' });
            }
        });
    };
    const addSocial = async (e) => {
        e.preventDefault();
        openConfirm({
            title: 'Add Social Link',
            message: 'Create this social link?',
            confirmText: 'Add',
            onConfirm: async () => {
                await createSocialLink(newSocial);
                setNewSocial({ platform: '', url: '' });
                fetchData();
                openInfo({ title: 'Added', message: 'Social link created.' });
            }
        });
    };
    const deleteSocial = async (id) => {
        openConfirm({
            title: 'Delete Social Link',
            message: 'This action cannot be undone. Continue?',
            confirmText: 'Delete',
            onConfirm: async () => {
                await removeSocialLink(id);
                fetchData();
                openInfo({ title: 'Deleted', message: 'Social link deleted.' });
            }
        });
    };

    // Messages
    const deleteMessage = async (id) => {
        openConfirm({
            title: 'Delete Message',
            message: 'This action cannot be undone. Continue?',
            confirmText: 'Delete',
            onConfirm: async () => {
                await removeMessage(id);
                fetchData();
                openInfo({ title: 'Deleted', message: 'Message deleted.' });
            }
        });
    };

    const saveEdit = () => {
        if (!editForm || !editModal.data) return;

        const reopenEdit = () => openEdit(editModal.type, editForm);

        if (editModal.type === 'portfolio') {
            closeEdit();
            openConfirm({
                title: 'Save Portfolio Changes',
                message: 'Update this portfolio item?',
                confirmText: 'Save',
                onConfirm: async () => {
                    await updatePortfolioItem(editModal.data.id, {
                        title: editForm.title,
                        description: editForm.description,
                        youtubeUrl: editForm.youtubeUrl,
                        featured: !!editForm.featured
                    });
                    fetchData();
                    openInfo({ title: 'Updated', message: 'Portfolio item updated.' });
                },
                onCancel: reopenEdit
            });
        }

        if (editModal.type === 'service') {
            closeEdit();
            openConfirm({
                title: 'Save Service Changes',
                message: 'Update this service?',
                confirmText: 'Save',
                onConfirm: async () => {
                    await updateService(editModal.data.id, {
                        title: editForm.title,
                        description: editForm.description
                    });
                    fetchData();
                    openInfo({ title: 'Updated', message: 'Service updated.' });
                },
                onCancel: reopenEdit
            });
        }

        if (editModal.type === 'social') {
            closeEdit();
            openConfirm({
                title: 'Save Social Changes',
                message: 'Update this social link?',
                confirmText: 'Save',
                onConfirm: async () => {
                    await updateSocialLink(editModal.data.id, {
                        platform: editForm.platform,
                        url: editForm.url
                    });
                    fetchData();
                    openInfo({ title: 'Updated', message: 'Social link updated.' });
                },
                onCancel: reopenEdit
            });
        }
    };

    const formatMessageDate = (createdAt) => {
        if (!createdAt) return '';
        if (typeof createdAt?.toDate === 'function') {
            return createdAt.toDate().toLocaleDateString();
        }
        return new Date(createdAt).toLocaleDateString();
    };


    return (
        <div className="admin-dashboard" style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <div className="admin-sidebar" style={{ width: '250px', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '30px 20px', borderBottom: '1px solid #222' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>Admin<span className="text-accent">Panel</span></h2>
                </div>
                <div style={{ flex: 1, paddingTop: '20px' }}>
                    <SidebarItem id="portfolio" label="Portfolio" activeTab={activeTab} onSelect={setActiveTab} />
                    <SidebarItem id="services" label="Services" activeTab={activeTab} onSelect={setActiveTab} />
                    <SidebarItem id="about" label="About Me" activeTab={activeTab} onSelect={setActiveTab} />
                    <SidebarItem id="hero" label="Hero & Socials" activeTab={activeTab} onSelect={setActiveTab} />
                    <SidebarItem id="messages" label="Messages" activeTab={activeTab} onSelect={setActiveTab} />
                </div>
                <div style={{ padding: '20px' }}>
                    <button onClick={handleLogout} className="btn" style={{ width: '100%', fontSize: '0.9rem' }}>Logout</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="admin-main" style={{ flex: 1, padding: '40px', overflowY: 'auto', maxHeight: '100vh' }}>
                <h1 style={{ marginBottom: '30px', borderBottom: '1px solid #222', paddingBottom: '20px' }}>
                    Manage <span className="text-accent">{activeTab.replace(/^\w/, c => c.toUpperCase())}</span>
                </h1>

                {/* Portfolio Tab */}
                {activeTab === 'portfolio' && (
                    <div>
                        <div className="admin-card" style={{ padding: '25px', borderRadius: '8px', marginBottom: '30px' }}>
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
                                <div key={item.id} className="admin-card" style={{ borderRadius: '8px', padding: '20px' }}>
                                    <h4>{item.title}</h4>
                                    <p style={{ fontSize: '0.8rem', color: '#888', margin: '10px 0' }}>{item.description}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                                        {item.featured ? <span style={{ color: 'var(--admin-accent)', fontSize: '0.8rem' }}>★ FEATURED</span> : <span></span>}
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => openEdit('portfolio', item)} className="admin-link">Edit</button>
                                            <button onClick={() => deletePortfolioItem(item.id)} className="admin-link admin-link-danger">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Services Tab */}
                {activeTab === 'services' && (
                    <div>
                        <div className="admin-card" style={{ padding: '25px', borderRadius: '8px', marginBottom: '30px' }}>
                            <h3>Add Service</h3>
                            <form onSubmit={addService} style={{ marginTop: '20px' }}>
                                <input placeholder="Service Title" value={newService.title} onChange={e => setNewService({ ...newService, title: e.target.value })} required />
                                <textarea placeholder="Description" rows="3" value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} required />
                                <button className="btn btn-primary">Add Service</button>
                            </form>
                        </div>
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {services.map(s => (
                                <div key={s.id} className="admin-card" style={{ padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h3>{s.title}</h3>
                                        <p style={{ color: '#aaa', marginTop: '5px' }}>{s.description}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => openEdit('service', s)} className="admin-link">Edit</button>
                                        <button onClick={() => deleteService(s.id)} className="admin-link admin-link-danger">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* About Tab */}
                {activeTab === 'about' && (
                    <div className="admin-card" style={{ padding: '30px', borderRadius: '8px' }}>
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
                            <div className="admin-card" style={{ padding: '25px', borderRadius: '8px' }}>
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

                            <div className="admin-card" style={{ padding: '25px', borderRadius: '8px' }}>
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
                                        <div key={s.id} className="admin-card" style={{ padding: '10px 15px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span><b>{s.platform}</b>: <a href={s.url} target="_blank" rel="noreferrer" style={{ color: '#888' }}>{s.url}</a></span>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <button onClick={() => openEdit('social', s)} className="admin-link">Edit</button>
                                                <button onClick={() => deleteSocial(s.id)} className="admin-link admin-link-danger">Delete</button>
                                            </div>
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
                                <div key={msg.id} className="admin-card" style={{ padding: '25px', borderRadius: '8px', borderLeft: '4px solid var(--admin-accent)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem' }}>{msg.name}</h3>
                                            <p style={{ color: '#888', fontSize: '0.9rem' }}>{msg.email}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ display: 'block', color: '#666', fontSize: '0.8rem', marginBottom: '5px' }}>
                                                {formatMessageDate(msg.createdAt)}
                                            </span>
                                            <button onClick={() => deleteMessage(msg.id)} className="admin-link admin-link-danger" style={{ fontSize: '0.9rem' }}>Delete</button>
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

            <Modal
                open={confirmModal.open}
                title={confirmModal.title}
                onClose={handleCancel}
                actions={
                    <>
                        <button className="btn" onClick={handleCancel} disabled={modalBusy}>{confirmModal.cancelText}</button>
                        <button className="btn btn-primary" onClick={handleConfirm} disabled={modalBusy}>
                            {modalBusy ? 'Please wait...' : confirmModal.confirmText}
                        </button>
                    </>
                }
            >
                <p style={{ color: '#cbd6e6', margin: 0 }}>{confirmModal.message}</p>
            </Modal>

            <Modal
                open={infoModal.open}
                title={infoModal.title}
                onClose={closeInfo}
                actions={
                    <button className="btn btn-primary" onClick={closeInfo}>{infoModal.buttonText}</button>
                }
            >
                <p style={{ color: '#cbd6e6', margin: 0 }}>{infoModal.message}</p>
            </Modal>

            <Modal
                open={editModal.open}
                title={editModal.type === 'portfolio' ? 'Edit Portfolio Item' : editModal.type === 'service' ? 'Edit Service' : 'Edit Social Link'}
                onClose={closeEdit}
                actions={
                    <>
                        <button className="btn" onClick={closeEdit}>Cancel</button>
                        <button className="btn btn-primary" onClick={saveEdit}>Save Changes</button>
                    </>
                }
            >
                {editModal.type === 'portfolio' && editForm && (
                    <div className="admin-form-grid">
                        <input value={editForm.title || ''} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" />
                        <input value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" />
                        <input value={editForm.youtubeUrl || ''} onChange={e => setEditForm({ ...editForm, youtubeUrl: e.target.value })} placeholder="YouTube URL" />
                        <label className="admin-checkbox">
                            <input type="checkbox" checked={!!editForm.featured} onChange={e => setEditForm({ ...editForm, featured: e.target.checked })} />
                            Featured on Homepage
                        </label>
                    </div>
                )}

                {editModal.type === 'service' && editForm && (
                    <div className="admin-form-grid">
                        <input value={editForm.title || ''} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="Service Title" />
                        <textarea rows="3" value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" />
                    </div>
                )}

                {editModal.type === 'social' && editForm && (
                    <div className="admin-form-grid">
                        <input value={editForm.platform || ''} onChange={e => setEditForm({ ...editForm, platform: e.target.value })} placeholder="Platform" />
                        <input value={editForm.url || ''} onChange={e => setEditForm({ ...editForm, url: e.target.value })} placeholder="URL" />
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminDashboard;
