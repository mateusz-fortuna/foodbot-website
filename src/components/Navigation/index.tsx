import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Transition from '../Transition';
import { throttle } from '../../assets/js/throttle';
import './index.sass';

interface Navigation {
  urlEnd: string;
  urlEnds: Array<string>;
}

const NavigationTwo = (props: Navigation) => {
  const [isMountedTransition, setIsMountedTransition] = useState(false);
  const history = useHistory();

  const { urlEnd, urlEnds } = props;

  const timeout = 600;
  let delayedUnmount: ReturnType<typeof setTimeout>;
  let delayedURLChange: ReturnType<typeof setTimeout>;

  // ----------CHANGE URL ON SCROLL---------- //

  const changeURLonScroll = (
    isScrollingDown: boolean,
    isScrollingUp: boolean,
    isFirstPage: boolean,
    index: number,
    isArrayBoundary: boolean
  ) => {
    const patchName = () => {
      if (isScrollingDown) {
        if (isFirstPage) return urlEnds[1];
        return urlEnds[index + 1];
      }
      if (isScrollingUp) return urlEnds[index - 1];
      return '';
    };

    const pushOnlyDifferentURLs = () => {
      if (!isArrayBoundary) return history.push(patchName());
    };

    const executeAfterAnimation = () => {
      delayedURLChange = setTimeout(() => {
        pushOnlyDifferentURLs();
      }, timeout);
    };

    return executeAfterAnimation();
  };

  // ----------HANDLE TRANSITIONS---------- //

  const mountTransition = () => {
    setIsMountedTransition(true);
  };
  const unmountTransition = () => {
    delayedUnmount = setTimeout(() => setIsMountedTransition(false), timeout);
  };

  // ----------HANDLE NAVIGATION---------- //

  const handleNavigation = (event: WheelEvent) => {
    const isScrollingDown = event.deltaY > 0;
    const isScrollingUp = event.deltaY < 0;
    const index = urlEnds.indexOf(urlEnd);
    const isFirstPage = urlEnd === '' || urlEnd === '/';
    const isLastPage = index + 1 === urlEnds.length;
    const isArrayBoundary = (isScrollingDown && isLastPage) || (isScrollingUp && isFirstPage);

    if (!isArrayBoundary) {
      mountTransition();
      changeURLonScroll(isScrollingDown, isScrollingUp, isFirstPage, index, isArrayBoundary);
      unmountTransition();
    }
  };

  const throttled = throttle(handleNavigation, timeout);

  useEffect(() => {
    window.addEventListener('wheel', throttled, false);
    return () => {
      clearTimeout(delayedUnmount);
      clearTimeout();
      window.removeEventListener('wheel', throttled, false);
    };
  });

  return (
    <div className="navigation">
      {isMountedTransition && <Transition mountTransition={isMountedTransition} />}
    </div>
  );
};

export default NavigationTwo;
