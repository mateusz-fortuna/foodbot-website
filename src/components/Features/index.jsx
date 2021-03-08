import React, { useState, useRef, createRef, useEffect } from 'react';
import './index.sass';
import { Row, Col } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import Circle from '../Circle';
import Cursor from '../Cursor';
import FeaturesDetails from '../FeaturesDetails';
import Image from '../../assets/images/printer-perspective.png';

const Features = (props) => {
  const [exitButton, setExitButton] = useState(true);
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [activeCircleName, setActiveCircleName] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const { reference, clientWidth, clientHeight } = props;

  // ----------CURSOR REFs WITH EXIT BUTTON----------//

  const leftArrowRef = createRef();
  const rightArrowRef = createRef();
  const exitButtonRef = createRef();
  const detailsRefs = [leftArrowRef, rightArrowRef, exitButtonRef];

  // ----------EXIT FROM DETAILS----------//

  const handleExit = () => setExitButton(false);
  const exitDetailsUsingEsc = (event) => {
    if (detailsOpened && event.key === 'Escape') handleExit();
  };
  const unmountDetails = () => setDetailsOpened(false);

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

  const handleCircleClick = (name, index) => {
    setDetailsOpened(true);
    setExitButton(true);
    setActiveCircleName(name);
    setActiveIndex(index);
  };

  const circles = [];
  const circlesRef = useRef(circlesName.map(() => createRef()));

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

  const aboutRefs = detailsOpened
    ? reference.concat([circlesRef.current, detailsRefs])
    : reference.concat(circlesRef.current);

  // ----------DETAILS CURSOR COLOR----------//

  const detailsCursorColor = detailsOpened ? 'details' : 'default';

  useEffect(() => {
    window.addEventListener('keyup', exitDetailsUsingEsc);
    return () => window.removeEventListener('keyup', exitDetailsUsingEsc);
  });

  // ----------JSX CODE----------//

  return (
    <Row className="about">
      {/* ----------INTERACTIVE CURSOR----------*/}

      {clientWidth > 768 && (
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
              width: clientHeight,
              height: clientHeight,
            }}
          >
            <div
              style={{
                width: clientWidth * 0.9,
                maxWidth: '857px',
                height: clientHeight * 0.9,
                maxHeight: clientWidth < 768 ? '550px' : 'unset',
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
        <FeaturesDetails
          mount={exitButton}
          unmount={unmountDetails}
          exit={handleExit}
          ref={detailsRefs}
          name={activeCircleName}
          clientHeight={clientHeight}
          clientWidth={clientWidth}
          activeIndex={activeIndex}
          data={circlesName}
          setActiveIndex={setActiveIndex}
        />
      )}
    </Row>
  );
};

export default Features;
