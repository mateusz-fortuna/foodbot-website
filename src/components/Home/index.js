import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import './index.sass';
import PrinterImage from '../../assets/images/food-printer-w-background.jpg';
import Transition from '../Transition';
import { throttle } from '../../assets/js/throttle';


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

 //----------LEARN MORE HANDLER----------//
 
 const handleLearnMore = () => {
  setMountTransition( !mountTransition );
  setTimeout( () => { window.location.href = '/#/about'; }, 1300 );
  
  return clearTimeout( setTimeout( () => { window.location.href = '/#/about'; }, 1300 ) );
 };
 
 //----------MOUNT ABOUT ON SCROLL----------//
 
 const handleWheel = event => {
   if ( event.deltaY > 1 ) {
    handleLearnMore();
   }
 };

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
  window.addEventListener( 'wheel', throttle( handleWheel, 1300 ), false );
  window.addEventListener( 'touchstart', event => { handleTouchStart( event ) }, false );
  window.addEventListener( 'touchend', event => { handleTouchEnd( event ) }, false );

  return () => {
    window.removeEventListener( 'wheel', throttle( handleWheel, 1300 ), false );
    window.removeEventListener( 'touchstart', event => { handleTouchStart( event ) }, false );
    window.removeEventListener( 'touchend', event => { handleTouchEnd( event ) }, false );
  };
} );



  //----------JSX CODE----------//

  return (
    <Row className="home">
    { mountTransition && ( <Transition mountTransition={ mountTransition } /> ) }

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