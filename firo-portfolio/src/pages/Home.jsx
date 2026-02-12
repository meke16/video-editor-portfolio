import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getPortfolioItems,
  getSocialLinks,
  subscribeHeroData,
} from "../services/firebase";
import { Play, ArrowRight, Mail } from "lucide-react";
import FloatingParticles from "../components/FloatingParticles";
import ShootingStar from "../components/ShootingStar";

const Home = () => {
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [heroData, setHeroData] = useState(null);
  const [socials, setSocials] = useState([]);

  useEffect(() => {
    let unsubscribeHero = null;

    const fetchData = async () => {
      try {
        const [portfolioData, socialsRes] = await Promise.all([
          getPortfolioItems(),
          getSocialLinks(),
        ]);
        setFeaturedVideos(portfolioData.filter((v) => v.featured).slice(0, 3));
        setSocials(socialsRes);
      } catch (err) {
        console.error("Failed to fetch home data", err);
      }
    };

    fetchData();
    unsubscribeHero = subscribeHeroData(setHeroData);

    return () => {
      if (unsubscribeHero) unsubscribeHero();
    };
  }, []);

  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtu.be")) {
      const id = url.split("/").pop();
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("watch?v=")) {
      const id = url.split("watch?v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("embed")) return url;
    return url;
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <FloatingParticles />
        <ShootingStar intervalMs={14000} minDelay={5000} />
        <div className="container hero-container">
          <div className="hero-content">
            <p className="hero-greeting">Hey, I&apos;m Firaol</p>
            <h1 className="hero-title hero-text-animated">
              {heroData?.title || "Video Editor"}
            </h1>
            <p className="hero-subtitle">
              {heroData?.subtitle || "Create. Edit. Inspire."}
            </p>

            <div className="hero-socials">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-social"
                >
                  {social.platform}
                </a>
              ))}
            </div>

            <div className="hero-cta">
              <Link to="/portfolio" className="btn btn-primary">
                View My Work
                <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn">
                <Mail size={18} />
                Contact Me
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-img-wrapper">
              <div className="orbit-ring">
                <div className="orbit-bubble bubble-1"></div>
                <div className="orbit-bubble bubble-2"></div>
                <div className="orbit-bubble bubble-3"></div>
                <div className="orbit-bubble bubble-4"></div>
                <div className="orbit-bubble bubble-5"></div>
                <div className="orbit-bubble bubble-6"></div>
              </div>
              <div className="hero-profile-img">
                <img
                  src={heroData?.imageUrl}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x400/1a1a1a/666?text=FA";
                  }}
                  alt="Firaol Adane - Video Editor"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="section section-featured">
        <div className="container">
          <h2 className="section-title text-center section-title-spaced">
            Featured <span className="text-accent">Edits</span>
          </h2>
          <div className="featured-grid">
            {featuredVideos.map((video) => (
              <article key={video.id} className="video-card">
                <div className="video-card-thumb">
                  <iframe
                    src={getEmbedUrl(video.youtubeUrl)}
                    title={video.title}
                    allowFullScreen
                  />
                  <div className="video-card-overlay">
                    <Play size={48} fill="white" />
                  </div>
                </div>
                <div className="video-card-body">
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                </div>
              </article>
            ))}
          </div>
          {featuredVideos.length === 0 && (
            <p className="text-center text-muted featured-empty">
              No featured videos selected yet.
            </p>
          )}
          <div className="section-cta">
            <Link to="/portfolio" className="btn">
              See All Projects
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
