import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'react-bootstrap';
import { TweenLite } from 'gsap';
import TransitionOut from '../TransitionOut';
import ImagesContainer from '../ImagesContainer';

import './index.sass';

const Gallery = () => {
  // Store reference to images container
  const [containerNode, setContainerNode] = useState(null);
  const containerRef = useCallback((node) => setContainerNode(node), []);

  const [requestID, setRequestID] = useState(null);

  const scrollSettings = {
    target: containerNode,
    ease: 0.02,
    endX: 0,
    x: 0,
    resizeRequest: true,
    scrollRequest: false,
  };
  const { target, ease, endX, x, resizeRequest, scrollRequest } = scrollSettings;

  // Force supporting transitions by GPU
  if (target) {
    TweenLite.set(target, {
      rotation: 0.01,
      force3D: true,
    });
  }

  const handleGalleryScroll = (event) => {};

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
        <ImagesContainer ref={containerRef} />
      </Col>
    </Row>
  );
};

export default Gallery;
