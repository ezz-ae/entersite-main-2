import React, { useEffect, useState } from 'react';
import './mobile-styles.css';

const Confetti = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ['#FFC700', '#FF0000', '#2E3192', '#41BBC7', '#10B981'];
    const count = 50;
    const newParticles = [];

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100, // Random horizontal position 0-100%
        animationDelay: Math.random() * 2, // Random start time
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        animationDuration: 2 + Math.random() * 2 // Random fall speed
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.backgroundColor,
            animation: `confetti-fall ${p.animationDuration}s linear forwards`,
            animationDelay: `${p.animationDelay}s`
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;