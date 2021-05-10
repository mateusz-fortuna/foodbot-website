import React, { useEffect, useCallback, useState } from 'react';
import { debounce } from 'lodash';
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
  const [formData, setFormData] = useState({});
  const [inputs, setInputs] = useState([]);
  const [form, setForm] = useState(null);

  // ----------REFERENCES---------- //

  const inputRef = useCallback((node) => setInputs((inputs) => [...inputs, node]), []);
  const formRef = useCallback((node) => setForm(node), []);

  // ----------HELPERS---------- //

  const preventNavigation = (inputValue) => {
    // Prevent scroll navigation when the input contains a text
    if (inputValue) return setPreventNavigation(true);
    return setPreventNavigation(false);
  };

  // ----------HANDLERS---------- //

  const showCursor = () => setRenderCursor(true);
  const hideCursor = () => setRenderCursor(false);
  const setDarkCursor = () => setCursorColor('dark');
  const setLightCursor = () => setCursorColor('light');

  const handleInputChange = (event) => {
    const { target } = event;

    event.preventDefault();
    preventNavigation(target.value);

    const name = target.name;
    const value = target.value;
    setFormData((formData) => ({ ...formData, [name]: value }));

    return debounce(handleInputChange, 300);
  };

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

  // ----------EVENT LISTENERS---------- //

  useEffect(() => {
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
      form.addEventListener('mouseenter', setDarkCursor);
      form.addEventListener('mouseleave', setLightCursor);
    }
    if (inputs.length) {
      inputs.forEach((input) => {
        input.addEventListener('focusin', hideCursor);
        ['focusout', 'mouseleave'].forEach((evt) => input.addEventListener(evt, showCursor));
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
          input.removeEventListener('focusin', hideCursor);
          ['focusout', 'mouseleave'].forEach((evt) => input.removeEventListener(evt, showCursor));
        });
      }
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
          required
          className="form-control"
          placeholder="Enter your name"
          ref={inputRef}
          onChange={handleInputChange}
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
          onChange={handleInputChange}
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
          onChange={handleInputChange}
        />
      </div>
      <ReCAPTCHA sitekey={captchaSiteKey} onChange={captchaAuthorization} />
      <input type="submit" value="Submit" ref={submitButtonRef} />
    </form>
  );
};

export default ContactForm;
