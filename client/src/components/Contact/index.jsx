import React, { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import { debounce } from 'lodash';
import Cursor from '../Cursor';
import TransitionOut from '../Transitions/TransitionOut';
import './index.sass';

const Contact = ({ reference, setPreventNavigation }) => {
  // ----------STATE---------- //

  const [formData, setFormData] = useState({});

  // ----------HANDLERS---------- //

  const handleFormSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3001/contact/submit', formData).catch((err) => console.error(err));
  };

  const handleInputChange = (event) => {
    event.preventDefault();

    const { target } = event;
    const name = target.name;
    const value = target.value;

    setFormData((formData) => ({ ...formData, [name]: value }));

    // Prevent scroll navigation when the input contains a text

    if (target.value) return setPreventNavigation(true);
    return setPreventNavigation(false);
  };
  const debouncedInputChange = debounce(handleInputChange, 300);

  // ----------REFERENCES---------- //

  const [inputs, setInputs] = useState([]);
  const [form, setForm] = useState(null);
  const [submitButton, setSubmitButton] = useState(null);

  const inputRef = useCallback((node) => setInputs((inputs) => [...inputs, node]), []);
  const formRef = useCallback((node) => setForm(node), []);
  const submitButtonRef = useCallback((node) => setSubmitButton(node), []);

  // ----------THE CURSOR BEHAVIOR ON FORM---------- //

  const [renderCursor, setRenderCursor] = useState(true);
  const [cursorColor, setCursorColor] = useState('light');

  const showCursor = () => setRenderCursor(true);
  const hideCursor = () => setRenderCursor(false);
  const setDarkCursor = () => setCursorColor('dark');
  const setLightCursor = () => setCursorColor('light');

  useEffect(() => {
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
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
        form.removeEventListener('submit', handleFormSubmit);
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
      {renderCursor && (
        <Cursor reference={[reference, submitButton]} type="solid" color={cursorColor} />
      )}

      <Col md={2} />
      <Col md={6}>
        <h1 className="contact__description">Do you have any questions? Contact us!</h1>

        <form className="contact__form" ref={formRef}>
          <div className="contact__form_group form-group">
            <label htmlFor="inputName">Name</label>
            <input
              type="text"
              name="name"
              required
              className="form-control"
              placeholder="Enter your name"
              ref={inputRef}
              onChange={debouncedInputChange}
            />
          </div>
          <div className="contact__form_group form-group">
            <label htmlFor="inputEmail">Email address</label>
            <input
              type="email"
              name="email"
              required
              className="form-control"
              placeholder="Enter your email"
              ref={inputRef}
              onChange={debouncedInputChange}
            />
          </div>
          <div className="contact__form_group form-group">
            <label htmlFor="inputMessage">Message</label>
            <textarea
              name="feedback"
              required
              rows="7"
              className="form-control"
              placeholder="What would you like to chat about?"
              ref={inputRef}
              onChange={debouncedInputChange}
            />
          </div>
          <input type="submit" value="Submit" ref={submitButtonRef} />
        </form>
      </Col>
    </Row>
  );
};

export default Contact;
