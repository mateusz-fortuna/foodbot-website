import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Logo extends Component {
  constructor( props ) {
    super( props );

    this.logoColorChange = this.logoColorChange.bind( this );
  }


  logoColorChange = () => {
    switch ( this.props.urlEnd ) {
      case 'about':
        return '#e0e0e0';
      default:
        return '#0e0e0e';
    }
  }
  

  render() {
    return (
      ( this.props.urlEnd !== '' ) &&
      <Link to="/" className="d-block">
        <h1
          className="logo"
          style={ {
            fontSize: 0.3 * 0.08 * this.props.width,
            color: this.logoColorChange()
          } }
          ref={ this.props.innerRef }
        >FoodBot</h1>
      </Link>
    );
  }
}

export default React.forwardRef( ( props, ref ) => <Logo innerRef={ ref } { ...props } /> );
