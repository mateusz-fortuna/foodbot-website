import React, { Component } from 'react';
import './index.sass';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

class Logo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      style: {
        width: 0,
        height: 0,
      },
    };

    this.logoColorChange = this.logoColorChange.bind(this);
  }

  //----------GET DIMENSIONS OF CHILD NODE----------//

  static getDerivedStateFromProps(props) {
    if (props.innerRef.current !== null)
      return {
        style: {
          width: props.innerRef.current !== undefined ? props.innerRef.current.clientWidth : 0,
          height: props.innerRef.current !== undefined ? props.innerRef.current.clientHeight : 0,
        },
      };
    return null;
  }

  //----------SET LOGO COLOR DEPENDING ON THE URL----------//

  logoColorChange = () => {
    switch (this.props.urlEnd) {
      case 'about':
        return '#e0e0e0';
      default:
        return '#0e0e0e';
    }
  };

  render() {
    const { innerRef, width, mount } = this.props;
    const { style } = this.state;

    return (
      <CSSTransition
        unmountOnExit={true}
        timeout={{
          appear: 2000,
          enter: 2000,
          exit: 0,
        }}
        appear={true}
        in={mount}
      >
        <div className="logo__wrapper" style={style}>
          <Link to="/" className="d-block logoLink" style={style}>
            <CSSTransition
              classNames="logo"
              unmountOnExit={true}
              timeout={{
                appear: 2000,
                enter: 2000,
                exit: 0,
              }}
              appear={true}
              in={mount}
            >
              <h1
                className="logo"
                style={{
                  fontSize: 0.02 * width,
                  color: this.logoColorChange(),
                }}
                ref={innerRef}
              >
                FoodBot
              </h1>
            </CSSTransition>
          </Link>
        </div>
      </CSSTransition>
    );
  }
}

export default React.forwardRef((props, ref) => <Logo innerRef={ref} {...props} />);
