import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import './index.sass';
import PrinterImage from '../../assets/images/food-printer-w-background.jpg';
import Transition from '../Transition';
import TransitionOut from '../TransitionOut';
import { throttle } from '../../assets/js/throttle';
import { Redirect } from 'react-router-dom';

const Home = props => {

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
   if ( event.deltaY > 1 ) {
    handleLearnMore();
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
     handleLearnMore();
   } else {
    touchStart = 0;
   }
 };
 
 useEffect( () => {
  window.addEventListener( 'wheel', handleWheelEvent, false );
  window.addEventListener( 'touchstart', handleTouchStart, { passive: true } );
  window.addEventListener( 'touchend', handleTouchEnd, false );

  return () => {
    clearTimeout( timeoutNextPage );

    window.removeEventListener( 'wheel', handleWheelEvent, false );
    window.removeEventListener( 'touchstart', handleTouchStart, { passive: true } );
    window.removeEventListener( 'touchend', handleTouchEnd, false );
  };
} );



  //----------JSX CODE----------//

  return (
    <Row className="home">
    <TransitionOut />
    { mountTransition && ( <Transition mountTransition={ mountTransition } /> ) }
    { changeUrl && ( <Redirect to="/about" /> ) }

      {/* ----------PRINTER COLUMN--------- */}


      <Col lg="6" className="homeImageWrapper p-0">
        <div className="homeImage" style={ state.style.homeImage }/>
      </Col>


      {/* ----------CONTENT COLUMN---------- */}


      <Col lg="6" className="homeContent p-0">

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