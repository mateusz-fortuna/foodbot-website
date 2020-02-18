import React, { useState, useEffect } from 'react';

import { Row } from 'react-bootstrap';

import { throttle } from '../../assets/js/throttle';
import Transition from '../Transition';

import { Redirect } from 'react-router-dom';


const Blog = () => {
  //----------SCROLL & SWIPE NAVIGATION----------//
  
  const [ mountTransition, setMountTransition ] = useState( false );
  const [ changeUrl, setChangeUrl ] = useState( false );

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

  const wheelEvent = event => {
    throttle( handleWheel( event ), 1300 )
  };

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

  useEffect( () => {
    window.addEventListener( 'wheel', wheelEvent , false );
    window.addEventListener( 'touchstart', handleTouchStart, { passive: true } );
    window.addEventListener( 'touchend', handleTouchEnd, false );
  
    return () => {
      clearTimeout( timeoutPrevPage );

      window.removeEventListener( 'wheel', wheelEvent, false );
      window.removeEventListener( 'touchstart', handleTouchStart, { passive: true } );
      window.removeEventListener( 'touchend', handleTouchEnd, false );
    };
  } );

  return (
    <Row className="blog">
      { mountTransition && ( <Transition mountTransition={ mountTransition }/> ) }
      { changeUrl && ( <Redirect to="/contact" /> ) }

      Blog
    </Row>
  );
};

export default Blog;