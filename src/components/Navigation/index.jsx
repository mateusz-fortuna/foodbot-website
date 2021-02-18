import React, { Component } from 'react';
import './index.sass';
import { Redirect } from 'react-router-dom';
import Transition from '../Transition';
import { throttle } from '../../assets/js/throttle';

class Navigation extends Component {
  constructor(props) {
    super(props);

    const { urlEnd, urlEnds, timeout } = this.props;
    this.state = {
      urlEnds,
      urlEnd,
      mountTransition: false,
      changePrevUrl: false,
      changeNextUrl: false,
      timeout: 1300,
    };

    this.handleWheelEvent = this.handleWheelEvent.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props !== state) return { urlEnd: props.urlEnd };
  }

  componentDidMount() {
    window.addEventListener('wheel', this.handleWheelEvent, false);
  }

  componentWillUnmount() {
    clearTimeout(this.prevUrlTimeout);
    clearTimeout(this.nextUrlTimeout);
    clearTimeout(this.unmountTransitionTimeout);
  }

  // ----------HANDLE SCROLL NAVIGATION---------- //

  handleWheel(event) {
    if (event.deltaY < 0) return this.prevPage();
    return this.nextPage();
  }

  handleWheelEvent(event) {
    const { timeout } = this.state;
    throttle(this.handleWheel(event), timeout);
  }

  // ----------CHANGE URL AFTER ANIMATION---------- //

  setPrevPage() {
    const { changePrevUrl, timeout } = this.state;
    this.prevUrlTimeout = setTimeout(
      () => this.setState({ changePrevUrl: !changePrevUrl }),
      timeout
    );
  }

  setNextPage() {
    const { urlEnd, urlEnds, timeout } = this.state;
    const url = window.location.href.replace(urlEnd, 'gallery');
    // eslint-disable-next-line no-restricted-globals
    this.nextUrlTimeout = setTimeout(() => history.pushState({}, '', url), timeout);
  }

  // ----------HANDLE TRANSITIONS---------- //

  mountTransition() {
    this.setState({ mountTransition: true });
  }

  unmountTransition() {
    const { timeout } = this.state;
    this.unmountTransitionTimeout = setTimeout(
      () => this.setState({ mountTransition: false }),
      timeout
    );
  }

  // ----------HANDLE PAGE CHANGE---------- //

  prevPage() {
    this.mountTransition();
    this.setPrevPage();
    this.unmountTransition();
  }

  nextPage() {
    this.mountTransition();
    this.setNextPage();
    this.unmountTransition();
  }

  // ----------REDIRECT URL---------- //

  nextUrl() {
    const { urlEnd, urlEnds } = this.props;
    const index = urlEnds.indexOf(urlEnd);
    return `/${urlEnds[index + 1]}`;
  }

  prevUrl() {
    const { urlEnd, urlEnds } = this.state;
    const index = () => {
      if (urlEnds[urlEnds.indexOf(urlEnd)] === undefined) return parseInt('0', 10);
      return urlEnds[urlEnds.indexOf(urlEnd)] - 1;
    };
    return `/${urlEnds[index()]}`;
  }

  render() {
    const { mountTransition, changePrevUrl, changeNextUrl } = this.state;
    return (
      <div className="navigation">
        {mountTransition && <Transition mountTransition={mountTransition} />}
        {changePrevUrl && <Redirect to={this.prevUrl()} />}
        {changeNextUrl && <Redirect to={this.prevUrl()} />}
      </div>
    );
  }
}

export default Navigation;
