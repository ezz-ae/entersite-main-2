import React, { useEffect, useState } from 'react';

const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<any[]>([]);

  useEffect(() => {
    const newPieces = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 2 + 3}s`,
      animationDelay: `${Math.random() * 2}s`,
      backgroundColor: ['#007AFF', '#10B981', '#F59E0B'][Math.floor(Math.random() * 3)],
    }));
    setPieces(newPieces);
  }, []);

  return (
    <>
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti"
          style={{
            left: p.left,
            animation: `confetti-fall ${p.animationDuration} ${p.animationDelay} ease-out forwards`,
            backgroundColor: p.backgroundColor,
          }}
        />
      ))}
    </>
  );
};

export default Confetti;