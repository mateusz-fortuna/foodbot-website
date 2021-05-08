import React from 'react';
import './index.sass';

const ContactForm = ({ formRef, inputRef, submitButtonRef, inputChangeHandler }) => (
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
        onChange={inputChangeHandler}
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
        onChange={inputChangeHandler}
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
        onChange={inputChangeHandler}
      />
    </div>
    <input type="submit" value="Submit" ref={submitButtonRef} />
  </form>
);

export default ContactForm;
