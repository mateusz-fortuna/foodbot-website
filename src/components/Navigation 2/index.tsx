import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../Navigation/index.sass';

interface Navigation {
  urlEnd: string;
  urlEnds: Array<string>;
}

const NavigationTwo = (props: Navigation) => {
  const { urlEnd, urlEnds } = props;
  const history = useHistory();

  const handleWheel = (event: WheelEvent) => {
    const scrollDown = event.deltaY > 0;
    const scrollUp = event.deltaY < 0;
    const index = urlEnds.indexOf(urlEnd);
    const isFirstPage = urlEnd === '' || urlEnd === '/';
    const isLastPage = urlEnds[index] === urlEnds[urlEnds.length];
    const isArrayBoundary = (scrollDown && isLastPage) || (scrollUp && isFirstPage);

    const changeURLOnScroll = () => {
      if (scrollDown) {
        if (isFirstPage) return urlEnds[1];
        return urlEnds[index + 1];
      }
      if (scrollUp) return urlEnds[index - 1];
      return '';
    };

    const pushOnlyDifferentURLs = () => {
      if (!isArrayBoundary) return history.push(changeURLOnScroll());
    };

    const changePage = () => {
      //mount trasition
      pushOnlyDifferentURLs();
      //unmount transition
    };

    return setTimeout(changePage, 1300);
  };

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, false);

    return () => {
      window.removeEventListener('wheel', handleWheel, false);
    };
  });

  return <div className="navigation" />;
};

export default NavigationTwo;
