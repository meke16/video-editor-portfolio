import React, { useEffect, useState } from "react";
import { getAboutContent } from "../services/firebase";

const About = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchAbout = async () => {
      try {
        const data = await getAboutContent();
        if (!isMounted) return;
        setContent(data?.content || "");
      } catch (err) {
        console.error("Failed to fetch About content:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAbout();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="section page-about">
      <div className="container">
        <div className="about-card">
          <h1 className="section-title text-center about-title">
            About <span className="text-accent">Me</span>
          </h1>

          <div className="about-content">
            {loading && (
              <div className="about-loading">
                <div className="loading-spinner" />
                <p>Loading...</p>
              </div>
            )}

            {!loading && error && (
              <div className="about-error">
                <p>Failed to load content. Please try again later.</p>
              </div>
            )}

            {!loading && !error && content && (
              <div
                className="about-text"
                dangerouslySetInnerHTML={{
                  __html: content.replace(/\n/g, "<br />"),
                }}
              />
            )}

            {!loading && !error && !content && (
              <p className="about-empty">No content available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
