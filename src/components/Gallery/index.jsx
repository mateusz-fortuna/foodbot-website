import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'react-bootstrap';
import { lerp } from '../../assets/js/lerp';
import TransitionOut from '../TransitionOut';
import ImagesContainer from '../ImagesContainer';

import './index.sass';

const Gallery = ({ windowWidth }) => {
  const [scrollY, setScrollY] = useState(0);

  const [scrollSettings, setScrollSettings] = useState({
    target: null,
    ease: 0.2,
    endX: 0,
    x: 0,
  });
  const { target, ease, endX, x } = scrollSettings;

  // Store reference to images container
  const containerRef = useCallback(
    (node) => setScrollSettings((settings) => ({ ...settings, target: node })),
    []
  );

  const handleGalleryScroll = (event) => {
    const { deltaY } = event;

    // Simulate window.scrollY due to 'overflow: hidden'
    setScrollY((val) => val + deltaY);

    if (target) {
      const posX = target.getBoundingClientRect().x;
      target.style.transform = `translate3d(${posX - deltaY * ease}px,0,0)`;
    }
  };

  useEffect(() => {
    window.addEventListener('wheel', handleGalleryScroll, {
      passive: true,
    });
    return () => {
      window.removeEventListener('wheel', handleGalleryScroll, { passive: true });
    };
  });

  return (
    <Row className="gallery">
      <TransitionOut />
      <Col sm={12}>
        <ImagesContainer ref={containerRef} windowWidth={windowWidth} />
      </Col>
    </Row>
  );
};

export default Gallery;
