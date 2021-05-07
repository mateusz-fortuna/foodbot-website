import React, { useCallback, useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Cursor from '../Cursor';
import TransitionOut from '../Transitions/TransitionOut';
import './index.sass';

const Contact = ({ reference }) => {
  // ----------REFERENCES---------- //

  const [form, setForm] = useState(null);
  const formRef = useCallback((node) => setForm(node), []);

  // ----------THE CURSOR BEHAVIOUR ON FORM---------- //

  const [renderCursor, setRenderCursor] = useState(true);
  const [cursorColor, setCursorColor] = useState('light');

  const showCursor = () => {};
  const setDarkCursor = () => setCursorColor('dark');
  const setLightCursor = () => setCursorColor('light');

  useEffect(() => {
    if (form) {
      form.addEventListener('mouseenter', setDarkCursor);
      form.addEventListener('mouseleave', setLightCursor);
    }

    return () => {
      if (form) {
        form.removeEventListener('mouseenter', setDarkCursor);
        form.removeEventListener('mouseleave', setLightCursor);
      }
    };
  });

  return (
    <Row className="contact justify-content-center align-items-center">
      <TransitionOut />
      <Cursor reference={reference} type="solid" color={cursorColor} />

      <Col md={6}>
        <h1 className="contact__description">Do you have any questions? Contact us!</h1>

        <form className="contact__form" ref={formRef}>
          <div className="contact__form_group form-group">
            <label htmlFor="inputEmail">Email address</label>
            <input type="email" className="form-control" placeholder="Enter your email" />
          </div>
        </form>
      </Col>
    </Row>
  );
};

export default Contact;
