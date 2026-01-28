import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Play } from 'lucide-react';
import FloatingParticles from '../components/FloatingParticles';

const Home = () => {
    const [featuredVideos, setFeaturedVideos] = useState([]);
    const [heroData, setHeroData] = useState(null);
    const [socials, setSocials] = useState([]);

    const API_URL = import.meta.env.VITE_API_URL;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [portfolioRes, heroRes, socialsRes] = await Promise.all([
                    axios.get(`${API_URL}/portfolio`),
                    axios.get(`${API_URL}/hero`),
                    axios.get(`${API_URL}/socials`)
                ]);

                setFeaturedVideos(portfolioRes.data.filter(v => v.featured).slice(0, 3));
                setHeroData(heroRes.data);
                setSocials(socialsRes.data);
            } catch (err) {
                console.error("Failed to fetch home data", err);
            }
        };
        fetchData();
    }, []);
    const getEmbedUrl = (url) => {
        if (!url) return '';
        if (url.includes('youtu.be')) {
            const id = url.split('/').pop();
            return `https://www.youtube.com/embed/${id}`;
        }
        if (url.includes('watch?v=')) {
            const id = url.split('watch?v=')[1].split('&')[0];
            return `https://www.youtube.com/embed/${id}`;
        }
        if (url.includes('embed')) return url;
        return url;
    };
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero" style={{
                minHeight: '85vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 20px',
                background: 'linear-gradient(135deg, #050505 0%, #1a1a1a 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <FloatingParticles />
                <div className="container" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '50px',
                    width: '100%',
                    flexWrap: 'wrap'
                }}>

                    {/* Left: Content */}
                    <div style={{ flex: '1 1 500px', animation: 'fadeIn 1s ease-out', textAlign: 'left' }}>
                        <p style={{ fontSize: '1.5rem', color: 'var(--accent-red)', marginBottom: '15px', fontWeight: 'bold' }}>Hey, I'm Firaol</p>
                        <h1 className="hero-text-animated" style={{ fontSize: '4rem', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '2px', lineHeight: '1.1' }}>
                            {heroData?.title || 'Video Editor'}
                        </h1>
                        <p style={{ fontSize: '1.3rem', color: '#ccc', marginBottom: '30px', fontWeight: '300', maxWidth: '600px' }}>
                            {heroData?.subtitle || 'Create. Edit. Inspire.'}
                        </p>

                        {/* Social Links */}
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
                            {socials.map(social => (
                                <a
                                    key={social.id}
                                    href={social.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn"
                                    style={{
                                        padding: '10px 20px',
                                        fontSize: '0.9rem',
                                        borderColor: '#333',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    {social.platform}
                                </a>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <Link to="/portfolio" className="btn btn-primary">View My Work</Link>
                            <Link to="/contact" className="btn">Contact Me</Link>
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center', animation: 'fadeIn 1.5s ease-out' }}>
                        <div className="hero-img-wrapper">
                            <div className="orbit-ring">
                                <div className="orbit-bubble bubble-1"></div>
                                <div className="orbit-bubble bubble-2"></div>
                                <div className="orbit-bubble bubble-3"></div>
                                <div className="orbit-bubble bubble-4"></div>
                                <div className="orbit-bubble bubble-5"></div>
                                <div className="orbit-bubble bubble-6"></div>
                            </div>
                            <div className="hero-profile-img" style={{ position: 'relative', zIndex: 2 }}>
                                <img
                                    src={heroData?.imageUrl || 'https://via.placeholder.com/500'}
                                    alt="Firaol"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Featured Work */}
            <section className="section container">
                <h2 className="text-center" style={{ marginBottom: '50px', fontSize: '2.5rem' }}>Featured <span className="text-accent">Edits</span></h2>
                <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                    {featuredVideos.map(video => (
                        <div key={video.id} className="video-card" style={{ background: '#121212', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ position: 'relative', paddingTop: '56.25%', borderBottom: '2px solid var(--accent-red)' }}>
                                <iframe
                                    src={getEmbedUrl(video.youtubeUrl)}
                                    title={video.title}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div style={{ padding: '25px' }}>
                                <h3 style={{ marginBottom: '10px', fontSize: '1.4rem' }}>{video.title}</h3>
                                <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '1.5' }}>{video.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {featuredVideos.length === 0 && <p className="text-center" style={{ color: '#666' }}>No featured videos selected yet.</p>}

                <div className="text-center" style={{ marginTop: '60px' }}>
                    <Link to="/portfolio" className="btn">See All Projects</Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
