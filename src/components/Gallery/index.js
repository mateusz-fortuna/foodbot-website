import React, { useState, useEffect } from 'react';

import { Row } from 'react-bootstrap';

import Transition from '../Transition';
import { throttle } from '../../assets/js/throttle';
import TransitionOut from '../TransitionOut';

const Gallery = () => {
  //----------SCROLL & SWIPE NAVIGATION----------//
  
  const [ mountTransition, setMountTransition ] = useState( false );


  let timeoutNextPage = null;
  let timeoutPrevPage = null;
  const timeoutNextPageFn = () => {
    timeoutNextPage = setTimeout( () => { window.location.href = '/#/contact'; }, 1300 );
  };
  const timeoutPrevPageFn = () => {
    timeoutPrevPage = setTimeout( () => { window.location.href = '/#/about'; }, 1300 );
  };

  const handleWheel = event => {
    if ( event.deltaY > 0 ) {
      setMountTransition( !mountTransition );
      timeoutNextPageFn();   
    } else {
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
    
    if ( touchStart > touchEnd ) {
      setMountTransition( !mountTransition );
      timeoutNextPageFn();
    } else {
      setMountTransition( !mountTransition );
      timeoutPrevPageFn();
    }
  };

  useEffect( () => {
    window.addEventListener( 'wheel', wheelEvent , false );
    window.addEventListener( 'touchstart', handleTouchStart, { passive: true } );
    window.addEventListener( 'touchend', handleTouchEnd, false );
  
    return () => {
      clearTimeout( timeoutNextPage );
      clearTimeout( timeoutPrevPage );

      window.removeEventListener( 'wheel', wheelEvent, false );
      window.removeEventListener( 'touchstart', handleTouchStart, { passive: true } );
      window.removeEventListener( 'touchend', handleTouchEnd, false );
    };
  } );

  return (
    <Row className="gallery">
      <TransitionOut />
      { mountTransition && ( <Transition mountTransition={ mountTransition }/> ) }
      Gallery
    </Row>
  );
};

export default Gallery;