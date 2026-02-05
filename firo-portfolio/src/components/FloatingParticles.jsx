import React from 'react';
import '../index.css';

const FloatingParticles = () => {
    const colors = ['#ffffff', '#ff5555', '#5555ff', '#ffff55', '#ff55ff', '#55ffff'];

    // Generate 50 random stars
    const particles = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${2 + Math.random() * 4}s`, // Faster twinkle
        animationDelay: `${Math.random() * 5}s`,
        size: `${1 + Math.random() * 3}px`, // Much smaller (1px - 4px)
        color: colors[Math.floor(Math.random() * colors.length)]
    }));

    return (
        <div className="particles-container">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        boxShadow: `0 0 ${parseInt(p.size) * 2}px ${p.color}`,
                        animationDuration: p.animationDuration,
                        animationDelay: p.animationDelay
                    }}
                />
            ))}
        </div>
    );
};

export default FloatingParticles;
