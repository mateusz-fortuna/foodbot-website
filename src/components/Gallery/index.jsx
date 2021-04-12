import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { lerp } from '../../assets/js/lerp';
import TransitionOut from '../TransitionOut';
import ImagesContainer from '../ImagesContainer';

import './index.sass';

const Gallery = ({ windowWidth, windowHeight }) => {
  const [scrollTarget, setScrollTarget] = useState(null);

  // Store requestAnimationFrame()
  const requestRef = useRef();

  // Store reference to images container and the images
  const containerRef = useCallback((node) => {
    if (node) setScrollTarget(node);
  }, []);

  const [imgRefs, setImgRefs] = useState([]);

  const isReferencesReady = scrollTarget && imgRefs;

  // Scroll settings
  const ease = 0.06;
  const targetWidth = scrollTarget ? scrollTarget.offsetWidth - windowWidth : 0;
  const imgWidth = scrollTarget && imgRefs ? scrollTarget.offsetWidth / imgRefs.length : 0;
  const [x, setX] = useState(0);
  const [endX, setEndX] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [intersectionRatioValue, setIntersectionRatioValue] = useState(0);

  const setTransform = (node, transform) => {
    const el = node;
    if (el) el.style.transform = transform;
  };

  const animateImages = () => {
    const ratio = x / imgWidth;

    imgRefs.forEach((img, index) => {
      setIntersectionRatioValue(ratio - index * 0.7);
      setTransform(img, `translate3d(${intersectionRatioValue * 70}px, 0,0)`);
    });
  };

  const animate = () => {
    if (isReferencesReady) {
      // SetEndX => endX with scrolling boundaries
      setEndX((val) => Math.max(0, val) && Math.min(val, targetWidth));
      setX((val) => parseFloat(lerp(val, endX, ease).toFixed(2)));
      setEndX(scrollY);
      setTransform(scrollTarget, `translate3d(${-x}px,0,0)`);

      animateImages();

      requestRef.current = requestAnimationFrame(animate);
    }
  };

  // Simulate window.scrollY due to 'overflow: hidden'
  const handleScroll = (event) => {
    if (isReferencesReady) {
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
        <ImagesContainer
          ref={containerRef}
          imgRefs={imgRefs}
          setImgRefs={setImgRefs}
          windowHeight={windowHeight}
        />
      </Col>
    </Row>
  );
};

export default Gallery;
