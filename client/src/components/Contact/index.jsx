import React, { useCallback, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import TransitionOut from '../Transitions/TransitionOut';
import Cursor from '../Cursor';
import ContactForm from './Form';
import './index.sass';

const Contact = ({
  reference,
  setPreventNavigation,
  isCursorVisible,
  windowWidth,
  windowHeight,
}) => {
  // ----------STATE---------- //

  const [renderCursor, setRenderCursor] = useState(true);
  const [cursorColor, setCursorColor] = useState('light');
  const [submitButton, setSubmitButton] = useState(null);

  // ----------REFERENCES---------- //

  const submitButtonRef = useCallback((node) => setSubmitButton(node), []);
  const cursorReferences = reference.concat({ current: submitButton });

  // ----------JSX---------- //

  return (
    <Row className="contact align-items-center">
      <TransitionOut />
      {isCursorVisible && renderCursor && (
        <Cursor reference={cursorReferences} type="solid" color={cursorColor} />
      )}

      {windowWidth >= 768 && <Col md={2} />}

      <Col md={6}>
        {windowHeight > 600 ? (
          <h1 className="contact__description">Do you have any questions? Contact&nbsp;us!</h1>
        ) : (
          <h1 className="contact__description">Contact us!</h1>
        )}
        <ContactForm
          setRenderCursor={setRenderCursor}
          setCursorColor={setCursorColor}
          setPreventNavigation={setPreventNavigation}
          submitButtonRef={submitButtonRef}
          submitButton={submitButton}
        />
      </Col>
    </Row>
  );
};

export default Contact;
