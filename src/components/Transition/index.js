import React,{ useState, useEffect } from 'react';
import './index.sass';

import { CSSTransition } from 'react-transition-group';
import { Row, Col } from 'react-bootstrap';


const Transition = props => {

  //----------ANIMATION PARAMETERS----------//

  const timeout = 200; //single strip transition time
  const delay = 100;

  //----------AUTO UNMOUNT----------//

  const [ autoUnmount, setAutoUnmount ] = useState( false );

  let listenerTimeout = null;
  const timeoutFn = () => {
    listenerTimeout = setTimeout( () => { setAutoUnmount( true ); }, 1300 );
    listenerTimeout = null;
  };

  useEffect( () => {
    timeoutFn();

    return () => {
      clearTimeout( listenerTimeout );
    };
  } );

  //----------ARRAY OF STRIPS----------//

  const items = [];
    
  for ( let i = 1; i < 4; i++ ) {
    items.push (
      <CSSTransition
        in={ props.mountTransition && !autoUnmount }
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


  //----------JSX CODE----------//


  return (
    <CSSTransition
        in={ props.mountTransition && !autoUnmount }
        appear={ true }
        unmountOnExit={ true }
        timeout={ timeout + 300 }
        classNames="transition__strip"
        key="0"
    >
      <Row className="transition">
        <Col
          xs="3"
          className="transition__strip"
        />
        { items }
      </Row>
    </CSSTransition>
  );
};

export default Transition;