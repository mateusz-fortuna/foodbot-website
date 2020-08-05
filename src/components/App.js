import React, { useState, useEffect, useRef } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.sass';

import {
  HashRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import { Container, Button } from 'react-bootstrap';
import Menu from './Menu';
import Intro from './Intro';
import Home from './Home';
import About from './About';
import Gallery from './Gallery';
import Contact from './Contact';
import Blog from './Blog';
import Logo from './Logo';


const App = () => {

  //----------REFERENCE FOR CURSOR AND LOGO----------//
  
  const menuButtonRef = useRef();
  const logoRef = useRef();

  //----------MENU BUTTON COLOR----------//

  const [ urlEnd, setUrlEnd ] = useState( '' );

  const menuButtonColorChange = () => { 
    const urlArray = document.location.href.split( '/' );
    const urlEnd = urlArray[ urlArray.length - 1 ];
    setUrlEnd( urlEnd );

    const menuLines = document.querySelectorAll( '.menuLine' );
    const menuLabel = document.querySelector( '.menuIcon__label' );

    switch ( urlEnd ) {
      case 'about':
        menuLines.forEach(
          item => item.style.backgroundColor = '#e0e0e0'
        );
        if ( menuLabel ) {
          menuLabel.style.color = '#e0e0e0';
        }
        break;
          
      default:
        if ( menuButtonIsClicked ) {
          menuLines.forEach(
            item => item.style.backgroundColor = '#e0e0e0'
          );
          if ( menuLabel ) {
            menuLabel.style.color = '#e0e0e0';
          }
        } else {
          if ( width < 992 ) {
            menuLines.forEach(
              item => item.style.backgroundColor = '#e0e0e0'
            );
          } else {
            menuLines.forEach(
              item => item.style.backgroundColor = '#0e0e0e'
            );
            if ( menuLabel ) {
              menuLabel.style.color = '#0e0e0e';
            }
          }
        }
    }
  }

  //----------MENU BUTTON HANDLER----------//

  const [ menuIsOpen, setMenuIsOpen ] = useState( false );
  const [ menuButtonIsClicked, setMenuButtonIsClicked ] = useState( false );
  const [ animationDone, setAnimationDone ] = useState( false );

  const menuLinesBackground = menuButtonIsClicked ? '#e0e0e0' : null;

  const handleMenuButtonClick = () => {
    setMenuButtonIsClicked( !menuButtonIsClicked );
    setMenuIsOpen( true );
  };

  //----------INTRO HANDLERS----------//

  const [ showIntro, setShowIntro ] = useState( true );
  const [ mountIntro, setMountIntro ] = useState( true );

  //----------HOME TITILE HANDLER----------//

  const [ width, setWidth ] = useState( window.innerWidth );
  const [ height, setHeight ] = useState( window.innerHeight );

  //----------UPDATE VIEWPORT FUNCTION----------//

  const updateWidth = () => {
    setWidth( window.innerWidth );
    setHeight( window.innerHeight );
  };

  //----------EXIT MENU USING ESC KEY----------//

  const exitMenuUsingEsc = event => {
    if ( menuButtonIsClicked && event.key === 'Escape' ) handleMenuButtonClick();
  };


  useEffect( () => {

    //----------PAGE TITLE----------//
    document.title = 'FoodBot | Innovative 3D printer for food.';

    //----------SET MENU COLOR ON PAGE LOAD----------//
    menuButtonColorChange();

    //----------LISTENERS----------//
    window.addEventListener( 'hashchange', menuButtonColorChange );
    window.addEventListener( 'resize', updateWidth );
    document.addEventListener( 'keyup', exitMenuUsingEsc );

    //----------MOUNT INTRO----------//
    setTimeout( () => setShowIntro( false ), 2500 );
    setTimeout( () => setMountIntro( false ), 4000 );

    return () => {
      window.removeEventListener( 'hashchange', menuButtonColorChange );
      clearTimeout( setTimeout( () => setShowIntro( false ), 2500 ) );
      clearTimeout( setTimeout( () => setMountIntro( false ), 4000 ) );
      window.removeEventListener( 'resize', updateWidth );
      document.removeEventListener( 'keyup', exitMenuUsingEsc );
    }
  } );


  //----------APP STATE----------//

  const state = {
    style: {
      homeTitle: {
        fontSize: Math.floor( 0.08 * width )
      },
      menuLines: {
        backgroundColor: menuLinesBackground
      },
      menuLink: {
        fontSize: ( width >= 1200 ) ? Math.floor( 0.06 * width ) : null
      },
      menuLabel: {
        color: menuLinesBackground
      }
    }
  }


  //----------JSX CODE----------//


  return (
    <Router basename='/'>
      <Container fluid={ true } className="app">

        <Logo ref={ logoRef } width={ width } urlEnd={ urlEnd }/>

        {/* ----------MENU BUTTON---------- */}

        <Button
          className="menuIcon"
          variant="outline-dark"
          onClick={ handleMenuButtonClick }
          ref={ menuButtonRef }
        >

          {
            ( width >= 992 )
              ? <p className="menuIcon__label" style={ state.style.menuLabel }>Menu</p>
              : null
          }

          <span className="menuLine topLine" style={ state.style.menuLines } />
          <span className="menuLine middleLine" style={ state.style.menuLines } />
          <span className="menuLine bottomLine" style={ state.style.menuLines } />
        </Button>

        { menuIsOpen && 
          <Menu
            menuButtonIsClicked={ menuButtonIsClicked }
            animationDone={ animationDone }
            setAnimationDone={ setAnimationDone }
            handleMenuButtonClick={ handleMenuButtonClick }
            menuLink={ state.style.menuLink }
          />
        }

        {/*----------ROUTING----------*/}

        <Switch>
          <Route exact path="/">
            {
              mountIntro && ( <Intro showIntro={ showIntro } clientWidth={ width } /> )
            }
            <Home
              clientWidth={ width }
              reference={ [ menuButtonRef ] }
              isAnimationDone={ animationDone }
              menuTest={ menuButtonIsClicked }
            />
          </Route>
          <Route path="/about">
            <About
              clientWidth={ width }
              clientHeight={ height }
              reference={ [ menuButtonRef, logoRef ] }
              isAnimationDone={ animationDone }
            />
          </Route>
          <Route path="/gallery">
            <Gallery reference={ [ menuButtonRef ] } />
          </Route>
          <Route path="/contact">
            <Contact reference={ [ menuButtonRef ] } />
          </Route>
          <Route path="/blog">
            <Blog reference={ [ menuButtonRef ] } />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
