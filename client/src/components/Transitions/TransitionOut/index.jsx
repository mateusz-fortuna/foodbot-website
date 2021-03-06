import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import './index.sass';

const TransitionOut = () => {
  const [mountTransition, setMountTransition] = useState(true);

  let timeout = setTimeout;
  const timeoutFn = () => {
    timeout = setTimeout(() => {
      setMountTransition(false);
    }, 1300);
  };

  useEffect(() => {
    timeoutFn();

    return () => {
      clearTimeout(timeout);
    };
  });

  const stripes = [];

  // push 4 stripes into array
  for (let i = 0; i < 4; i++) {
    stripes.push(
      <CSSTransition
        in
        appear
        timeout={200 + 100 * i}
        classNames="transitionOut__strip"
        style={{ transitionDelay: `${100 * i}ms` }}
        key={i}
      >
        <Col xs="3" className="transitionOut__strip" />
      </CSSTransition>
    );
  }

  return (
    <CSSTransition in={mountTransition} unmountOnExit timeout={200 + 300}>
      <Row className="transitionOut">{stripes}</Row>
    </CSSTransition>
  );
};

export default TransitionOut;
