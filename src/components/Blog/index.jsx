import React, { useState, useEffect } from 'react';

import { Row } from 'react-bootstrap';

import { throttle } from '../../assets/js/throttle';
import Transition from '../Transition';
import TransitionOut from '../TransitionOut';

import { Redirect } from 'react-router-dom';

const Blog = () => {
  //----------SCROLL & SWIPE NAVIGATION----------//

  const [mountTransition, setMountTransition] = useState(false);
  const [changeUrl, setChangeUrl] = useState(false);
  /* 
  let timeoutPrevPage = null;
  const timeoutPrevPageFn = () => {
    timeoutPrevPage = setTimeout( () => { setChangeUrl( !changeUrl ); }, 1300 );
    timeoutPrevPage = null;
  };

  const handleWheel = event => {
    if ( event.deltaY < 0 ) {
      setMountTransition( !mountTransition );
      timeoutPrevPageFn();   
    }
  };

  const handleWheelEvent = throttle( handleWheel, 1300 );

  let touchStart = 0;

  const handleTouchStart = event => {
    touchStart = event.touches[ 0 ].pageY;
  };

  const handleTouchEnd = event => {
    const touchEnd = event.changedTouches[ 0 ].pageY;
    
    if ( touchStart < touchEnd ) {
      setMountTransition( !mountTransition );
      timeoutPrevPageFn();
    }
  };

  const handleTouchEndEvent = throttle( handleTouchEnd, 1300 );

  useEffect( () => {
    //----------EVENT LISTENERS----------//

    window.addEventListener( 'wheel', handleWheelEvent, false );
    window.addEventListener( 'touchstart', handleTouchStart, { passive: true } );
    window.addEventListener( 'touchend', handleTouchEndEvent, false );
  
    return () => {
      clearTimeout( timeoutPrevPage );

      window.removeEventListener( 'wheel', handleWheelEvent, false );
      window.removeEventListener( 'touchstart', handleTouchStart, { passive: true } );
      window.removeEventListener( 'touchend', handleTouchEndEvent, false );
    };
  } ); */

  return (
    <Row className="blog">
      <TransitionOut />
      {mountTransition && <Transition mountTransition={mountTransition} />}
      {changeUrl && <Redirect to="/contact" />}
      Blog
    </Row>
  );
};

export default Blog;
