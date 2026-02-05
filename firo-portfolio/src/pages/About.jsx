import React, { useEffect, useState } from 'react';
import { getAboutContent } from '../services/firebase';

const About = () => {
    const [content, setContent] = useState('');

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const data = await getAboutContent();
                setContent(data.content || '');
            } catch (err) {
                console.error(err);
            }
        };

        fetchAbout();
    }, []);

    return (
        <div className="section container">
            <div style={{ maxWidth: '800px', margin: '0 auto', background: '#121212', padding: '40px', borderRadius: '10px' }}>
                <h1 className="text-center" style={{ marginBottom: '30px' }}>About <span className="text-accent">Me</span></h1>
                <div style={{ fontSize: '1.1rem', color: '#ccc', lineHeight: '1.8' }}>
                    {content ? (
                        <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default About;
