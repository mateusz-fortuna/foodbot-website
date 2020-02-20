import React, { useState, useEffect } from 'react';
import './index.sass';

import { Row, Col } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import Transition from '../Transition';

import Image from '../../assets/images/printer-perspective.png';

import { throttle } from '../../assets/js/throttle';

import { Redirect } from 'react-router-dom';


const About = props => {

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
  //----------ANIMATION SETTINGS----------//

  const timeout = 1000;


  //----------JSX CODE----------//


  return (
    <Row className="about">
      { mountTransition && ( <Transition mountTransition={ mountTransition }/> ) }

      { changeNextUrl && ( <Redirect to="/gallery" /> ) }
      { changePrevUrl && ( <Redirect to="/" /> ) }
      
      {/*----------COLUMNS WITH CONTENT----------*/}

      <Row className="stripContainer">
        <Col xs="3" className="stripContainer__strip">

        </Col>
        <Col xs="3" className="stripContainer__strip">
          
        </Col>
        <Col xs="3" className="stripContainer__strip">
          
        </Col>
        <Col xs="3" className="stripContainer__strip">
          
        </Col>
      </Row>

      {/*----------PRINTER IMAGE----------*/}
      
      <CSSTransition
        in={ true }
        appear={ true }
        unmountOnExit={ true }
        classNames="printerImage"
        timeout={ timeout }
      >
        <div className="printerImage" style={ { backgroundImage: `url( ${ Image } )` } } />
      </CSSTransition>
    </Row>
  );
};

export default About;