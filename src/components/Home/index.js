import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './index.sass';
import PrinterImage from '../../assets/images/food-printer-w-background.jpg';

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

  //----------JSX CODE----------//

  return (
    <Row className="home">

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
          <Link to="/about">
            { props.clientWidth < 1200 && (
                <Button
                  type="button"
                  variant="outline-dark"
                  className="learnMoreButton link"
                  style={ state.style.link }
                >Learn more</Button>
              )
            }
            {
              props.clientWidth >= 1200 && (
                <div>
                  <p className="link" style={ state.style.link }>Learn more</p>
                  <span className="underline" />
                </div>  
              )
            }
          </Link> 
        </div>
    
        <h1 className="homeTitle" style={ state.style.homeTitle }>FoodBot</h1>
      </Col>
    </Row>
  );
};

export default Home;