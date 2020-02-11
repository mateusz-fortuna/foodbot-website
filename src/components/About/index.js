import React from 'react';
import './index.sass';

import { Row, Col } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';

import Image from '../../assets/images/printer-perspective.png';


const About = props => {

  //----------STRIPS RENDER----------//

  const borderedStrips = [];

  for ( let i = 0; i < 4; i++ ) {
    borderedStrips.push(
      <Col
        xs="3"
        className="stripContainer__strip"
        key={ i }
      /> 
    );
  }
  
  //----------ANIMATION SETTINGS----------//

  const timeout = 1000;


  //----------JSX CODE----------//


  return (
    <Row className="about">
      
      {/*----------STRIPS----------*/}
      
      <Row className="stripContainer">      
        { borderedStrips }
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