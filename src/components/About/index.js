import React, { useState, useEffect } from 'react';
import './index.sass';

import { Row, Col } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';

import Image from '../../assets/images/printer-perspective.png';


const About = props => {


  
  
  //----------ANIMATION SETTINGS----------//

  const timeout = 1000;


  //----------JSX CODE----------//


  return (
    <Row className="about">
      
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