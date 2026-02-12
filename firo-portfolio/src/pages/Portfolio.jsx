import React, { useEffect, useState } from 'react';
import { getPortfolioItems } from '../services/firebase';

const Portfolio = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await getPortfolioItems();
        setVideos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
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
    <div className="section page-portfolio">
      <div className="container">
        <h1 className="section-title text-center portfolio-title">
          Selected <span className="text-accent">Work</span>
        </h1>

        {loading ? (
          <div className="portfolio-loading">
            <div className="loading-spinner" />
            <p>Loading portfolio...</p>
          </div>
        ) : (
          <div className="portfolio-grid">
            {videos.map((video) => (
              <article
                key={video.id}
                className={`video-card ${video.featured ? 'video-card-featured' : ''}`}
              >
                <div className="video-card-thumb">
                  <iframe
                    src={getEmbedUrl(video.youtubeUrl)}
                    title={video.title}
                    allowFullScreen
                  />
                </div>
                <div className="video-card-body">
                  <div className="video-card-header">
                    <h3>{video.title}</h3>
                    {video.featured && (
                      <span className="video-badge">Featured</span>
                    )}
                  </div>
                  <p>{video.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && videos.length === 0 && (
          <p className="text-center text-muted">No portfolio items yet.</p>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
