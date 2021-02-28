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

  const timeout = 600;
  let delayedUnmount: ReturnType<typeof setTimeout>;
  let delayedURLChange: ReturnType<typeof setTimeout>;

  const { urlEnd, urlEnds } = props;

  // ----------GENERATE PATCH NAME ON SCROLL---------- //

  const generatePatchName = (
    isScrollingUp: boolean,
    isScrollingDown: boolean,
    isFirstPage: boolean,
    index: number
  ) => {
    if (isScrollingDown) {
      if (isFirstPage) return urlEnds[1];
      return urlEnds[index + 1];
    }
    if (isScrollingUp) return urlEnds[index - 1];
    return '';
  };

  // ----------SET THE PATCH AFTER ANIMATIONS---------- //

  const changeURLAfterAnimations = (newURL: string) => {
    delayedURLChange = setTimeout(() => {
      history.push(newURL);
    }, timeout);
  };

  // ----------TRANSITION STATE HANDLERS---------- //

  const mountTransition = () => {
    setIsMountedTransition(true);
  };
  const unmountTransition = () => {
    delayedUnmount = setTimeout(() => setIsMountedTransition(false), timeout);
  };

  // ----------CHANGE URL WITH TRANSITIONS---------- //

  const changeUrlWithTransitions = (isScrollingUp: boolean, isScrollingDown: boolean) => {
    const index = urlEnds.indexOf(urlEnd);
    const isFirstPage = urlEnd === '' || urlEnd === '/';
    const isLastPage = index + 1 === urlEnds.length;
    const isArrayBoundary = (isScrollingDown && isLastPage) || (isScrollingUp && isFirstPage);

    if ((!isArrayBoundary && isScrollingUp) || isScrollingDown) {
      mountTransition();
      changeURLAfterAnimations(
        generatePatchName(isScrollingUp, isScrollingDown, isFirstPage, index)
      );
      unmountTransition();
    }
  };

  // ----------HANDLE WHEEL NAVIGATION---------- //

  const handleWheelNavigation = (event: WheelEvent) => {
    const isScrollingDown = event.deltaY > 0;
    const isScrollingUp = event.deltaY < 0;
    changeUrlWithTransitions(isScrollingUp, isScrollingDown);
  };
  // Don't allow scrolling while animations are working
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

  useEffect(() => {
    window.addEventListener('wheel', throttledWheelNavigation, false);
    window.addEventListener('touchstart', setTouchStartValue);
    window.addEventListener('touchend', handleTouchNavigation);

    return () => {
      clearTimeout(delayedUnmount);
      clearTimeout(delayedURLChange);
      window.removeEventListener('wheel', throttledWheelNavigation, false);
      window.removeEventListener('touchstart', setTouchStartValue);
      window.removeEventListener('touchend', handleTouchNavigation);
    };
  });

  return (
    <div className="navigation">
      {isMountedTransition && <Transition mountTransition={isMountedTransition} />}
    </div>
  );
};

export default NavigationTwo;
