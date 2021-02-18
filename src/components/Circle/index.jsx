import React from 'react';
import { CSSTransition } from 'react-transition-group';
import './index.sass';

const Circle = () => {
  return (
    <CSSTransition in appear unmountOnExit classNames="circle" timeout={500}>
      <div className="circle" />
    </CSSTransition>
  );
};

export default Circle;
