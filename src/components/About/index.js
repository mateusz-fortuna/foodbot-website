import React, { useState, useEffect, useRef, createRef } from 'react';
import './index.sass';

import { Row, Col } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import Transition from '../Transition';
import Circle from '../Circle';
import Cursor from '../Cursor';
import AboutDetails from '../AboutDetails/index.js';

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
    //----------PAGE TITLE----------//

    document.title = 'About | FoodBot';

    //----------EVENT LISTENERS----------//

    window.addEventListener( 'wheel', handleWheelEvent, false );
    window.addEventListener( 'touchstart', handleTouchStart, { passive: true } );
    window.addEventListener( 'touchend', handleTouchEndEvent, false );
    window.addEventListener( 'keyup', exitDetailsUsingEsc );
  
    return () => {
      clearTimeout( timeoutNextPage );
      clearTimeout( timeoutPrevPage );

      window.removeEventListener( 'wheel', handleWheelEvent, false );
      window.removeEventListener( 'touchstart', handleTouchStart, { passive: true } );
      window.removeEventListener( 'touchend', handleTouchEndEvent, false );
      window.removeEventListener( 'keyup', exitDetailsUsingEsc );
    };
  } );
  //----------ANIMATION SETTINGS----------//

  const timeout = 1000;

  //----------DYNAMICALLY GENERATED CONTENT----------//

  const circlesName = [
    { name: 'basis', left: 32, top: 69 },
    { name: 'head', left: 48, top: 60 },
    { name: 'fence', left: 38, top: 40 },
    { name: 'logo', left: 53, top: 27 },
    { name: 'screen', left: 80, top: 28 }
  ];
  let circles = [];
  let circlesRef = useRef( circlesName.map( () => createRef() ) );

  const [ detailsOpened, setDetailsOpened ] = useState( false );
  const [ activeCircleName, setActiveCircleName ] = useState( '' );

  const handleCircleClick = name => { 
    setDetailsOpened( true );
    setExitButton( true );
    setActiveCircleName( name );
  };

  const circlesGenerator = () => {
    circlesName.map( ( item, index ) => circles.push(
        <div
          ref={ circlesRef.current[ index ] }
          key={ index }
          id={ item.name }
          className="circleWrapper"
          onClick={ () => handleCircleClick( item.name ) }
          style={ {
            left: `${ circlesName[ index ].left }%`,
            top: `${ circlesName[ index ].top }%`
          } }
        > 
            <Circle/>
        </div>
    ) );
  };

  circlesGenerator();

  //----------EXIT FROM DETAILS----------//

  const [ exitButton, setExitButton ] = useState( true );
  const handleExit = () => setExitButton( false );
  const exitDetailsUsingEsc = event => {
    if ( detailsOpened && event.key === 'Escape' ) handleExit();
  };
  const unmountDetails = () => setDetailsOpened( false );

  //----------DETAILS CURSOR COLOR----------//

  let detailsCursorColor = detailsOpened ? 'details' : 'default';

  //----------CURSOR REFs WITH EXIT BUTTON----------//

  const exitButtonRef = createRef();

  let aboutRefs = 
    detailsOpened
      ? props.reference.concat( circlesRef.current ).concat( exitButtonRef )
      : props.reference.concat( circlesRef.current );

  //----------JSX CODE----------//

  return (
    <Row className="about">
      { mountTransition && ( <Transition mountTransition={ mountTransition }/> ) }

      { changeNextUrl && ( <Redirect to="/gallery" /> ) }
      { changePrevUrl && ( <Redirect to="/" /> ) }

      {/*----------INTERACTIVE CURSOR----------*/}

      <Cursor reference={ aboutRefs } type="about" color={ detailsCursorColor } testRef={ exitButtonRef } />
      
      {/*----------COLUMNS WITH CONTENT----------*/}

      <Row className="stripContainer">
        <Col className="stripContainer__strip">
          <div
            className="stripContainer__strip__inner"
            style={ {
              width: props.clientHeight,
              height: props.clientHeight
            } }
          >  
            <div
              style={ { 
                width: props.clientWidth * 0.9,
                maxWidth: '857px',
                height: props.clientHeight * 0.9,
                maxHeight: props.clientWidth < 768 ? '550px' : 'unset',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                position: 'absolute'
               } }
            >
              { circles }
            </div>
          </div>
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
        <div className="printerImage" style={ { backgroundImage: `url( ${ Image } )` } }/>
      </CSSTransition>

      {/*----------DETAILS----------*/}

      { detailsOpened &&
        <AboutDetails
          mount={ exitButton }
          unmount={ unmountDetails }
          exit={ handleExit }
          ref={ exitButtonRef }
          name={ activeCircleName }
          revRatio= { props.clientHeight / props.clientWidth }
        />
      }
    </Row>
  );
};

export default About;