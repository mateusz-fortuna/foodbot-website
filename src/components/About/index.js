import React from 'react';
import './index.sass';

import { Row, Col } from 'react-bootstrap';


const About = props => {
  const borderedStrips = [];

  for ( let i = 0; i < 3; i++ ) {
    borderedStrips.push(
      <Col
        xs="3"
        className="stripContainer__strip stripContainer__strip--bordered"
        key={ i }
      /> 
    );
  }
  
  return (
    <Row className="about">
      <Row className="stripContainer">
        <Col xs="3" className="stripContainer__strip" />        
        { borderedStrips }
      </Row>
    </Row>
  );
};

export default About;