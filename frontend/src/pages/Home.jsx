import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Play } from 'lucide-react';

const Home = () => {
    const [featuredVideos, setFeaturedVideos] = useState([]);

    useEffect(() => {
        // In a real app we would have an endpoint filter for featured
        // For now, fetch all and filter
        const fetchVideos = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/portfolio');
                setFeaturedVideos(res.data.filter(v => v.featured).slice(0, 3));
            } catch (err) {
                console.error("Failed to fetch videos");
            }
        };
        fetchVideos();
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
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1574717432729-846c2415d9a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
                        Video Editor <span className="text-accent">|</span> YouTube Growth
                    </h1>
                    <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 30px', color: '#ddd' }}>
                        Specializing in high-retention editing for Reaction Channels, Tutorials, and Short-Form content (Reels/Shorts).
                    </p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        <Link to="/portfolio" className="btn btn-primary">View My Work</Link>
                        <Link to="/contact" className="btn">Contact Me</Link>
                    </div>
                </div>
            </section>

            {/* Featured Work */}
            <section className="section container">
                <h2 className="text-center" style={{ marginBottom: '40px' }}>Featured <span className="text-accent">Edits</span></h2>
                <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    {featuredVideos.map(video => (
                        <div key={video.id} className="video-card" style={{ background: '#121212', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                                <iframe
                                    src={getEmbedUrl(video.youtubeUrl)}
                                    title={video.title}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div style={{ padding: '20px' }}>
                                <h3>{video.title}</h3>
                                <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{video.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {featuredVideos.length === 0 && <p className="text-center">No featured videos yet.</p>}

                <div className="text-center" style={{ marginTop: '40px' }}>
                    <Link to="/portfolio" className="btn">See All Projects</Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
