import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';

const Menu = props => {
  const {
    menuButtonIsClicked,
    animationDone,
    setAnimationDone,
    handleMenuButtonClick,
    menuLink
  } = props;
    
  return(
    <CSSTransition
      in={ menuButtonIsClicked }
      unmountOnExit={ true }
      timeout={ 1700 }
      onExit={ () => {
        setAnimationDone( !animationDone );
      } }
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
          exit: 1300,
        } }
        classNames="menuStripTwo"
        onEntered={ () => {
          setAnimationDone( !animationDone );
        } }
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
                    onClick={ animationDone ? handleMenuButtonClick : null }
                    className="menuLink menuLinkHome"
                    style={ menuLink }
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
                    onClick={ animationDone ? handleMenuButtonClick : null }
                    className="menuLink menuLinkAbout"
                    style={ menuLink }
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
                    onClick={ animationDone ? handleMenuButtonClick : null }
                    className="menuLink menuLinkGallery"
                    style={ menuLink }
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
                    onClick={ animationDone ? handleMenuButtonClick : null }
                    className="menuLink menuLinkContact"
                    style={ menuLink }
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
                    onClick={ animationDone ? handleMenuButtonClick : null }
                    className="menuLink menuLinkBlog"
                    style={ menuLink }
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
  );
};

export default Menu;