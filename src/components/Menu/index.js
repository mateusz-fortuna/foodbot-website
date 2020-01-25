import React from 'react';
import { CSSTransition } from 'react-transition-group'
import './index.sass';

const Menu = props => {
  return (
    <CSSTransition
      in={ props.menuButtonIsClicked }
      unmountOnExit={ true }
      timeout={ 1200 }
    >
    <div className="menu">

      {/* ----------MENU STRIPS---------- */}

      <CSSTransition
        in={ props.menuButtonIsClicked }
        appear={ true }
        unmountOnExit={ true }
        timeout={ 600 }
        classNames="menuStripOne"
      >
        <div className="menuStrip menuStripOne" />
      </CSSTransition>
      <CSSTransition
        in={ props.menuButtonIsClicked }
        appear={ true }
        unmountOnExit={ true }
        timeout={ 800 }
        classNames="menuStripTwo"
      >
        <div className="menuStrip menuStripTwo" />
      </CSSTransition>
      <CSSTransition
        in={ props.menuButtonIsClicked }
        appear={ true }
        unmountOnExit={ true }
        timeout={ 1000 }
        classNames="menuStripThree"
      >
        <div className="menuStrip menuStripThree" />
      </CSSTransition>
      <CSSTransition
        in={ props.menuButtonIsClicked }
        appear={ true }
        unmountOnExit={ true }
        timeout={ 1200 }
        classNames="menuStripFour"
      >
        <div className="menuStrip menuStripFour" />
      </CSSTransition>
      
    </div>
    </CSSTransition>
  );
};

export default Menu;