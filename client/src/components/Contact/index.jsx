import React, { useCallback, useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Cursor from '../Cursor';
import TransitionOut from '../Transitions/TransitionOut';
import './index.sass';

const Contact = ({ reference }) => {
  // ----------REFERENCES---------- //

  const [inputs, setInputs] = useState([]);
  const [form, setForm] = useState(null);
  const inputRef = useCallback((node) => setInputs((inputs) => [...inputs, node]), []);
  const formRef = useCallback((node) => setForm(node), []);

  // ----------THE CURSOR BEHAVIOR ON FORM---------- //

  const [renderCursor, setRenderCursor] = useState(true);
  const [cursorColor, setCursorColor] = useState('light');

  const showCursor = () => setRenderCursor(true);
  const hideCursor = () => setRenderCursor(false);
  const setDarkCursor = () => setCursorColor('dark');
  const setLightCursor = () => setCursorColor('light');

  useEffect(() => {
    if (form) {
      form.addEventListener('mouseenter', setDarkCursor);
      form.addEventListener('mouseleave', setLightCursor);
    }
    if (inputs.length) {
      inputs.forEach((input) => {
        if (input) {
          input.addEventListener('focusin', hideCursor);
          ['focusout', 'mouseleave'].forEach((evt) => input.addEventListener(evt, showCursor));
        }
      });
    }

    return () => {
      if (form) {
        form.removeEventListener('mouseenter', setDarkCursor);
        form.removeEventListener('mouseleave', setLightCursor);
      }
      if (inputs.length) {
        inputs.forEach((input) => {
          if (input) {
            input.removeEventListener('focusin', hideCursor);
            ['focusout', 'mouseleave'].forEach((evt) => input.removeEventListener(evt, showCursor));
          }
        });
      }
    };
  });

  return (
    <Row className="contact align-items-center">
      <TransitionOut />
      {renderCursor && <Cursor reference={reference} type="solid" color={cursorColor} />}

      <Col md={2} />
      <Col md={6}>
        <h1 className="contact__description">Do you have any questions? Contact us!</h1>

        <form className="contact__form" ref={formRef}>
          <div className="contact__form_group form-group">
            <label htmlFor="inputEmail">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              ref={inputRef}
            />
          </div>
        </form>
      </Col>
    </Row>
  );
};

export default Contact;
