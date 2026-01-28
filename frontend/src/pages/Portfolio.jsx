import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Portfolio = () => {
    const [videos, setVideos] = useState([]);

    const API_URL = import.meta.env.VITE_API_URL;
    useEffect(() => {
        axios.get(`${API_URL}/portfolio`)
            .then(res => setVideos(res.data))
            .catch(err => console.error(err));
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
        <div className="section container">
            <h1 className="text-center" style={{ marginBottom: '50px' }}>Selected <span className="text-accent">Work</span></h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                {videos.map(video => (
                    <div key={video.id} style={{ background: '#121212', borderRadius: '10px', overflow: 'hidden', border: video.featured ? '1px solid var(--accent-red)' : 'none' }}>
                        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
                            <iframe
                                src={getEmbedUrl(video.youtubeUrl)}
                                title={video.title}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <h3 style={{ marginBottom: '10px' }}>{video.title}</h3>
                                {video.featured && <span style={{ fontSize: '0.8rem', background: 'var(--accent-red)', padding: '2px 8px', borderRadius: '4px' }}>FEATURED</span>}
                            </div>
                            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{video.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {videos.length === 0 && <p className="text-center">Loading portfolio...</p>}
        </div>
    );
};

export default Portfolio;
