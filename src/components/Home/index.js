import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import './index.sass';
import PrinterImage from '../../assets/images/food-printer-w-background.jpg';
import Transition from '../Transition';
import TransitionOut from '../TransitionOut';
import { throttle } from '../../assets/js/throttle';
import { Redirect } from 'react-router-dom';
import Cursor from '../Cursor';
import Text from '../Text';
import MultiLinesText from '../MultiLinesText';

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
  timeoutNextPage = setTimeout( () => { setChangeUrl( !changeUrl ); }, 1000 );
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

 const handleWheelEvent = throttle( handleWheel, 1000 );


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

 const handleTouchEndEvent = throttle( handleTouchEnd, 1000 );

 const homeImageWrapperRef = useRef();
 const homeContentRef = useRef();
 const homeRef = useRef();
 

 useEffect( () => {
  //----------EVENT LISTENERS----------//

  window.addEventListener( 'wheel', handleWheelEvent, false );
  window.addEventListener( 'touchstart', handleTouchStart, { passive: true } );
  window.addEventListener( 'touchend', handleTouchEndEvent, false );

  // Fix the cursor when menu is open

  if ( props.isAnimationDone ) {
    homeImageWrapperRef.current.style.display = 'none';
    homeContentRef.current.style.display = 'none';
    homeRef.current.style.zIndex = '50';
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

  //----------COMPONENT DID MOUNT----------//

  const { setLogoIsMounted } = props;
  
  useEffect( () => {
    setLogoIsMounted( true );
    return () => setLogoIsMounted( false );
  }, [ setLogoIsMounted ] );


  //----------JSX CODE----------//

  return (
    <Row className="home" ref={ homeRef }>
    <TransitionOut />
    { mountTransition && ( <Transition mountTransition={ mountTransition } /> ) }
    { changeUrl && ( <Redirect to="/about" /> ) }

      {/*----------INTERACTIVE CURSOR----------*/}

      { ( props.clientWidth > 768 ) && <Cursor
        reference={ props.reference.concat( [ learnMoreRef ] ) }
        type={ props.isAnimationDone ? 'solid' : 'variable' }
        color={ props.isAnimationDone ? 'light' : null }
      /> }

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
          <MultiLinesText category="home" textID="description" />
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
                >
                  <Text category="home" textID="button" />
                </Button>
              )
            }
            {
              props.clientWidth >= 1200 && (
                <div>
                  <p
                    className="link"
                    style={ state.style.link }
                    onClick={ handleLearnMore }
                  >
                    <Text category="home" textID="button" />
                  </p>
                  <span className="underline" />
                </div>  
              )
            }
          </a> 
        </div>
    
        <h1 className="homeTitle" style={ state.style.homeTitle }><Text category="home" textID="title" /></h1>
      </Col>
    </Row>
  );
};

export default Home;