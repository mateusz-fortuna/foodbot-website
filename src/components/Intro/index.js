import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import './index.sass';
import Text from '../Text';

const Index = props => {
  const state = {
    style: {
      introTitle: {
        fontSize: Math.floor( 0.08 * props.clientWidth )
      },
      introSubtitle: {
        fontSize: Math.floor( 0.03 * props.clientWidth )
      }
    }
  }

  return (
    <Row className="h-100">
      <Col className="h-100 p-0">
        <div className="intro d-flex justify-content-center align-items-center">
          <div className="stripContainer">
            <CSSTransition
              in={ props.showIntro }
              timeout={ 1000 }
              classNames="stripOne"
            >
              <div className="strip stripOne" />
            </CSSTransition>
            <CSSTransition
              in={ props.showIntro }
              timeout={ 1200 }
              classNames="stripTwo"
            >
              <div className="strip stripTwo" />
            </CSSTransition>
            <CSSTransition
              in={ props.showIntro }
              timeout={ 1300 }
              classNames="stripThree"
            >
              <div className="strip stripThree" />
            </CSSTransition>
            <CSSTransition
              in={ props.showIntro }
              timeout={ 1400 }
              classNames="stripFour"
            >
              <div className="strip stripFour" />
            </CSSTransition>
          </div>
          <div className="introTextWrapper text-center">
            <div className="introTitleWrapper">
              <CSSTransition
                in={ props.showIntro }
                timeout={ 1000 }
                classNames="introTitle"
                appear={ true }
              >
                <h1 className="introTitle" style={ state.style.introTitle }><Text category="intro" textID="title" /></h1>
              </CSSTransition>
            </div>
            <div className="introSubtitleWrapper">
            <CSSTransition
                in={ props.showIntro }
                timeout={ 2000 }
                classNames="introSubtitle"
                appear={ true }
              >
                <p className="introSubtitle" style={ state.style.introSubtitle }><Text category="intro" textID="subtitle" /></p>  
              </CSSTransition>
            </div> 
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Index;