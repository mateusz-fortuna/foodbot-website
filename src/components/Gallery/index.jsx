import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'react-bootstrap';
import TransitionOut from '../TransitionOut';
import ImagesContainer from '../ImagesContainer';

import './index.sass';

const Gallery = () => {
  const [containerNode, setContainerNode] = useState(null);
  const containerRef = useCallback((node) => setContainerNode(node), []);

  /*   const handleGalleryScroll = (event) => {
    const { deltaY } = event;
    const isScrollingDown = deltaY > 0;
  };

  useEffect(() => {
    window.addEventListener('wheel', handleGalleryScroll, {
      passive: true,
    });
    return () => {
      window.removeEventListener('wheel', handleGalleryScroll, { passive: true });
    };
  }); */

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
