/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { throttle } from '../../../assets/js/throttle';
import './index.sass';

type NavigationButtonElement = HTMLButtonElement | HTMLParagraphElement;

interface Props {
  urlEnd: string;
  urlEnds: Array<string>;
  setIsMountedTransition: React.Dispatch<React.SetStateAction<boolean>>;
  buttonNavigation?: React.MutableRefObject<NavigationButtonElement>[];
  navigationExceptions?: string[];
}

const Navigation = ({
  urlEnd,
  urlEnds,
  setIsMountedTransition,
  buttonNavigation,
  navigationExceptions,
}: Props) => {
  // ----------STATE---------- //
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const history = useHistory();
  const timeout = 600;
  let delayedUnmount: ReturnType<typeof setTimeout>;
  let delayedURLChange: ReturnType<typeof setTimeout>;

  // ----------GENERATE PATH NAME ON SCROLL---------- //

  const generatePathName = (isScrollingUp: boolean, isScrollingDown: boolean, index: number) => {
    if (isScrollingUp) return urlEnds[index - 1];
    if (isScrollingDown) return urlEnds[index + 1];
    return '';
  };

  // ----------SET THE PATH AFTER ANIMATIONS---------- //

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
      changeURLAfterAnimations(generatePathName(isScrollingUp, isScrollingDown, index));
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
      const isScrollingUp = event.deltaY < 0;
      const isScrollingDown = event.deltaY > 0;
      changeUrlWithTransitions(isScrollingUp, isScrollingDown);
    }
  };
  // Don't allow scrolling while animations are working
  const throttledWheelNavigation = throttle(handleWheelNavigation, timeout);

  // ----------HANDLE TOUCH NAVIGATION---------- //

  const setTouchStartCoords = ({ touches }: TouchEvent) => {
    setTouchStartX(touches[0].clientX);
    setTouchStartY(touches[0].clientY);
  };

  const handleTouchNavigation = ({ touches }: TouchEvent) => {
    if (touchStartX === 0 && touchStartY === 0) return;

    // Detect swipe direction

    const touchMoveX = touches[0].clientX;
    const touchMoveY = touches[0].clientY;

    const diffX = touchStartX - touchMoveX;
    const diffY = touchStartY - touchMoveY;

    // Vertical swipe
    if (Math.abs(diffX) < Math.abs(diffY)) {
      if (diffY > 0) {
        // Swipe up
        changeUrlWithTransitions(false, true);
      } else {
        // Swipe down
        changeUrlWithTransitions(true, false);
      }
    }

    setTouchStartX(0);
    setTouchStartY(0);
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

  // ----------HANDLE ARROWS NAVIGATION---------- //

  const handleArrowsNavigation = ({ key }: KeyboardEvent) => {
    const isScrollingUp = key === 'ArrowUp' || key === 'Down';
    const isScrollingDown = key === 'ArrowDown' || key === 'Up';
    changeUrlWithTransitions(isScrollingUp, isScrollingDown);
  };

  useEffect(() => {
    const passive: AddEventListenerOptions & EventListenerOptions = { passive: true };

    window.addEventListener('wheel', throttledWheelNavigation, passive);
    window.addEventListener('touchstart', setTouchStartCoords, passive);
    window.addEventListener('touchmove', handleTouchNavigation, passive);
    window.addEventListener('keyup', handleArrowsNavigation);

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
      window.removeEventListener('touchstart', setTouchStartCoords, passive);
      window.removeEventListener('touchmove', handleTouchNavigation, passive);
      window.removeEventListener('keyup', handleArrowsNavigation);

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

export default Navigation;
