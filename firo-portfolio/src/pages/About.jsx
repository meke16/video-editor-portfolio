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

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="section container">
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "#121212",
          padding: "40px",
          borderRadius: "10px",
        }}
      >
        <h1 className="text-center" style={{ marginBottom: "30px" }}>
          About <span className="text-accent">Me</span>
        </h1>

        <div
          style={{
            fontSize: "1.1rem",
            color: "#ccc",
            lineHeight: "1.8",
          }}
        >
          {loading && <p>Loading...</p>}

          {!loading && error && (
            <p style={{ color: "#ff6b6b" }}>
              Failed to load content. Please try again later.
            </p>
          )}

          {!loading && !error && content && (
            <div
              dangerouslySetInnerHTML={{
                __html: content.replace(/\n/g, "<br />"),
              }}
            />
          )}

          {!loading && !error && !content && (
            <p>No content available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
