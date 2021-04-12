import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Transition from '../Transition';

interface Props {
  targetPath: string;
  children: JSX.Element;
}
export const NavigationButton: React.FC<Props> = (props) => {
  const [isMountedTransition, setIsMountedTransition] = useState(false);
  const { targetPath, children } = props;
  const history = useHistory();
  const timeout = 600;

  let delayedUrlChange: ReturnType<typeof setTimeout>;
  let delayedUnmountTransition: ReturnType<typeof setTimeout>;

  const mountTransition = () => setIsMountedTransition(true);
  const unmountTransition = () => {
    delayedUnmountTransition = setTimeout(() => setIsMountedTransition(false), timeout);
  };

  const changeUrlWithTimeout = (targetPath: string) => {
    delayedUrlChange = setTimeout(() => {
      history.push(targetPath);
    }, timeout);
  };

  const handleClick = () => {
    changeUrlWithTimeout(targetPath);
    mountTransition();
    unmountTransition();
  };

  useEffect(() => {
    // get references array from the button component and then map it to give each element click listener
    return () => {
      clearTimeout(delayedUrlChange);
      clearTimeout(delayedUnmountTransition);
    };
  });

  return (
    <div className="buttonNavigation">
      {isMountedTransition && <Transition mountTransition={isMountedTransition} />}
      {React.cloneElement(children, { handleClick: handleClick })}
    </div>
  );
};
