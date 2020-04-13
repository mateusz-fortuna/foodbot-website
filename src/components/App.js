import React, { useState, useEffect, useRef } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.sass';

import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import { Container, Button } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import Cursor from'./Cursor';
import Intro from './Intro';
import Home from './Home';
import About from './About';
import Gallery from './Gallery';
import Contact from './Contact';
import Blog from './Blog';


const App = () => {

  //----------MENU BUTTON COLOR----------//
  useEffect( () => {

    const urlArray = document.location.href.split( '/' );
    const urlEnd = urlArray[ urlArray.length - 1 ];

    const menuLines = document.querySelectorAll( '.menuLine' );
    const menuLabel = document.querySelector( '.menuIcon__label' );

    //----------MENU BUTTON COLOR FUNCTION----------//

    const menuButtonColorChange = () => {      
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
          menuLines.forEach(
            item => item.style.backgroundColor = '#0e0e0e'
          );
          if ( menuLabel ) {
            menuLabel.style.color = '#0e0e0e';
          }
      }
    }

    //----------SET MENU COLOR ON PAGE LOAD----------//

    menuButtonColorChange();

    //----------SET MENU COLOR ON HASH CHANGE----------//

    window.addEventListener( 'hashchange', menuButtonColorChange );

    return () => {
      window.removeEventListener( 'hashchange', menuButtonColorChange );
    }
  } );

  //----------MENU BUTTON HANDLER----------//
  const [ menuIsOpen, setMenuIsOpen ] = useState( false );
  const [ menuButtonIsClicked, setMenuButtonIsClicked ] = useState( false );
    
  const menuLinesBackground = menuButtonIsClicked ? '#e0e0e0' : null;
  
  const handleMenuButtonClick = event => {
    event.stopPropagation();
    setMenuButtonIsClicked( !menuButtonIsClicked );
    setMenuIsOpen( true );
  };

  //----------INTRO HANDLERS----------//

  const [ showIntro, setShowIntro ] = useState( true );
  const [ mountIntro, setMountIntro ] = useState( true )
  
  useEffect( () => {
    setTimeout( () => setShowIntro( false ), 2500 );
    setTimeout( () => setMountIntro( false ), 4000 );

    return () => {
      clearTimeout( setTimeout( () => setShowIntro( false ), 2500 ) );
      clearTimeout( setTimeout( () => setMountIntro( false ), 4000 ) );
    };
  } );

  //----------HOME TITILE HANDLER----------//

  const [ width, setWidth ] = useState( window.innerWidth );
  
  useEffect( () => {
    const updateWidth = () => {
      setWidth( window.innerWidth );
    };
    window.addEventListener( 'resize', updateWidth );
    return () => { window.removeEventListener( 'resize', updateWidth ) };
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

  const buttonRef = useRef();

  //----------JSX CODE----------//


  return (
    <Router basename='/'>
      <Container fluid={ true } className="app">

        {/*----------INTERACTIVE CURSOR----------*/}

        <Cursor reference={ buttonRef } color={ menuLinesBackground } />
        
        {/* ----------MENU BUTTON---------- */}

        <Button
          className="menuIcon"
          variant="outline-dark"
          onClick={ handleMenuButtonClick }
          ref={ buttonRef }
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


        {/* ----------MENU---------- */}


        {
          menuIsOpen && (
            <CSSTransition
              in={ menuButtonIsClicked }
              unmountOnExit={ true }
              timeout={ 1700 }
            >
            <div className="menu">

              {/* ----------MENU STRIPS---------- */}

              <CSSTransition
                in={ menuButtonIsClicked }
                appear={ true }
                unmountOnExit={ true }
                timeout={ {
                  enter: 600,
                  appear: 600,
                  exit: 1100
                } }
                classNames="menuStripOne"
              >
                <div className="menuStrip menuStripOne" />
              </CSSTransition>
              <CSSTransition
                in={ menuButtonIsClicked }
                appear={ true }
                unmountOnExit={ true }
                timeout={ {
                  enter: 800,
                  appear: 800,
                  exit: 1300
                } }
                classNames="menuStripTwo"
              >
                <div className="menuStrip menuStripTwo">
                  <div className="verticalLineMenu" />

                  {/* ----------MENU LINKS---------- */}
                  
                  <div className="linksWrapper">

                    <div className="linkWrapper homeWrapper">
                      <CSSTransition
                        in={ menuButtonIsClicked }
                        appear={ true }
                        unmountOnExit={ true }
                        timeout={ 500 }
                        classNames="menuLinkHome"
                      >
                        <Link to="/">
                          <h1
                            onClick={ handleMenuButtonClick }
                            className="menuLink menuLinkHome"
                            style={ state.style.menuLink }
                          >Home</h1>
                        </Link>
                      </CSSTransition>
                    </div>
                    
                    <div className="linkWrapper aboutWrapper">
                      <CSSTransition
                        in={ menuButtonIsClicked }
                        appear={ true }
                        unmountOnExit={ true }
                        timeout={ 600 }
                        classNames="menuLinkAbout"
                      >
                        <Link to="/about">
                          <h1
                            onClick={ handleMenuButtonClick }
                            className="menuLink menuLinkAbout"
                            style={ state.style.menuLink }  
                          >About</h1>
                        </Link>
                      </CSSTransition>  
                    </div>

                    <div className="linkWrapper galleryWrapper">
                      <CSSTransition
                        in={ menuButtonIsClicked }
                        appear={ true }
                        unmountOnExit={ true }
                        timeout={ 700 }
                        classNames="menuLinkGallery"
                      >
                        <Link to="/gallery">
                          <h1
                            onClick={ handleMenuButtonClick }
                            className="menuLink menuLinkGallery"
                            style={ state.style.menuLink }
                          >Gallery</h1>
                        </Link>
                      </CSSTransition>  
                    </div>

                    <div className="linkWrapper contactWrapper">
                      <CSSTransition
                        in={ menuButtonIsClicked }
                        appear={ true }
                        unmountOnExit={ true }
                        timeout={ 800 }
                        classNames="menuLinkContact"
                      >
                        <Link to="/contact">
                          <h1
                            onClick={ handleMenuButtonClick }
                            className="menuLink menuLinkContact"
                            style={ state.style.menuLink }
                          >Contact</h1>
                        </Link>
                      </CSSTransition>  
                    </div>
                    
                    <div className="linkWrapper blogWrapper">
                      <CSSTransition
                        in={ menuButtonIsClicked }
                        appear={ true }
                        unmountOnExit={ true }
                        timeout={ 900 }
                        classNames="menuLinkBlog"
                      >
                        <Link to="/blog">
                          <h1
                            onClick={ handleMenuButtonClick }
                            className="menuLink menuLinkBlog"
                            style={ state.style.menuLink }
                          >Blog</h1>
                        </Link>
                      </CSSTransition> 
                    </div>
                    
                  </div>

                </div>
              </CSSTransition>
              <CSSTransition
                in={ menuButtonIsClicked }
                appear={ true }
                unmountOnExit={ true }
                timeout={ {
                  enter: 1000,
                  appear: 1000,
                  exit: 1500
                } }
                classNames="menuStripThree"
              >
                <div className="menuStrip menuStripThree" />
              </CSSTransition>
              <CSSTransition
                in={ menuButtonIsClicked }
                appear={ true }
                unmountOnExit={ true }
                timeout={ {
                  enter: 1200,
                  appear: 1200,
                  exit: 1700
                } }
                classNames="menuStripFour"
              >
                <div className="menuStrip menuStripFour">
                <div className="verticalLineMenu" />
                </div>
              </CSSTransition>
              
            </div>
            </CSSTransition>
          )
        }

        <Switch>
          <Route exact path="/">
            {
              mountIntro && ( <Intro showIntro={ showIntro } clientWidth={ width } /> )
            }
            <Home clientWidth={ width } />
          </Route>
          <Route path="/about">
            <About clientWidth={ width } />
          </Route>
          <Route path="/gallery">
            <Gallery />
          </Route>
          <Route path="/contact">
            <Contact />
          </Route>
          <Route path="/blog">
            <Blog />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
