import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { lerp } from '../../assets/js/lerp';
import TransitionOut from '../TransitionOut';
import ImagesContainer from '../ImagesContainer';

import './index.sass';

const Gallery = ({ windowWidth, windowHeight }) => {
  const [scrollTarget, setScrollTarget] = useState(null);
  const [targetX, setTargetX] = useState(0);
  const requestRef = useRef();

  // Store reference to images container
  const containerRef = useCallback((node) => {
    setScrollTarget(node);
    setTargetX(node.getBoundingClientRect().x);
  }, []);

  // Scroll settings
  const targetWidth = scrollTarget ? scrollTarget.offsetWidth - windowWidth + 2 * targetX : 0;
  const ease = 0.08;
  const [x, setX] = useState(0);
  const [endX, setEndX] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const animate = () => {
    if (scrollTarget) {
      // Set value between 0 and scrollTarget width
      setEndX((val) => Math.max(0, val) && Math.min(val, targetWidth));

      setX((val) => parseFloat(lerp(val, endX, ease).toFixed(2)));
      setEndX(scrollY);

      scrollTarget.style.transform = `translate3d(${-x}px,0,0)`;

      requestRef.current = requestAnimationFrame(animate);
    }
  };

  // Simulate window.scrollY due to 'overflow: hidden'
  const handleScroll = (event) => {
    if (scrollTarget) {
      const { deltaY } = event;
      setScrollY((val) => Math.max(0, val + deltaY) && Math.min(val + deltaY, targetWidth));
    }
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);

    window.addEventListener('wheel', handleScroll, { passive: true });

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
