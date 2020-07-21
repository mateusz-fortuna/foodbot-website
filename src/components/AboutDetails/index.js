import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import './index.sass';

const AboutDetails = React.forwardRef( ( props, ref ) => {
  const { mount, unmount, exit } = props;

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
            <button onClick={ exit } ref={ ref } className="exitButton">
              <span className="crossLine" />
              <span className="crossLine" />
            </button>
          </Col>
        </CSSTransition>
      </Row>
    </CSSTransition>
  );
} );

export default AboutDetails;