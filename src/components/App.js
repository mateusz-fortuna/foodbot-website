import React, { useState, useEffect } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.sass';

import {
  BrowserRouter as Router,
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


const App = () => {

  //----------MENU BUTTON HANDLER----------//
  const [ menuIsOpen, setMenuIsOpen ] = useState( false );
  const [ menuButtonIsClicked, setMenuButtonIsClicked ] = useState( false );
  const menuLinesBackground = menuButtonIsClicked ? '#e0e0e0' : null;

  const handleMenuButtonClick = () => {
    setMenuButtonIsClicked( !menuButtonIsClicked );
    setMenuIsOpen( true )
  };

  //----------INTRO HANDLERS----------//

  const [ showIntro, setShowIntro ] = useState( true );
  const [ mountIntro, setMountIntro ] = useState( true )
  
  useEffect( () => {
    setTimeout( () => setShowIntro( false ), 2500 );
    setTimeout( () => setMountIntro( false ), 4000 );
  } );

  //----------HOME TITILE HANDLER----------//

  const [ width, setWidth ] = useState( window.innerWidth );
  
  useEffect( () => {
    const updateWidth = () => {
      setWidth( window.innerWidth );
    };
    window.addEventListener( 'resize', updateWidth );
    return () => window.removeEventListener( 'resize', updateWidth );
  } );

  //----------APP STATE----------//

  const state = {
    style: {
      homeTitle: {
        fontSize: Math.floor( 0.08 * width )
      },
      menuLines: {
        backgroundColor: menuLinesBackground
      }
    }
  }


  //----------JSX CODE----------//


  return (
    <Router>
      <Container fluid={ true } className="app">

        {/* ----------MENU BUTTON---------- */}

        <Button
          className="menuIcon"
          variant="outline-dark"
          onClick={ handleMenuButtonClick }
        >
          <span className="topLine" style={ state.style.menuLines } />
          <span className="middleLine" style={ state.style.menuLines } />
          <span className="bottomLine" style={ state.style.menuLines } />
        </Button>

        {
          menuIsOpen && (
            <Menu menuButtonIsClicked={ menuButtonIsClicked } />
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
            <About />
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
