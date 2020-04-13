import React from 'react';
import { CSSTransition } from 'react-transition-group';
import './index.sass';

const Circle = props => {
  const circleWidth = props.clientWidth / 40;

  const state = {
    circleStyle: {
      width: circleWidth,
      height: circleWidth
    }
  };
  
  return (
    <CSSTransition
      in={ true }
      appear={ true }
      unmountOnExit={ true }
      classNames="circle"
      timeout={ 500 }
    >
      <div className="circle" style={ state.circleStyle } />
    </CSSTransition>
  );
};

export default Circle;