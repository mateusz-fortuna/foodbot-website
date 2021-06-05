import React, { useEffect, useCallback, useState } from 'react';
import XRegExp from 'xregexp';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import { debounce } from 'lodash';
import './index.sass';

const ContactForm = ({
  setRenderCursor,
  setCursorColor,
  setPreventNavigation,
  submitButtonRef,
  submitButton,
}) => {
  // ----------STATE---------- //

  const captchaSiteKey = '6LerWc0aAAAAAHshuCVA20zxcp1UbBPCDFGXL1Dg';

  const namePattern = XRegExp('[\\p{L}]+');
  const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const feedbackPattern = XRegExp('[p{L}ds]+');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');

  const [sentStatus, setSentStatus] = useState(null);
  const [isCaptchaVisible, setIsCapthaVisible] = useState(true);
  const [submitButtonMessage, setSubmitButtonMessage] = useState('Submit');

  // ----------REFERENCES---------- //

  const [form, setForm] = useState(null);
  const [nameInput, setNameInput] = useState(null);
  const [emailInput, setEmailInput] = useState(null);
  const [feedbackInput, setFeedbackInput] = useState(null);

  const inputFields = [nameInput, emailInput, feedbackInput];

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

  // Validation

  const setValidationStatus = (element, status) => {
    if (status) {
      element.classList.remove('is-invalid');
      element.classList.add('is-valid');
    } else {
      element.classList.add('is-invalid');
      element.classList.remove('is-valid');
    }
  };

  const isFormValid = useCallback(
    (inputs) => inputs.every((el) => [...el.classList].indexOf('is-valid') !== -1),
    []
  );

  const getHTMLValidationMessage = (el) => {
    if (el) return el.validationMessage;
    return 'Please input a valid text.';
  };

  // Form submitting

  const disableElement = (el) => {
    const element = el;
    element.disabled = true;
  };

  const disableInputs = useCallback(() => {
    const formInputs = [nameInput, emailInput, feedbackInput, submitButton];
    formInputs.forEach((el) => disableElement(el));
  }, [nameInput, emailInput, feedbackInput, submitButton]);

  const areAllFieldsFilled = useCallback(() => [name, email, feedback].every((str) => str !== ''), [
    name,
    email,
    feedback,
  ]);

  const setSubmitButtonWidth = () => {
    if (submitButtonMessage === 'Submit') return undefined;
    return '100%';
  };

  const handleSubmitButtonMessage = useCallback(() => {
    if (sentStatus && sentStatus.status === 200)
      setSubmitButtonMessage('Message sent successfully!');
  }, [sentStatus]);

  // ----------HANDLERS---------- //

  const showCursor = useCallback(() => setRenderCursor(true), [setRenderCursor]);
  const hideCursor = useCallback(() => setRenderCursor(false), [setRenderCursor]);
  const setDarkCursor = useCallback(() => setCursorColor('dark'), [setCursorColor]);
  const setLightCursor = useCallback(() => setCursorColor('light'), [setCursorColor]);

  const captchaAuthorization = async (authCode) =>
    axios
      .post('http://localhost:3001/contact/authorization', { authCode })
      .catch(() => setSubmitButtonMessage('Authorization failed. Please try again.'));

  const handleFormSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const formData = { name, email, feedback };

      if (areAllFieldsFilled() && isFormValid(inputFields))
        return axios
          .post('http://localhost:3001/contact/submit', formData)
          .then((res) => setSentStatus(res))
          .catch(setSubmitButtonMessage('A submitting error occurred. Please try again.'));

      return setSubmitButtonMessage('Please fill all the fields properly.');
    },
    [email, feedback, name, areAllFieldsFilled, isFormValid, inputFields, setSubmitButtonMessage]
  );

  const handleInputChange = debounce((event, setter, el, pattern) => {
    const { value } = event.target;

    event.preventDefault();
    preventNavigation(value);

    setter(value);
    setValidationStatus(el, value.match(pattern));
  }, 700);

  // ----------COMPONENT LIFE CYCLE---------- //

  useEffect(() => {
    if (sentStatus && sentStatus.config.data !== '{}') {
      disableInputs();
      setIsCapthaVisible(false);
    }

    handleSubmitButtonMessage();

    // ----------EVENT LISTENERS---------- //

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
  }, [
    nameInput,
    emailInput,
    feedbackInput,
    sentStatus,
    form,
    handleSubmitButtonMessage,
    disableInputs,
    handleFormSubmit,
    setDarkCursor,
    setLightCursor,
    hideCursor,
    showCursor,
    inputFields,
  ]);

  // ----------JSX---------- //

  return (
    <form className="contact__form" ref={formRef}>
      <div className="contact__form_group form-group">
        <label htmlFor="nameInput" className="w-100">
          Name
        </label>
        <input
          id="nameInput"
          type="text"
          name="name"
          className="form-control"
          placeholder="Your Name"
          ref={nameRef}
          onChange={(event) => handleInputChange(event, setName, nameInput, namePattern)}
        />
        <div className="invalid-feedback">
          {name === '' ? 'Input your name.' : 'Numbers are not allowed.'}
        </div>
      </div>

      <div className="contact__form_group form-group">
        <label htmlFor="emailInput" className="w-100">
          Email address
        </label>
        <input
          id="emailInput"
          type="email"
          name="email"
          className="form-control"
          placeholder="your.email@sample.com"
          ref={emailRef}
          onChange={(event) => handleInputChange(event, setEmail, emailInput, emailPattern)}
        />
        <div className="invalid-feedback">
          {email === '' ? 'Input your email address.' : getHTMLValidationMessage(emailInput)}
        </div>
      </div>

      <div className="contact__form_group form-group">
        <label htmlFor="messageInput" className="w-100">
          Message
        </label>
        <textarea
          id="messageInput"
          name="feedback"
          rows="4"
          className="form-control"
          placeholder="What would you like to chat about?"
          ref={feedbackRef}
          onChange={(event) =>
            handleInputChange(event, setFeedback, feedbackInput, feedbackPattern)
          }
        />
        {feedback === '' ? (
          <div className="invalid-feedback">The message field cannot be empty.</div>
        ) : null}
      </div>

      {isCaptchaVisible && <ReCAPTCHA sitekey={captchaSiteKey} onChange={captchaAuthorization} />}

      <input
        className="contact__form_button contact__form_button--submit"
        style={{ width: setSubmitButtonWidth() }}
        type="submit"
        value={submitButtonMessage}
        ref={submitButtonRef}
      />
    </form>
  );
};

export default ContactForm;
