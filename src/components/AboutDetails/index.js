import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import './index.sass';

const AboutDetails = React.forwardRef( ( props, ref ) => {
  
  const { mount, unmount, exit, name, revRatio } = props;
  const [ header, setHeader ] = useState( '' );
  const [ imageLoaded, setImageLoaded ] = useState( false );

  const images = require.context( '../../assets/images', true );
  let path = images( `./${ name }.jpg` );

  const toCamelCase = () => {
    let txt = name.split('');
    txt[0] = txt[0].toUpperCase();
    setHeader( txt.join('') );
  };

  useEffect( () => {
    toCamelCase();

    const image = new Image();
    image.src = path;
    image.onload = () => setImageLoaded( true );
  } );

  const animationDuration = 1000;

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
              <Col xs={ 3 } className="aboutDetails--verticalLine">
                <div
                  className="aboutDetails--imageWrapper"
                  style={ { height: ( 0.5 * window.innerWidth - 48 * 2 ) * revRatio } }
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
              </Col>
              <Col xs={ 3 } className="aboutDetails--verticalLine"/>
              <Col sm={ 6 } className="aboutDetails__data">
                <button onClick={ exit } ref={ ref } className="exitButton">
                  <span className="crossLine" />
                  <span className="crossLine" />
                </button>
                <h1
                  className="homeTitle"
                  style={ { fontSize: Math.floor( 0.05 * window.innerWidth ) } }
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