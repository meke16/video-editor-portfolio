import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Play } from 'lucide-react';

const Home = () => {
    const [featuredVideos, setFeaturedVideos] = useState([]);
    const [heroData, setHeroData] = useState(null);
    const [socials, setSocials] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [portfolioRes, heroRes, socialsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/portfolio'),
                    axios.get('http://localhost:5000/api/hero'),
                    axios.get('http://localhost:5000/api/socials')
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
                height: '85vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                background: heroData?.imageUrl
                    ? `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("${heroData.imageUrl}")`
                    : 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), #121212',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '20px'
            }}>
                <div className="container" style={{ maxWidth: '800px', animation: 'fadeIn 1s ease-out' }}>
                    <p style={{ fontSize: '1.5rem', color: 'var(--accent-red)', marginBottom: '10px', fontWeight: 'bold' }}>Hey, I'm Firaol</p>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '2px', lineHeight: '1.2' }}>
                        {heroData?.title || 'Video Editor'}
                    </h1>
                    <p style={{ fontSize: '1.4rem', color: '#ccc', margin: '0 auto 30px', fontWeight: '300' }}>
                        {heroData?.subtitle || 'Create. Edit. Inspire.'}
                    </p>

                    {/* Social Links */}
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '35px', flexWrap: 'wrap' }}>
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

                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        <Link to="/portfolio" className="btn btn-primary">View My Work</Link>
                        <Link to="/contact" className="btn">Contact Me</Link>
                    </div>
                </div>
            </section>

            {/* Featured Work */}
            <section className="section container">
                <h2 className="text-center" style={{ marginBottom: '50px', fontSize: '2.5rem' }}>Featured <span className="text-accent">Edits</span></h2>
                <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                    {featuredVideos.map(video => (
                        <div key={video.id} className="video-card" style={{ background: '#121212', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', transition: 'transform 0.3s' }}>
                            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
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
