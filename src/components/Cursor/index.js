import React, { Component } from 'react';
import './index.sass';

import TweenMax from 'gsap';
import paper from 'paper';
import SimplexNoise from 'simplex-noise';

import { lerp } from '../../assets/js/lerp';
import { map } from '../../assets/js/map';


export class Cursor extends Component {
  constructor( props ) {
    super( props );

    this.smallCursor = React.createRef();
    this.canvas = React.createRef();

    this.initCursor = this.initCursor.bind( this );
    this.initCanvas = this.initCanvas.bind( this );
    this.initHovers = this.initHovers.bind( this );

    this.state = {
      isStuck: false,
      isNoisy: false,
      showCursor: false,
      test: [ this.props.reference ].flat( Infinity )
    }

    this.linkItems = this.state.test;
  };


  //----------INIT CURSOR----------//


  initCursor() {
    this.clientX = -100;
    this.clientY = -100;
    this.lastX = 0;
    this.lastY = 0;
    this.canvasCursorSpeed = 1;

    this.cursorHandler = event => {
      this.group.position = new paper.Point(
        event.clientX,
        event.clientY
      );
      this.canvasCursorSpeedTimeout = setTimeout( () => {
        this.canvasCursorSpeed = 0.2;
      }, 100 );
      this.setState( {
        showCursor: true
      } );

      this.clientX = event.clientX;
      this.clientY = event.clientY;

      this.linkItems = this.state.test;
    };

    document.addEventListener( 'mousemove', this.cursorHandler );

    const render = () => {
      TweenMax.set( this.smallCursor.current, {
        x: this.clientX,
        y: this.clientY
      } );
      this.animationFrame = requestAnimationFrame( render );
    };
    this.animationFrame = requestAnimationFrame( render );
  }


  //----------INIT CANVAS----------//


  initCanvas() {
    const shapeBounds = {
      width: 125,
      height: 125
    };
    paper.setup( this.canvas.current );

    let strokeColor = 'rgba( 14, 14, 14, 0.5 )';
    const strokeWidth = 1;
    const segments = 8;
    const radius = 15;
    const noiseScale = 150; // speed
    const noiseRange = 4;


    const polygon = new paper.Path.RegularPolygon(
      new paper.Point( 0, 0 ),
      segments,
      radius
    );
    polygon.strokeColor = strokeColor;
    polygon.strokeWidth = strokeWidth;
    polygon.smooth();

    this.group = new paper.Group( [ polygon ] );
    this.group.applyMatrix = false;

    const noiseObjects = polygon.segments.map(
      () => new SimplexNoise()
    );
    let bigCoordinates = [];

    const smallCursorBgColor = this.smallCursor.current;

    paper.view.onFrame = event => {
    
      // dynamic color change
      const { type, color } = this.props;

      if ( type === 'variable' ) {
        if ( this.clientY < window.innerHeight /2 && window.innerWidth < 992 ) {
          polygon.strokeColor = 'rgba( 224, 244, 244, 0.5 )';
          smallCursorBgColor.style.backgroundColor = '#e0e0e0';
        } else if ( this.clientY > window.innerHeight /2 && window.innerWidth < 992 ) {
          polygon.strokeColor = 'rgba( 14, 14, 14, 0.5 )';
          smallCursorBgColor.style.backgroundColor = '#0e0e0e';
        } else if ( this.clientX < window.innerWidth / 2 ) {
          polygon.strokeColor = 'rgba( 224, 244, 244, 0.5 )';
          smallCursorBgColor.style.backgroundColor = '#e0e0e0';
        } else {
          polygon.strokeColor = 'rgba( 14, 14, 14, 0.5 )';
          smallCursorBgColor.style.backgroundColor = '#0e0e0e';
        }
      } else if ( type === 'solid' && color === 'light' ) {
        polygon.strokeColor = 'rgba( 224, 244, 244, 0.5 )';
        smallCursorBgColor.style.backgroundColor = '#e0e0e0';
      } else if ( type === 'solid' && color === 'dark' ) {
        polygon.strokeColor = 'rgba( 14, 14, 14, 0.5 )';
        smallCursorBgColor.style.backgroundColor = '#0e0e0e';
      } else if ( type === 'about' ) {
        if ( color === 'details' ) {
          if ( this.clientY > window.innerHeight * 0.2 ) {
            polygon.strokeColor = 'rgba( 14, 14, 14, 0.5 )';
            smallCursorBgColor.style.backgroundColor = '#0e0e0e';
          } else {
            polygon.strokeColor = 'rgba( 224, 244, 244, 0.5 )';
            smallCursorBgColor.style.backgroundColor = '#e0e0e0';
          }
        } else {
          polygon.strokeColor = 'rgba( 224, 244, 244, 0.5 )';
          smallCursorBgColor.style.backgroundColor = '#e0e0e0';
        }
      } else {
        console.error( 'Set type and color property for the interactive cursor component.' );
      }

      const { isStuck } = this.state;
      const { isNoisy } = this.state;

      // normal behavior
      if ( !isStuck ) {
       this.lastX = lerp( this.lastX, this.clientX, this.canvasCursorSpeed );
       this.lastY = lerp( this.lastY, this.clientY, this.canvasCursorSpeed );
       this.group.position = new paper.Point( this.lastX, this.lastY );
      }
      // stuck behavior
      else if ( isStuck ) {
       this.lastX = lerp( this.lastX, this.stuckX, this.canvasCursorSpeed );
       this.lastY = lerp( this.lastY, this.stuckY, this.canvasCursorSpeed );
       this.group.position = new paper.Point( this.lastX, this.lastY );
      }

      if ( isStuck && polygon.bounds.width < shapeBounds.width ) {
        // scale up the shape
        polygon.scale( 1.08 );
      } else if ( !isStuck && polygon.bounds.width > 30 ) {
        // remove noise
        if ( isNoisy ) {
          polygon.segments.forEach( ( segment, index ) => {
            segment.point.set(
              bigCoordinates[ index ][ 0 ],
              bigCoordinates[ index ][ 1 ]
            );
          } );
          this.setState( { isNoisy: false } );
          bigCoordinates = [];
        }

        // scale down the shape
        polygon.scale( 0.92 );
      }

      // while stuck do noise
      if ( isStuck && polygon.bounds.width >= shapeBounds.width ) {
        this.setState( { isNoisy: true } );

        // get the coordinates of canvas circle
        if ( bigCoordinates.length === 0 ) {
          polygon.segments.forEach( ( segment, index ) => {
            bigCoordinates[ index ] = [ segment.point.x, segment.point.y ];
          } );
        }

        // calculate noise value for each point at that frame
        polygon.segments.forEach( ( segment, index ) => {
          const noiseX = noiseObjects[ index ].noise2D( event.count / noiseScale, 0 );
          const noiseY = noiseObjects[ index ].noise2D( event.count / noiseScale, 1 );

          const distortionX = map( noiseX, -1, 1, -noiseRange, noiseRange );
          const distortionY = map( noiseY, -1, 1, -noiseRange, noiseRange );

          const newX = bigCoordinates[ index ][ 0 ] + distortionX;
          const newY = bigCoordinates[ index ][ 1 ] + distortionY;

          segment.point.set( newX, newY );
        } );

        polygon.smooth();
      }
    };
  } 


  //----------INIT HOVERS----------//


  initHovers() {
    this.handleMouseEnter = event => {
      const navItem = event.currentTarget;
      const navItemBox = navItem.getBoundingClientRect();
      this.stuckX = Math.round( navItemBox.left + navItemBox.width / 2 );
      this.stuckY = Math.round( navItemBox.top + navItemBox.height / 2 );
      this.setState( { isStuck: true } );
    };

    this.handleMouseLeave = () => {
      this.setState( { isStuck: false } );
    };

    this.itemListenersDelay = setTimeout( () => {
      this.linkItems.forEach( item => {
        item.current.addEventListener( 'mouseenter', this.handleMouseEnter );
        item.current.addEventListener( 'mouseleave', this.handleMouseLeave );
      } );
     }, 1000 );
  }


  //----------COMPONENT PHYSICS----------//


  static getDerivedStateFromProps( nextProps ) {
    return {
      test: [ nextProps.reference ].flat( Infinity )
    }
  }

  componentDidUpdate( prevProps ) {
    if ( this.props !== prevProps ) {
      this.linkItems = this.state.test;
      this.initHovers();
      this.setState( { isStuck: false } );
    }
  }

  componentDidMount() {
    this.initCursor();
    this.initCanvas();
    if ( this.props.reference.flat( Infinity )[ 0 ] === undefined ) {
      return;
    } else { this.initHovers(); this.setState( { test: this.props.reference } ) }
  }

  componentWillUnmount() {
    clearTimeout( this.itemListenersDelay );
    clearTimeout( this.canvasCursorSpeedTimeout );
    if ( this.props.reference.flat( Infinity )[ 0 ] === undefined ) {
      return;
    } else {
      this.linkItems.forEach( item => {
        item.current.removeEventListener( 'mouseenter', this.handleMouseEnter );
        item.current.removeEventListener( 'mouseleave', this.handleMouseLeave );
      } );
    }   
    document.removeEventListener( 'mousemove', this.cursorHandler );
    cancelAnimationFrame( this.animationFrame );
  }

  render() {
    return (
      <div className="cursorContainer--outer">
        <div className="cursorContainer--inner">
          <div
            ref={ this.smallCursor }
            className="cursor cursor--small"
          />

          <canvas
            ref={ this.canvas }
            className="cursor cursor--canvas"
            data-paper-resize
          />
        </div>
      </div>
    );
  }
}

export default Cursor;
