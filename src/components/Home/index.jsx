import React, { useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import './index.sass';
import PrinterImage from '../../assets/images/food-printer-w-background.jpg';
import TransitionOut from '../TransitionOut';
import Cursor from '../Cursor';
import Text from '../Text';
import MultiLinesText from '../MultiLinesText';
import DiscoverFeaturesButton from '../DiscoverFeaturesButton';

const Home = (props) => {
  const homeImageWrapperRef = useRef();
  const homeContentRef = useRef();
  const homeRef = useRef();

  const {
    clientWidth,
    setLogoIsMounted,
    isAnimationDone,
    reference,
    discoverFeaturesButtonRef,
  } = props;

  // ----------STATE STYLES----------//

  const descriptionFontSize = clientWidth >= 1200 ? Math.floor(0.018 * clientWidth) : null;
  const linkFontSize = clientWidth >= 1200 ? Math.floor(0.018 * clientWidth * 0.72) : null;

  const state = {
    style: {
      homeImage: {
        backgroundImage: `url( ${PrinterImage} )`,
      },
      homeTitle: {
        fontSize: Math.floor(0.08 * clientWidth),
      },
      homeDescription: {
        fontSize: descriptionFontSize,
      },
      link: {
        fontSize: linkFontSize,
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

  // ----------COMPONENT DID MOUNT----------//

  useEffect(() => {
    setLogoIsMounted(true);
    return () => setLogoIsMounted(false);
  }, [setLogoIsMounted]);

  // ----------JSX CODE----------//

  return (
    <Row className="home" ref={homeRef}>
      <TransitionOut />

      {/* ----------INTERACTIVE CURSOR----------*/}

      {clientWidth > 768 && (
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

        <div className="homeDescription" style={state.style.homeDescription}>
          <MultiLinesText category="home" textID="description" />
          <br />

          <a
            className="learnMore"
            href="/about"
            onClick={(event) => {
              event.preventDefault();
            }}
            ref={discoverFeaturesButtonRef}
          >
            <DiscoverFeaturesButton clientWidth={clientWidth} style={state.style.link} />
          </a>
        </div>

        <h1 className="homeTitle" style={state.style.homeTitle}>
          <Text category="home" textID="title" />
        </h1>
      </Col>
    </Row>
  );
};

export default Home;
