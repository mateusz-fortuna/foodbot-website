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
  const [isMountedTransition, setIsMountedTransition] = useState<boolean>();
  const [touchStart, setTouchStart] = useState(0);

  const history = useHistory();

  const { urlEnd, urlEnds } = props;

  const timeout = 600;
  let delayedUnmount: ReturnType<typeof setTimeout>;
  let delayedURLChange: ReturnType<typeof setTimeout>;

  // ----------CHANGE URL ON SCROLL---------- //

  const changeURLonScroll = (isScrollingUp: boolean, isScrollingDown: boolean) => {
    const index = urlEnds.indexOf(urlEnd);
    const isFirstPage = urlEnd === '' || urlEnd === '/';
    const isLastPage = index + 1 === urlEnds.length;
    const isArrayBoundary = (isScrollingDown && isLastPage) || (isScrollingUp && isFirstPage);

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

  // ----------CHANGE URL WITH TRANSITIONS---------- //

  const changeUrlWithTransitions = (isScrollingUp: boolean, isScrollingDown: boolean) => {
    mountTransition();
    changeURLonScroll(isScrollingUp, isScrollingDown);
    unmountTransition();
  };

  // ----------HANDLE WHEEL NAVIGATION---------- //

  const handleWheelNavigation = (event: WheelEvent) => {
    const isScrollingDown = event.deltaY > 0;
    const isScrollingUp = event.deltaY < 0;
    changeUrlWithTransitions(isScrollingUp, isScrollingDown);
  };
  const throttledWheelNavigation = throttle(handleWheelNavigation, timeout);

  // ----------HANDLE TOUCH NAVIGATION---------- //

  const setTouchStartValue = (event: TouchEvent) => {
    setTouchStart(event.changedTouches[0].clientY);
  };

  const handleTouchNavigation = (event: TouchEvent) => {
    const touchEnd = event.changedTouches[0].clientY;
    const isScrollingDown = touchStart > touchEnd + 5;
    const isScrollingUp = touchStart < touchEnd - 5;
    changeUrlWithTransitions(isScrollingUp, isScrollingDown);
  };
  const throttledTouchNavigation = throttle(handleTouchNavigation, timeout);

  useEffect(() => {
    window.addEventListener('wheel', throttledWheelNavigation, false);
    window.addEventListener('touchstart', setTouchStartValue);
    window.addEventListener('touchend', throttledTouchNavigation);

    return () => {
      clearTimeout(delayedUnmount);
      clearTimeout(delayedURLChange);
      window.removeEventListener('wheel', throttledWheelNavigation, false);
    };
  });

  return (
    <div className="navigation">
      {isMountedTransition && <Transition mountTransition={isMountedTransition} />}
    </div>
  );
};

export default NavigationTwo;
