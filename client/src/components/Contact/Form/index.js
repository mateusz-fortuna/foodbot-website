import React, { useEffect, useCallback, useState } from 'react';
import { debounce } from 'lodash';
import XRegExp from 'xregexp';
import ReCAPTCHA from 'react-google-recaptcha';
import dotenv from 'dotenv';
import axios from 'axios';
import './index.sass';

dotenv.config();

const ContactForm = ({
  setRenderCursor,
  setCursorColor,
  setPreventNavigation,
  submitButtonRef,
}) => {
  // ----------STATE---------- //

  const captchaSiteKey = '6LerWc0aAAAAAHshuCVA20zxcp1UbBPCDFGXL1Dg';
  const namePattern = XRegExp('[\\p{L}]+');
  const emailPattern = XRegExp(
    '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$'
  );
  const feedbackPattern = XRegExp('[p{L}ds]+');
  const [formData, setFormData] = useState({});

  const [form, setForm] = useState(null);
  const [nameInput, setNameInput] = useState(null);
  const [emailInput, setEmailInput] = useState(null);
  const [feedbackInput, setFeedbackInput] = useState(null);

  // ----------REFERENCES---------- //

  const formRef = useCallback((node) => setForm(node), []);
  const nameRef = useCallback((node) => setNameInput(node), []);
  const emailRef = useCallback((node) => setEmailInput(node), []);
  const feedbackRef = useCallback((node) => setFeedbackInput(node), []);

  // ----------HELPERS---------- //

  const preventNavigation = (inputValue) => {
    // Prevent scroll navigation when the input contains a text
    if (inputValue) return setPreventNavigation(true);
    return setPreventNavigation(false);
  };

  const showValidationStatus = (element, status) => {
    if (status) return element.classList.remove('is-invalid');
    return element.classList.add('is-invalid');
  };

  const setData = (key, value) => setFormData((formData) => ({ ...formData, [key]: value }));

  // ----------HANDLERS---------- //

  const showCursor = () => setRenderCursor(true);
  const hideCursor = () => setRenderCursor(false);
  const setDarkCursor = () => setCursorColor('dark');
  const setLightCursor = () => setCursorColor('light');

  const captchaAuthorization = async (authCode) => {
    return axios
      .post('http://localhost:3001/contact/authorization', { authCode })
      .catch((err) => console.error(err));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    return axios
      .post('http://localhost:3001/contact/submit', formData)
      .catch((err) => console.error(err));
  };

  const handleInputChange = (event, element, pattern) => {
    event.preventDefault();

    const { target } = event;
    const name = target.name;
    const value = target.value;

    preventNavigation(value);
    setData(name, value);

    const isValid = pattern.test(value);
    showValidationStatus(element, isValid);

    return debounce(handleInputChange, 300);
  };

  // ----------EVENT LISTENERS---------- //

  useEffect(() => {
    const inputFields = [nameInput, emailInput, feedbackInput];

    if (form) {
      form.addEventListener('submit', handleFormSubmit);
      form.addEventListener('mouseenter', setDarkCursor);
      form.addEventListener('mouseleave', setLightCursor);
    }
    inputFields.forEach((input) => {
      if (input) {
        input.addEventListener('focusin', hideCursor);
        ['focusout', 'mouseleave'].forEach((evt) => input.addEventListener(evt, showCursor));
      }
    });

    return () => {
      if (form) {
        form.removeEventListener('submit', handleFormSubmit);
        form.removeEventListener('mouseenter', setDarkCursor);
        form.removeEventListener('mouseleave', setLightCursor);
      }
      inputFields.forEach((input) => {
        if (input) {
          input.removeEventListener('focusin', hideCursor);
          ['focusout', 'mouseleave'].forEach((evt) => input.removeEventListener(evt, showCursor));
        }
      });
    };
  });

  // ----------JSX---------- //

  return (
    <form className="contact__form" ref={formRef}>
      <div className="contact__form_group form-group">
        <label htmlFor="inputName">Name</label>
        <input
          type="text"
          name="name"
          className="form-control"
          placeholder="Your Name"
          ref={nameRef}
          onChange={(event) => handleInputChange(event, nameInput, namePattern)}
        />
        <div className="invalid-feedback">Input valid text.</div>
      </div>
      <div className="contact__form_group form-group">
        <label htmlFor="inputEmail">Email address</label>
        <input
          type="email"
          name="email"
          className="form-control"
          placeholder="your.email@sample.com"
          ref={emailRef}
          onChange={(event) => handleInputChange(event, emailInput, emailPattern)}
        />
      </div>
      <div className="contact__form_group form-group">
        <label htmlFor="inputMessage">Message</label>
        <textarea
          name="feedback"
          rows="4"
          className="form-control"
          placeholder="What would you like to chat about?"
          ref={feedbackRef}
          onChange={(event) => handleInputChange(event, feedbackInput, feedbackPattern)}
        />
      </div>
      <ReCAPTCHA sitekey={captchaSiteKey} onChange={captchaAuthorization} />
      <input
        className="contact__form_button contact__form_button--submit"
        type="submit"
        value="Submit"
        ref={submitButtonRef}
      />
    </form>
  );
};

export default ContactForm;
