import React from 'react';

interface Props {
  target: string;
  reference: React.MutableRefObject<HTMLButtonElement>;
}

export const NavigationButton: React.FC<Props> = ({ children, reference, target }) => {
  return (
    <button ref={reference} data-target={target} type="button">
      {children}
    </button>
  );
};
