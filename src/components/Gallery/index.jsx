import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'react-bootstrap';
import { TweenLite } from 'gsap';
import TransitionOut from '../TransitionOut';
import ImagesContainer from '../ImagesContainer';

import './index.sass';

const Gallery = ({ windowWidth }) => {
  // Store reference to images container
  const containerRef = useCallback(
    (node) => setScrollSettings((settings) => ({ ...settings, target: node })),
    []
  );

  const [scrollSettings, setScrollSettings] = useState({
    target: null,
    ease: 3,
    endX: 0,
    x: 0,
  });
  const { target, ease, endX, x } = scrollSettings;

  const handleGalleryScroll = (event) => {
    if (target) {
      const posX = target.getBoundingClientRect().x;
      target.style.transform = `translate3d(${posX - event.deltaY * ease}px,0,0)`;
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
