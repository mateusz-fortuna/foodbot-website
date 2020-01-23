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
    setTimeout( () => setShowIntro( false ), 3500 );
    setTimeout( () => setMountIntro( false ), 5000 );
  } );

  //----------JSX CODE----------//

  return (
    <Router>
      <Container fluid={ true } className="app">
        {
          mountIntro && ( <Intro showIntro={ showIntro } /> )
        }
        <Switch>
          <Route exact path="/">
            <Home />
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
