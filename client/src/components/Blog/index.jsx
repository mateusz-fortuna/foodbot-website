import React from 'react';
import { Row } from 'react-bootstrap';
import TransitionOut from '../Transitions/TransitionOut';
import './index.sass';

const Blog = () => (
  <Row className="blog">
    <TransitionOut />
    Blog
  </Row>
);

export default Blog;
