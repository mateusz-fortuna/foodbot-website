import React, { useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import './index.sass';
import PrinterImage from '../../assets/images/food-printer-w-background.jpg';
import TransitionOut from '../Transitions/TransitionOut';
import Cursor from '../Cursor';
import Text from '../Text/Text';
import MultiLinesText from '../Text/MultiLinesText';
import DiscoverFeaturesButton from './DiscoverFeaturesButton';

const Home = ({
  clientWidth,
  isAnimationDone,
  reference,
  discoverFeaturesButtonRef,
  isCursorVisible,
}) => {
  const homeImageWrapperRef = useRef();
  const homeContentRef = useRef();
  const homeRef = useRef();

  // ----------STATE STYLES----------//

  const state = {
    style: {
      homeImage: {
        backgroundImage: `url( ${PrinterImage} )`,
      },
    },
  };

  useEffect(() => {
    // Fix the cursor when menu is open
    if (isAnimationDone) {
      homeImageWrapperRef.current.style.display = 'none';
      homeContentRef.current.style.display = 'none';
      homeRef.current.style.zIndex = '50';
      homeRef.current.style.pointerEvents = 'none';
    } else {
      homeImageWrapperRef.current.removeAttribute('style');
      homeContentRef.current.removeAttribute('style');
      homeRef.current.removeAttribute('style');
    }
  });

  // ----------JSX CODE----------//

  return (
    <Row className="home" ref={homeRef}>
      <TransitionOut />

      {/* ----------INTERACTIVE CURSOR----------*/}

      {isCursorVisible && (
        <Cursor
          reference={reference.concat([discoverFeaturesButtonRef])}
          type={isAnimationDone ? 'solid' : 'variable'}
          color={isAnimationDone ? 'light' : null}
        />
      )}

      {/* ----------PRINTER COLUMN--------- */}

      <Col lg="6" className="homeImageWrapper p-0" ref={homeImageWrapperRef}>
        <div className="homeImage" style={state.style.homeImage} />
      </Col>

      {/* ----------CONTENT COLUMN---------- */}

      <Col lg="6" className="homeContent p-0" ref={homeContentRef}>
        {/* ----------THIN LINES---------- */}

        <div className="linesContainer">
          <div className="verticalLine" />
          <div className="horizontalLine" />
        </div>

        {/* ----------CONTENT TEXT---------- */}

        <div className="homeDescription">
          <MultiLinesText category="home" textID="description" />
          <a
            className="learnMore"
            href="/about"
            onClick={(event) => {
              event.preventDefault();
            }}
          >
            <DiscoverFeaturesButton
              reference={discoverFeaturesButtonRef}
              target="features"
              clientWidth={clientWidth}
            />
          </a>
        </div>

        <h1 className="homeTitle">
          <Text category="home" textID="title" />
        </h1>
      </Col>
    </Row>
  );
};

export default Home;
