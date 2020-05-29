import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import './index.sass';
import PrinterImage from '../../assets/images/food-printer-w-background.jpg';
import Transition from '../Transition';
import TransitionOut from '../TransitionOut';
import { throttle } from '../../assets/js/throttle';
import { Redirect } from 'react-router-dom';
import Cursor from '../Cursor';

const Home = props => {

  const learnMoreRef = useRef();

  //----------STATE STYLES----------//

  const descriptionFontSize = ( props.clientWidth >= 1200 )
    ? Math.floor( 0.018 * props.clientWidth )
    : null;

  const linkFontSize = ( props.clientWidth >= 1200 )
    ? Math.floor( 0.018 * props.clientWidth * 0.72 )
    : null;

  const state = {
    style: {
      homeImage: {
        backgroundImage: `url( ${ PrinterImage } )`
      },
      homeTitle: {
        fontSize: Math.floor( 0.08 * props.clientWidth )
      },
      homeDescription: {
        fontSize: descriptionFontSize
      },
      link: {
        fontSize: linkFontSize
      }
    }
  }

//----------MOUNT TRANSITION HANDLER----------//

 const [ mountTransition, setMountTransition ] = useState( false );
 const [ changeUrl, setChangeUrl ] = useState( false );

 //----------LEARN MORE HANDLER----------//

 let timeoutNextPage = null;
 const timeoutNextPageFn = () => {
  timeoutNextPage = setTimeout( () => { setChangeUrl( !changeUrl ); }, 1300 );
  timeoutNextPage = null;
 };

 const handleLearnMore = () => {
  setMountTransition( !mountTransition );
  timeoutNextPageFn();
 };
 
 //----------MOUNT ABOUT ON SCROLL----------//
 
 const handleWheel = event => {
  if ( props.menuTest ) {
    return;
  } else {
    if ( event.deltaY > 1 ) {
      handleLearnMore();
     }
  }
 };

 const handleWheelEvent = throttle( handleWheel, 1300 );


 let touchStart = 0;

 const handleTouchStart = event => {
  touchStart = event.touches[ 0 ].pageY;
 };

 const handleTouchEnd = event => {
   const touchEnd = event.changedTouches[ 0 ].pageY;
   if ( props.menuTest ) {
    return;
   } else {
    if ( touchStart > touchEnd ) {
      handleLearnMore();
    } else {
     touchStart = 0;
    }
   }
 };

 const handleTouchEndEvent = throttle( handleTouchEnd, 1300 );

 const homeImageWrapperRef = useRef();
 const homeContentRef = useRef();
 const homeRef = useRef();
 

 useEffect( () => {
  //----------PAGE TITLE----------//

  document.title = 'FoodBot | Innovative 3D printer for food.';

  //----------EVENT LISTENERS----------//

  window.addEventListener( 'wheel', handleWheelEvent, false );
  window.addEventListener( 'touchstart', handleTouchStart, { passive: true } );
  window.addEventListener( 'touchend', handleTouchEndEvent, false );

  // Fix the cursor when menu is open

  if ( props.isAnimationDone ) {
    homeImageWrapperRef.current.style.display = 'none';
    homeContentRef.current.style.display = 'none';
    homeRef.current.style.zIndex = '5';
    homeRef.current.style.pointerEvents = 'none';
  }
  else {
    homeImageWrapperRef.current.removeAttribute('style');
    homeContentRef.current.removeAttribute('style');
    homeRef.current.removeAttribute('style');
  }

  return () => {
    clearTimeout( timeoutNextPage );

    window.removeEventListener( 'wheel', handleWheelEvent, false );
    window.removeEventListener( 'touchstart', handleTouchStart, { passive: true } );
    window.removeEventListener( 'touchend', handleTouchEndEvent, false );
  };
} );



  //----------JSX CODE----------//

  return (
    <Row className="home" ref={ homeRef }>
    <TransitionOut />
    { mountTransition && ( <Transition mountTransition={ mountTransition } /> ) }
    { changeUrl && ( <Redirect to="/about" /> ) }

      {/*----------INTERACTIVE CURSOR----------*/}

      <Cursor
        reference={ props.reference.concat( [ learnMoreRef ] ) }
        type={ props.isAnimationDone ? 'solid' : 'variable' }
        color={ props.isAnimationDone ? 'light' : null }
      />

      {/* ----------PRINTER COLUMN--------- */}


      <Col lg="6" className="homeImageWrapper p-0" ref={ homeImageWrapperRef }>
        <div className="homeImage" style={ state.style.homeImage }/>
      </Col>


      {/* ----------CONTENT COLUMN---------- */}


      <Col lg="6" className="homeContent p-0" ref={ homeContentRef }>

        {/* ----------THIN LINES---------- */}

        <div className="linesContainer">
          <div className="verticalLine" />
          <div className="horizontalLine" />
        </div>

        {/* ----------CONTENT TEXT---------- */}

        <div className="homeDescription" style={ state.style.homeDescription }>
          <span className="d-block">FoodBot 3D printer</span>
          <span className="d-block">is an equipment which</span>
          <span className="d-block">can make food quickly.</span>
          <span className="d-block">It allow you to create</span>
          <span className="d-block">your own dream dessert.</span>
          <br />

          <a
            className="learnMore"
            href="/about"
            onClick={ event => { event.preventDefault(); } }
            ref={ learnMoreRef }
          >
            { props.clientWidth < 1200 && (
                <Button
                  type="button"
                  variant="outline-dark"
                  className="learnMoreButton link"
                  style={ state.style.link }
                  onClick={ handleLearnMore }
                >Learn more</Button>
              )
            }
            {
              props.clientWidth >= 1200 && (
                <div>
                  <p
                    className="link"
                    style={ state.style.link }
                    onClick={ handleLearnMore }
                  >Learn more</p>
                  <span className="underline" />
                </div>  
              )
            }
          </a> 
        </div>
    
        <h1 className="homeTitle" style={ state.style.homeTitle }>FoodBot</h1>
      </Col>
    </Row>
  );
};

export default Home;