import React, { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import { debounce } from 'lodash';
import Cursor from '../Cursor';
import TransitionOut from '../Transitions/TransitionOut';
import './index.sass';
import ContactForm from './Form';

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
  const cursorReferences = reference.concat({ current: submitButton });

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

  // ----------EVENT LISTENERS---------- //

  useEffect(() => {
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
      form.addEventListener('mouseenter', setDarkCursor);
      form.addEventListener('mouseleave', setLightCursor);
    }
    inputs.length &&
      inputs.forEach((input) => {
        input.addEventListener('focusin', hideCursor);
        ['focusout', 'mouseleave'].forEach((evt) => input.addEventListener(evt, showCursor));
      });

    return () => {
      if (form) {
        form.removeEventListener('submit', handleFormSubmit);
        form.removeEventListener('mouseenter', setDarkCursor);
        form.removeEventListener('mouseleave', setLightCursor);
      }
      inputs.length &&
        inputs.forEach((input) => {
          input.removeEventListener('focusin', hideCursor);
          ['focusout', 'mouseleave'].forEach((evt) => input.removeEventListener(evt, showCursor));
        });
    };
  });

  return (
    <Row className="contact align-items-center">
      <TransitionOut />
      {renderCursor && <Cursor reference={cursorReferences} type="solid" color={cursorColor} />}

      <Col md={2} />
      <Col md={6}>
        <h1 className="contact__description">Do you have any questions? Contact us!</h1>
        <ContactForm
          formRef={formRef}
          inputRef={inputRef}
          submitButtonRef={submitButtonRef}
          inputChangeHandler={debouncedInputChange}
        />
      </Col>
    </Row>
  );
};

export default Contact;
