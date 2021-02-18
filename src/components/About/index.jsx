import React, { useState, useEffect, useRef, createRef } from 'react';
import './index.sass';
import { Row, Col } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import Circle from '../Circle';
import Cursor from '../Cursor';
import AboutDetails from '../AboutDetails';
import Image from '../../assets/images/printer-perspective.png';

const About = (props) => {
  /* let touchStart = 0;

  const handleTouchStart = (event) => {
    touchStart = event.touches[0].pageY;
  };

  const handleTouchEnd = (event) => {
    const touchEnd = event.changedTouches[0].pageY;

    if (touchStart > touchEnd) {
      setMountTransition(!mountTransition);
      timeoutNextPageFn();
    } else if (touchStart === touchEnd) {
      return null;
    } else {
      setMountTransition(!mountTransition);
      timeoutPrevPageFn();
    }
  };

  const handleTouchEndEvent = throttle(handleTouchEnd, 1300);

  useEffect(() => {
    // ----------EVENT LISTENERS----------//

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEndEvent, false);
    window.addEventListener('keyup', exitDetailsUsingEsc);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart, { passive: true });
      window.removeEventListener('touchend', handleTouchEndEvent, false);
      window.removeEventListener('keyup', exitDetailsUsingEsc);
    };
  }); */

  // ----------ANIMATION SETTINGS----------//

  const timeout = 1000;

  // ----------DYNAMICALLY GENERATED CONTENT----------//

  const circlesName = [
    { name: 'basis', left: 32, top: 69 },
    { name: 'head', left: 48, top: 60 },
    { name: 'fence', left: 38, top: 40 },
    { name: 'logo', left: 53, top: 27 },
    { name: 'screen', left: 80, top: 28 },
  ];
  const circles = [];
  const circlesRef = useRef(circlesName.map(() => createRef()));

  const [detailsOpened, setDetailsOpened] = useState(false);
  const [activeCircleName, setActiveCircleName] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const handleCircleClick = (name, index) => {
    setDetailsOpened(true);
    setExitButton(true);
    setActiveCircleName(name);
    setActiveIndex(index);
  };

  const circlesGenerator = () => {
    circlesName.map((item, index) =>
      circles.push(
        <div
          ref={circlesRef.current[index]}
          key={index}
          id={item.name}
          className="circleWrapper"
          onClick={() => handleCircleClick(item.name, index)}
          style={{
            left: `${circlesName[index].left}%`,
            top: `${circlesName[index].top}%`,
          }}
        >
          <Circle />
        </div>
      )
    );
  };

  circlesGenerator();

  // ----------EXIT FROM DETAILS----------//

  const [exitButton, setExitButton] = useState(true);
  const handleExit = () => setExitButton(false);
  const exitDetailsUsingEsc = (event) => {
    if (detailsOpened && event.key === 'Escape') handleExit();
  };
  const unmountDetails = () => setDetailsOpened(false);

  // ----------DETAILS CURSOR COLOR----------//

  const detailsCursorColor = detailsOpened ? 'details' : 'default';

  // ----------CURSOR REFs WITH EXIT BUTTON----------//

  const leftArrowRef = createRef();
  const rightArrowRef = createRef();
  const exitButtonRef = createRef();
  const detailsRefs = [leftArrowRef, rightArrowRef, exitButtonRef];

  const aboutRefs = detailsOpened
    ? props.reference.concat([circlesRef.current, detailsRefs])
    : props.reference.concat(circlesRef.current);

  // ----------JSX CODE----------//

  return (
    <Row className="about">
      {/* ----------INTERACTIVE CURSOR----------*/}

      {props.clientWidth > 768 && (
        <Cursor
          reference={aboutRefs}
          type="about"
          color={detailsCursorColor}
          testRef={detailsRefs}
        />
      )}

      {/* ----------COLUMNS WITH CONTENT----------*/}

      <Row className="stripContainer">
        <Col className="stripContainer__strip">
          <div
            className="stripContainer__strip__inner"
            style={{
              width: props.clientHeight,
              height: props.clientHeight,
            }}
          >
            <div
              style={{
                width: props.clientWidth * 0.9,
                maxWidth: '857px',
                height: props.clientHeight * 0.9,
                maxHeight: props.clientWidth < 768 ? '550px' : 'unset',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                position: 'absolute',
              }}
            >
              {circles}
            </div>
          </div>
        </Col>
      </Row>

      {/* ----------PRINTER IMAGE----------*/}

      <CSSTransition in appear unmountOnExit classNames="printerImage" timeout={timeout}>
        <div className="printerImage" style={{ backgroundImage: `url( ${Image} )` }} />
      </CSSTransition>

      {/* ----------DETAILS----------*/}

      {detailsOpened && (
        <AboutDetails
          mount={exitButton}
          unmount={unmountDetails}
          exit={handleExit}
          ref={detailsRefs}
          name={activeCircleName}
          clientHeight={props.clientHeight}
          clientWidth={props.clientWidth}
          activeIndex={activeIndex}
          data={circlesName}
          setActiveIndex={setActiveIndex}
        />
      )}
    </Row>
  );
};

export default About;
