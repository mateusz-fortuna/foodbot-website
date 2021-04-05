import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { lerp } from '../../assets/js/lerp';
import TransitionOut from '../TransitionOut';
import ImagesContainer from '../ImagesContainer';

import './index.sass';

const Gallery = ({ windowWidth, windowHeight }) => {
  const [scrollTarget, setScrollTarget] = useState(null);
  const requestRef = useRef();

  // Store reference to images container
  const containerRef = useCallback((node) => setScrollTarget(node), []);

  // Scroll settings
  const targetX = scrollTarget ? scrollTarget.getBoundingClientRect().x : 0;
  const targetWidth = scrollTarget ? scrollTarget.offsetWidth - windowWidth + 2 * targetX : 0;
  const ease = 0.08;
  let x = 0;
  let endX = 0;
  let scrollY = 0;

  const animate = () => {
    if (scrollTarget) {
      endX = Math.max(0, endX) && Math.min(endX, targetWidth);
      x = parseFloat(lerp(x, endX, ease).toFixed(2));
      endX = scrollY;

      scrollTarget.style.transform = `translate3d(${-x}px,0,0)`;

      requestRef.current = requestAnimationFrame(animate);
    }
  };

  // Simulate window.scrollY due to 'overflow: hidden'
  const handleScroll = (event) => {
    if (scrollTarget) {
      const { deltaY } = event;
      scrollY = Math.max(0, scrollY + deltaY) && Math.min(scrollY + deltaY, targetWidth);
    }
  };

  useEffect(() => {
    animate();

    window.addEventListener('wheel', handleScroll, {
      passive: true,
    });
    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('wheel', handleScroll, { passive: true });
    };
  });

  return (
    <Row className="gallery">
      <TransitionOut />
      <Col sm={12}>
        <ImagesContainer ref={containerRef} windowWidth={windowWidth} windowHeight={windowHeight} />
      </Col>
    </Row>
  );
};

export default Gallery;
