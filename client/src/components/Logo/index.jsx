import React, { useEffect } from 'react';
import './index.sass';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { capitalize } from '../../assets/js/capitalize.ts';

const Logo = ({ mount, urlEnd, width, innerRef }) => {
  const timeout = {
    appear: 2000,
    enter: 2000,
    exit: 0,
  };

  const insertText = () => {
    if (urlEnd) return capitalize(urlEnd);
    return '';
  };

  const setColorDependingOnURL = () => {
    if (urlEnd === 'features' || urlEnd === 'contact') return '#e0e0e0';
    return '#0e0e0e';
  };

  useEffect(() => {
    insertText();
    setColorDependingOnURL();
  });

  return (
    <CSSTransition unmountOnExit timeout={timeout} appear in={mount}>
      <div className="logo__wrapper">
        <Link to="/" className="d-block logoLink" style={{ height: 0.025 * width }}>
          <CSSTransition classNames="logo" unmountOnExit timeout={timeout} appear in={mount}>
            <h1
              className="logo"
              style={{
                fontSize: 0.02 * width,
                color: setColorDependingOnURL(),
              }}
              ref={innerRef}
            >
              {insertText()}
            </h1>
          </CSSTransition>
        </Link>
      </div>
    </CSSTransition>
  );
};

export default React.forwardRef((props, ref) => <Logo innerRef={ref} {...props} />);
