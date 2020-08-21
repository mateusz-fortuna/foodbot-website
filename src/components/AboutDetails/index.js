import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import './index.sass';

const AboutDetails = React.forwardRef( ( props, ref ) => {
  const {
    mount,
    unmount,
    exit,
    name,
    clientWidth,
    clientHeight,
    activeIndex,
    activeIndexHandler,
    data
  } = props;

  const [ leftArrowRef, rightArrowRef, exitButtonRef ] = ref;
 
  let fontMultiplier = ( clientWidth < 992 ) ? 0.08 : 0.05;

  const [ header, setHeader ] = useState( '' );
  
  const animationDuration = 1000;
  const homeTitleFontSize = Math.floor( fontMultiplier * clientWidth );

  const [ imageLoaded, setImageLoaded ] = useState( false );
  const images = require.context( '../../assets/images', true );
  let path = images( `./${ name }.jpg` );

  const toCamelCase = () => {
    let txt = name.split( '' );
    txt[ 0 ] = txt[ 0 ].toUpperCase();
    setHeader( txt.join( '' ) );
  };

  useEffect( () => {
    toCamelCase();

    const image = new Image();
    image.src = path;
    image.onload = () => setImageLoaded( true );
  } );

  console.log( data[ activeIndex ].name );

  return (
    <CSSTransition
      in={ mount }
      mountOnEnter
      unmountOnExit
      timeout={ animationDuration }
      onExited={ unmount }
    >
      <Row className="aboutDetails">
        <CSSTransition
          in={ mount }
          appear
          mountOnEnter
          unmountOnExit
          timeout={ animationDuration }
          classNames="aboutDetails__container"
        >
          <Col className="aboutDetails__container">
            <Row className="h-100">
              <Col lg={ 6 } className="p-0">
                <Col xs={ 6 } className="aboutDetails--verticalLine d-inline-flex">
                  <div
                    className="aboutDetails--imageWrapper"
                    style={ {
                      height: ( 0.5 * window.innerWidth - 48 * 2 ) * clientHeight / clientWidth,
                      width: ( clientWidth < 992 ) ? 'calc( 200% - 24px * 2 )' : 'calc( 200% - 48px * 2 )',
                      left: ( clientWidth < 992 ) ? '24px' : '48px'
                    } }
                  >
                    { imageLoaded
                      ? ( <CSSTransition
                            in={ imageLoaded && mount }
                            appear
                            mountOnEnter
                            unmountOnExit
                            timeout={ animationDuration }
                            classNames="aboutDetails--image"
                          >
                            <img src={ path } alt={ name } className="aboutDetails--image" />
                          </CSSTransition> )
                      : null}
                  </div>
                  <p
                    className="aboutDetails--text"
                    style={ { left: ( clientWidth < 992 ) ? '24px' : '48px' } }
                  >
                    0{ activeIndex + 1 }/0{ data.length }
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    className="arrow leftArrow"
                    ref={ leftArrowRef }
                    style={ {
                      width: 0.7 * homeTitleFontSize,
                      height: 0.7 * homeTitleFontSize,
                    } }
                  >
                    <path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm-4.828 11.5l4.608 3.763-.679.737-6.101-5 6.112-5 .666.753-4.604 3.747h11.826v1h-11.828z"/>
                  </svg>
                </Col>
                <Col xs={ 6 } className="aboutDetails--verticalLine d-inline-flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    className="arrow rightArrow"
                    ref={ rightArrowRef }
                    style={ {
                      width: 0.7 * homeTitleFontSize,
                      height: 0.7 * homeTitleFontSize
                    } }
                  >
                    <path d="M12 0c-6.623 0-12 5.377-12 12s5.377 12 12 12 12-5.377 12-12-5.377-12-12-12zm0 1c-6.071 0-11 4.929-11 11s4.929 11 11 11 11-4.929 11-11-4.929-11-11-11zm4.828 11.5l-4.608 3.763.679.737 6.101-5-6.112-5-.666.753 4.604 3.747h-11.826v1h11.828z"/>
                  </svg>
                </Col>
              </Col>
              
              <Col lg={ 6 } className="aboutDetails__data">
                <button onClick={ exit } ref={ exitButtonRef } className="exitButton">
                  <span className="crossLine" />
                  <span className="crossLine" />
                </button>
                <h1
                  className="homeTitle"
                  style={ {
                    fontSize: homeTitleFontSize,
                    lineHeight: homeTitleFontSize +"px"
                  } }
                > { header } </h1>
                
              </Col>
            </Row>
          </Col>
        </CSSTransition>
      </Row>
    </CSSTransition>
  );
} );

export default AboutDetails;