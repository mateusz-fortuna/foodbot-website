import React, { useState, useEffect, useRef } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.sass';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Container, Button } from 'react-bootstrap';
import { LanguageProvider } from '../assets/js/context/languageContext';

import Menu from './Menu';
import Intro from './Intro';
import Home from './Home';
import Features from './Features';
import Gallery from './Gallery';
import Contact from './Contact';
import Blog from './Blog';
import Logo from './Logo';
import Navigation from './Navigation/Navigation/index.tsx';
import Transition from './Transitions/TransitionIn/index.tsx';

import { capitalize } from '../assets/js/capitalize.ts';

const App = () => {
  const [urlEnd, setUrlEnd] = useState('');
  const [isMountedTransition, setIsMountedTransition] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [menuButtonIsClicked, setMenuButtonIsClicked] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [mountIntro, setMountIntro] = useState(true);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [startTouches, setStartTouches] = useState(0);
  const [isCursorVisible, setIsCursorVisible] = useState(false);

  const menuButtonRef = useRef();
  const discoverFeaturesButtonRef = useRef();
  const featuresNavButton = useRef();
  const contactNavButton = useRef();
  const logoRef = useRef();

  const urlEnds = ['', 'features', 'gallery', 'contact', 'blog'];

  // ----------MENU BUTTON COLOR----------//

  const menuButtonColorChange = () => {
    const urlArray = document.location.href.split('/');
    const path = urlArray[urlArray.length - 1];
    setUrlEnd(path);

    const menuLines = document.querySelectorAll('.menuLine');
    const menuLabel = document.querySelector('.menuIcon__label');

    const setColor = (menuLines, menuLabel, color) => {
      if (menuLines && menuLabel) {
        menuLines.forEach((item) => {
          const menuLine = item;
          menuLine.style.backgroundColor = color;
        });
        menuLabel.style.color = color;
      }
    };
    const lightColor = '#e0e0e0';
    const darkColor = '#0e0e0e';

    switch (urlEnd) {
      case 'features':
        setColor(menuLines, menuLabel, lightColor);
        break;
      case 'contact':
        setColor(menuLines, menuLabel, lightColor);
        break;
      case 'gallery':
        setColor(menuLines, menuLabel, darkColor);
        break;
      case 'blog':
        setColor(menuLines, menuLabel, darkColor);
        break;

      default:
        if (menuButtonIsClicked) {
          setColor(menuLines, menuLabel, lightColor);
        } else if (width < 992) {
          setColor(menuLines, menuLabel, lightColor);
        } else {
          setColor(menuLines, menuLabel, darkColor);
        }
    }
  };

  // ----------MENU BUTTON HANDLER----------//

  const menuLinesBackground = menuButtonIsClicked ? '#e0e0e0' : null;

  const handleMenuButtonClick = () => {
    setMenuButtonIsClicked(!menuButtonIsClicked);
    setMenuIsOpen(true);
  };

  // ----------UPDATE VIEWPORT FUNCTION----------//

  const updateWidth = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  // ----------HOME TITLE HANDLER----------//

  const setDocumentTitle = () => {
    if (urlEnd === 'home' || urlEnd === '') {
      document.title = 'FoodBot | Innovative 3D printer for food.';
    } else {
      document.title = `${capitalize(urlEnd)} | FoodBot`;
    }
  };

  // ----------EXIT MENU USING ESC KEY----------//

  const handleKeyUpForMenu = ({ code }) => {
    // Open menu
    if (!menuButtonIsClicked && code === 'KeyM' && urlEnd !== 'contact') handleMenuButtonClick();
    // Close menu
    if (menuButtonIsClicked && (code === 'Escape' || code === 'KeyM')) handleMenuButtonClick();
  };

  // ----------DON'T MOUNT LOGO ON THOSE PAGES---------- //

  const includeUrlExceptions = () => urlEnd !== '';

  // ----------DON'T EXECUTE SCROLL NAVIGATION WHEN INPUTS ARE FOCUSED---------- //

  const [preventNavigation, setPreventNavigation] = useState(false);

  // ----------HIDE CURSOR ON TOUCH SCREENS---------- //

  const handleStartTouches = ({ touches }) => {
    setStartTouches(touches[0].clientY);
    if (isCursorVisible) setIsCursorVisible(false);
  };

  const hideCursor = ({ changedTouches }) => {
    const isScreenTap = startTouches === changedTouches[0].clientY;
    if (isCursorVisible || isScreenTap) setIsCursorVisible(false);
  };

  const showCursor = () => {
    if (!isCursorVisible) setIsCursorVisible(true);
  };

  useEffect(() => {
    // ----------SET MENU COLOR ON PAGE LOAD----------//

    menuButtonColorChange();
    setDocumentTitle();
    includeUrlExceptions();

    // ----------LISTENERS----------//

    window.addEventListener('hashchange', menuButtonColorChange);
    window.addEventListener('resize', updateWidth);
    window.addEventListener('mousemove', showCursor);
    window.addEventListener('touchstart', handleStartTouches, { passive: true });
    window.addEventListener('touchend', hideCursor, { passive: true });
    document.addEventListener('keyup', handleKeyUpForMenu);

    // ----------MOUNT INTRO----------//

    const showIntroTimeout = setTimeout(() => setShowIntro(false), 2500);
    const mountIntroTimeout = setTimeout(() => setMountIntro(false), 4000);

    return () => {
      clearTimeout(showIntroTimeout);
      clearTimeout(mountIntroTimeout);
      window.removeEventListener('hashchange', menuButtonColorChange);
      window.removeEventListener('resize', updateWidth);
      window.removeEventListener('mousemove', showCursor);
      window.removeEventListener('touchstart', handleStartTouches, { passive: true });
      window.removeEventListener('touchend', hideCursor, { passive: true });
      document.removeEventListener('keyup', handleKeyUpForMenu);
    };
  });

  // ----------APP STATE----------//

  const state = {
    style: {
      homeTitle: {
        fontSize: Math.floor(0.08 * width),
      },
      menuLines: {
        backgroundColor: menuLinesBackground,
      },
      menuLink: {
        fontSize: width >= 1200 ? Math.floor(0.06 * width) : null,
      },
      menuLabel: {
        color: menuLinesBackground,
      },
    },
  };

  // ----------JSX CODE----------//

  return (
    <Router basename="/">
      <LanguageProvider>
        <Container fluid className="app">
          {/* ----------NAVIGATION----------*/}

          {isMountedTransition && <Transition mountTransition={isMountedTransition} />}
          {!preventNavigation && (
            <Navigation
              urlEnds={urlEnds}
              urlEnd={urlEnd}
              setIsMountedTransition={setIsMountedTransition}
              buttonNavigation={[discoverFeaturesButtonRef, featuresNavButton, contactNavButton]}
              navigationExceptions={['gallery']}
            />
          )}

          {/* ----------LOGO----------*/}

          {includeUrlExceptions() && (
            <Logo width={width} mount={!isMountedTransition} ref={logoRef} urlEnd={urlEnd} />
          )}

          {/* ----------MENU BUTTON---------- */}

          <Button
            className="menuIcon"
            variant="outline-dark"
            onClick={handleMenuButtonClick}
            ref={menuButtonRef}
          >
            {width >= 992 ? (
              <p className="menuIcon__label" style={state.style.menuLabel}>
                Menu
              </p>
            ) : null}

            <span className="menuLine topLine" style={state.style.menuLines} />
            <span className="menuLine middleLine" style={state.style.menuLines} />
            <span className="menuLine bottomLine" style={state.style.menuLines} />
          </Button>

          {menuIsOpen && (
            <Menu
              menuButtonIsClicked={menuButtonIsClicked}
              animationDone={animationDone}
              setAnimationDone={setAnimationDone}
              handleMenuButtonClick={handleMenuButtonClick}
              menuLink={state.style.menuLink}
            />
          )}

          {/* ----------ROUTING----------*/}

          <Switch>
            <Route exact path="/">
              {mountIntro && <Intro showIntro={showIntro} clientWidth={width} />}
              <Home
                isCursorVisible={isCursorVisible}
                clientWidth={width}
                reference={[menuButtonRef]}
                isAnimationDone={animationDone}
                menuTest={menuButtonIsClicked}
                discoverFeaturesButtonRef={discoverFeaturesButtonRef}
              />
            </Route>
            <Route path="/features">
              <Features
                isCursorVisible={isCursorVisible}
                clientWidth={width}
                clientHeight={height}
                reference={[menuButtonRef, logoRef]}
                isAnimationDone={animationDone}
                urlEnd={urlEnd}
              />
            </Route>
            <Route path="/gallery">
              <Gallery
                isCursorVisible={isCursorVisible}
                reference={[menuButtonRef, logoRef, featuresNavButton, contactNavButton]}
                navigationButtons={{ featuresNavButton, contactNavButton }}
              />
            </Route>
            <Route path="/contact">
              <Contact
                isCursorVisible={isCursorVisible}
                reference={[menuButtonRef, logoRef]}
                setPreventNavigation={setPreventNavigation}
              />
            </Route>
            <Route path="/blog">
              <Blog isCursorVisible={isCursorVisible} reference={[menuButtonRef, logoRef]} />
            </Route>
          </Switch>
        </Container>
      </LanguageProvider>
    </Router>
  );
};

export default App;
