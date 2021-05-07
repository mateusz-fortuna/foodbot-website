import React from 'react';
import './index.sass';

interface Props {
  target: string;
  reference: React.MutableRefObject<HTMLButtonElement>;
  text?: string;
  className?: string;
}

const NavigationButton: React.FC<Props> = ({ reference, target, text, className, children }) => {
  return (
    <button ref={reference} data-target={target} type="button" className={className}>
      {children}
      {text ? <p className="navigationButton__text">{text}</p> : null}
    </button>
  );
};

export default NavigationButton;
