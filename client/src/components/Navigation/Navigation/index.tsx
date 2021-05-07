import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { throttle } from '../../../assets/js/throttle';
import './index.sass';

type NavigationButtonElement = HTMLButtonElement | HTMLParagraphElement;

interface Navigation {
  urlEnd: string;
  urlEnds: Array<string>;
  setIsMountedTransition: React.Dispatch<React.SetStateAction<boolean>>;
  buttonNavigation?: React.MutableRefObject<NavigationButtonElement>[];
  navigationExceptions?: string[];
}

export const Navigation = (props: Navigation) => {
  const [touchStart, setTouchStart] = useState(0);
  const history = useHistory();
  const timeout = 600;
  let delayedUnmount: ReturnType<typeof setTimeout>;
  let delayedURLChange: ReturnType<typeof setTimeout>;

  const { urlEnd, urlEnds, setIsMountedTransition, buttonNavigation, navigationExceptions } = props;

  // ----------GENERATE PATCH NAME ON SCROLL---------- //

  const generatePatchName = (isScrollingUp: boolean, isScrollingDown: boolean, index: number) => {
    if (isScrollingDown) return urlEnds[index + 1];
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
    const isFirstPage = urlEnd === '';
    const isLastPage = index + 1 === urlEnds.length;
    const isArrayBoundary = (isScrollingDown && isLastPage) || (isScrollingUp && isFirstPage);

    if (!isArrayBoundary && (isScrollingUp || isScrollingDown)) {
      mountTransition();
      changeURLAfterAnimations(generatePatchName(isScrollingUp, isScrollingDown, index));
      unmountTransition();
    }
  };

  // ----------DETECT NAVIGATION EXCEPTION---------- //

  const isNavigationException = () => {
    if (navigationExceptions) {
      return navigationExceptions.some((value) => urlEnd === value);
    }
    return false;
  };

  // ----------HANDLE WHEEL NAVIGATION---------- //

  const handleWheelNavigation = (event: WheelEvent) => {
    if (!isNavigationException()) {
      const isScrollingDown = event.deltaY > 0;
      const isScrollingUp = event.deltaY < 0;
      changeUrlWithTransitions(isScrollingUp, isScrollingDown);
    }
  };
  // Don't allow scrolling while animations are working
  const throttledWheelNavigation = throttle(handleWheelNavigation, timeout);

  // ----------HANDLE TOUCH NAVIGATION---------- //

  const setTouchStartValue = (event: TouchEvent) => {
    setTouchStart(event.changedTouches[0].clientY);
  };

  const handleTouchNavigation = (event: TouchEvent) => {
    if (!isNavigationException()) {
      const touchEnd = event.changedTouches[0].clientY;
      const isScrollingDown = touchStart > touchEnd + 5;
      const isScrollingUp = touchStart < touchEnd - 5;
      changeUrlWithTransitions(isScrollingUp, isScrollingDown);
    }
  };

  // ----------HANDLE CLICK NAVIGATION---------- //

  const handleClickNavigation: EventListener = ({ currentTarget }) => {
    const button = currentTarget as NavigationButtonElement;
    const redirectTo = button.dataset.target;

    if (redirectTo) {
      mountTransition();
      changeURLAfterAnimations(redirectTo);
      unmountTransition();
    }
  };

  useEffect(() => {
    const passive: AddEventListenerOptions & EventListenerOptions = { passive: true };

    window.addEventListener('wheel', throttledWheelNavigation, passive);
    window.addEventListener('touchstart', setTouchStartValue, passive);
    window.addEventListener('touchend', handleTouchNavigation, passive);

    if (buttonNavigation) {
      buttonNavigation.map((button) => {
        const currentButton = button.current;
        return currentButton?.addEventListener('click', handleClickNavigation);
      });
    }

    return () => {
      clearTimeout(delayedUnmount);
      clearTimeout(delayedURLChange);
      window.removeEventListener('wheel', throttledWheelNavigation, passive);
      window.removeEventListener('touchstart', setTouchStartValue, passive);
      window.removeEventListener('touchend', handleTouchNavigation, passive);

      if (buttonNavigation) {
        buttonNavigation.map((button) => {
          const currentButton = button.current;
          return currentButton?.removeEventListener('click', handleClickNavigation);
        });
      }
    };
  });

  return <div className="navigation" />;
};
