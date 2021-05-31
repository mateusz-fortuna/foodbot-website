import React from 'react';
import { Row } from 'react-bootstrap';
import TransitionOut from '../Transitions/TransitionOut';
import './index.sass';

const Blog = () => (
  <Row className="blog">
    <TransitionOut />
    <p
      style={{
        fontSize: '3em',
        width: '100%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}
    >
      The blog content is in progress.
    </p>
  </Row>
);

export default Blog;
