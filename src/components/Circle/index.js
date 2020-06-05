import React from 'react';
import { CSSTransition } from 'react-transition-group';
import './index.sass';

const Circle = () => {
  return (
    <CSSTransition
      in={ true }
      appear={ true }
      unmountOnExit={ true }
      classNames="circle"
      timeout={ 500 }
    >
      <div className="circle"/>
    </CSSTransition>
  );
};

export default Circle;