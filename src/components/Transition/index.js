import React from 'react';
import './index.sass';

import { CSSTransition } from 'react-transition-group';
import { Row, Col } from 'react-bootstrap';

const timeout = 1000; //single strip transition time
const delay = 100;



const Transition = props => {
  const items = [];
    
  for ( let i = 0; i < 4; i++ ) {
    items.push (
      <CSSTransition
        in={ props.mountTransition }
        appear={ true }
        unmountOnExit={ true }
        timeout={ timeout + ( i * delay ) }
        classNames="transition__strip"
        key={ i }
      >
        <Col
          xs="3"
          className="transition__strip"
          style={ { transitionDelay: i * delay +'ms' } }
        />
      </CSSTransition>
    );
  }

  return (
    <Row className="transition">
      { items }
    </Row>
  );
};

export default Transition;