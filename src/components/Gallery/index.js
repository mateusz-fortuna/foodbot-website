import React, { useState, useEffect } from 'react';

import { Row } from 'react-bootstrap';

import Transition from '../Transition';
import { throttle } from '../../assets/js/throttle';
import TransitionOut from '../TransitionOut';

import { Redirect } from 'react-router-dom';

const Gallery = () => {
  //----------SCROLL & SWIPE NAVIGATION----------//
  
  const [ mountTransition, setMountTransition ] = useState( false );
  const [ changeNextUrl, setChangeNextUrl ] = useState( false );
  const [ changePrevUrl, setChangePrevUrl ] = useState( false );


  let timeoutNextPage = null;
  let timeoutPrevPage = null;
  const timeoutNextPageFn = () => {
    timeoutNextPage = setTimeout( () => { setChangeNextUrl( !changeNextUrl ); }, 1300 );
    timeoutNextPage = null;
  };
  const timeoutPrevPageFn = () => {
    timeoutPrevPage = setTimeout( () => { setChangePrevUrl( !changePrevUrl ); }, 1300 );
    timeoutPrevPage = null;
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

  const handleWheelEvent = throttle( handleWheel, 1300 );

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

  const handleTouchEndEvent = throttle( handleTouchEnd, 1300 );

  useEffect( () => {
    window.addEventListener( 'wheel', handleWheelEvent, false );
    window.addEventListener( 'touchstart', handleTouchStart, { passive: true } );
    window.addEventListener( 'touchend', handleTouchEndEvent, false );
  
    return () => {
      clearTimeout( timeoutNextPage );
      clearTimeout( timeoutPrevPage );

      window.removeEventListener( 'wheel', handleWheelEvent, false );
      window.removeEventListener( 'touchstart', handleTouchStart, { passive: true } );
      window.removeEventListener( 'touchend', handleTouchEndEvent, false );
    };
  } );

  return (
    <Row className="gallery">
      <TransitionOut />
      { mountTransition && ( <Transition mountTransition={ mountTransition }/> ) }

      { changeNextUrl && ( <Redirect to="/contact" /> ) }
      { changePrevUrl && ( <Redirect to="/about" /> ) }

      Gallery
    </Row>
  );
};

export default Gallery;