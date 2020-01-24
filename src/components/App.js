import React, { useState, useEffect } from 'react';
import './App.sass';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import { Container } from 'react-bootstrap';
import Intro from './Intro';
import Home from './Home';
import About from './About';
import Gallery from './Gallery';
import Contact from './Contact';
import Blog from './Blog';


const App = () => {

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

  //----------JSX CODE----------//

  return (
    <Router>
      <Container fluid={ true } className="app">
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
