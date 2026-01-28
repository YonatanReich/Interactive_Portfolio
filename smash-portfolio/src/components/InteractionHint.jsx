import React, { useState, useEffect, useRef } from 'react';
import './InteractionHint.css';

export default function InteractionHint() {
  const [visible, setVisible] = useState(false);
  // We use a ref to track interaction instantly without re-rendering loops
  const hasInteracted = useRef(false);

  useEffect(() => {
    // 1. The Timer: Show hint after 5 seconds IF no interaction yet
    const timer = setTimeout(() => {
      if (!hasInteracted.current) {
        setVisible(true);
      }
    }, 2000);

    // 2. The Interaction Handler
    const handleInteraction = () => {
      hasInteracted.current = true; // Mark as interacted
      setVisible(false);            // Hide immediately
    };

    // 3. Listen for ANY activity
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('scroll', handleInteraction);
    window.addEventListener('wheel', handleInteraction);

    // Cleanup
    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('wheel', handleInteraction);
    };
  }, []);

return (
    <div className={`interaction-hint ${visible ? 'visible' : ''}`}>
      <div className="hint-header">
            <span className="hint-title">Welcome to my portfolio!</span>
            
        <div className="hint-line"></div>
      </div>

      <div className="hint-grid">
        {/* Row 1: Interaction */}
        <div className="hint-row">
         
          <span className="hint-desc">
            <strong>Interact:</strong> Click tabs or click/ touch the screen to shoot balls at glass panels to open them.
          </span>
        </div>

        {/* Row 2: Navigation */}
        <div className="hint-row">
          <div className="hint-icon-box">
             {/* Simple CSS Arrows instead of images for cleaner look */}

          </div>
          <span className="hint-desc">
            <strong>Travel:</strong> Scroll or use the ⇵ keys to fly through the tunnel.
          </span>
        </div>
      </div>

      <div className="hint-footer">
        [ CLICK ANYWHERE TO START ]
      </div>
    </div>
  );
}