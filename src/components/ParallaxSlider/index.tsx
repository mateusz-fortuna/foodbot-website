import React, { Component, createRef } from 'react';
import Thumbnail from './Thumbnail';
import { lerp } from '../../assets/js/lerp';
import {
  Props,
  State,
  SetTransform,
  HandleScroll,
  HandleTouch,
  SetFullSizePhoto,
  HandleImageLoad,
} from './types';
import './index.sass';
import SliderImage from './SliderImage';

class ParallaxSlider extends Component<Props, State> {
  private sliderRef: React.RefObject<HTMLDivElement> = createRef();
  private imageRefs: (HTMLImageElement | null)[] = [];
  private imagesQuantity: number = this.props.imagesURLs.length;
  private requestID: number = 0;

  constructor(props: Props) {
    super(props);
    const { speed } = props;

    this.state = {
      isThumbnailMounted: [],
      imgRatio: 0,
      imgWidth: 0,
      imgHeight: 0.7 * window.innerHeight,
      sliderWidth: 0,
      sliderMargin: 0,
      ease: speed ? speed : 0.05,
      x: 0,
      pixelsScrolled: 0,
      touchStart: 0,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    };
  }

  // ----------HELPERS---------- //

  setTransform: SetTransform = (el, value) => (el.style.transform = value);

  scrollingWithBoundaries = (scrollPosition: number) => {
    const { sliderWidth, sliderMargin, windowWidth } = this.state;
    // Scrolling between 0 and the slider width
    return +(
      Math.max(0, scrollPosition) &&
      Math.min(scrollPosition, sliderWidth + 2 * sliderMargin - windowWidth)
    ).toFixed(2);
  };

  resetSliderPosition = () => this.setState({ pixelsScrolled: 0 });

  // ----------ANIMATIONS---------- //

  animateImages = () => {
    const { x, imgWidth } = this.state;
    const ratio = x / imgWidth;

    [...this.imageRefs].forEach((img, index) => {
      const intersectionRatioValue = +(ratio - index * 0.07).toFixed(2);
      if (img) this.setTransform(img, `translate3d(${intersectionRatioValue * 70}px, 0,0)`);
    });
  };

  animateSlider = () => {
    const slider = this.sliderRef.current;

    if (slider) {
      this.setState(({ x, pixelsScrolled, ease }) => ({
        x: +lerp(x, pixelsScrolled, ease).toFixed(2),
      }));

      this.setTransform(slider, `translate3d(${-this.state.x}px,0,0)`);
      this.animateImages();

      this.requestID = requestAnimationFrame(this.animateSlider);
    }
  };

  // ----------HANDLERS---------- //

  handleScroll: HandleScroll = ({ deltaY }) => {
    this.setState(({ pixelsScrolled }) => ({
      pixelsScrolled: this.scrollingWithBoundaries(pixelsScrolled + deltaY),
    }));
  };

  handleTouchStart: HandleTouch = ({ changedTouches }) => {
    const start = changedTouches[0].pageX;
    this.setState({ touchStart: +start.toFixed(2) });
  };

  handleSwipe: HandleTouch = ({ changedTouches }) => {
    const touchEnd = changedTouches[0].pageX;
    this.setState(({ pixelsScrolled, touchStart }) => ({
      pixelsScrolled: this.scrollingWithBoundaries(pixelsScrolled - (touchEnd - touchStart)),
    }));
  };

  setImageRatio: HandleImageLoad = ({ target }) => {
    const img = target as HTMLImageElement;
    this.setState({ imgRatio: +(img.width / img.height).toFixed(2) });
  };

  setImageWidth: HandleImageLoad = ({ target }) => {
    const img = target as HTMLImageElement;
    this.setState({ imgWidth: img.width });
  };

  setFullSizePhoto: SetFullSizePhoto = ({ target }) => {
    const img = target as HTMLImageElement;

    // Get only number from the target image id to use it as an index
    const id = img.getAttribute('id')?.match(/\d+/);

    // Remove the thumbnail by falsy rendering condition
    if (id) {
      this.setState(({ isThumbnailMounted }) => ({
        isThumbnailMounted: [
          ...isThumbnailMounted.slice(0, +id - 1),
          false,
          ...isThumbnailMounted.slice(+id),
        ],
      }));
    }

    img.removeEventListener('load', this.setFullSizePhoto);
  };

  updateViewportSize = () => {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });
  };

  // ----------COMPONENT LIFE CYCLE---------- //

  componentDidMount() {
    // Set a state property which allows rendering the thumbnails
    this.props.thumbnailsURLs?.forEach(() =>
      this.setState(({ isThumbnailMounted }) => ({
        isThumbnailMounted: [...isThumbnailMounted, true],
      }))
    );

    const slider = this.sliderRef.current;
    if (slider) this.setState({ sliderMargin: slider.getBoundingClientRect().x });

    this.requestID = requestAnimationFrame(this.animateSlider);
    window.addEventListener('wheel', this.handleScroll);
    window.addEventListener('touchstart', this.handleTouchStart);
    window.addEventListener('touchend', this.handleSwipe);
    window.addEventListener('resize', this.updateViewportSize);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { windowHeight, imgHeight, imgRatio, isThumbnailMounted } = this.state;

    // Conditions
    const windowHeightChanged = prevState.windowHeight !== windowHeight;
    const imgRatioChanged = prevState.imgRatio !== imgRatio;
    const referencesLoaded = this.imageRefs.length === this.props.imagesURLs.length;
    const thumbnailsChanged = prevState.isThumbnailMounted !== isThumbnailMounted;
    const thumbnailsUnmounted = isThumbnailMounted.every((val) => val === false);

    if (windowHeightChanged) {
      // Update the height of the images
      this.setState(({ windowHeight }) => ({ imgHeight: 0.7 * windowHeight }));
    }

    if (imgRatioChanged) {
      // Set the width of the images based on the ratio
      const imageWidth = imgHeight * imgRatio;
      this.setState({ imgWidth: +imageWidth.toFixed(2) });

      // Set the slider width based on its margin
      const slider = this.sliderRef.current;
      if (slider) {
        this.setState(({ sliderMargin, imgWidth }) => ({
          sliderWidth: (imgWidth - 200 + sliderMargin) * this.imagesQuantity,
        }));
      }
    }

    // Set onLoad listener on the images when all references are loaded
    if (referencesLoaded) {
      [...this.imageRefs].forEach((el) => el?.addEventListener('load', this.setFullSizePhoto));
    }

    if (thumbnailsChanged && thumbnailsUnmounted) this.resetSliderPosition();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.requestID);
    window.removeEventListener('wheel', this.handleScroll);
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchend', this.handleSwipe);
    window.removeEventListener('resize', this.updateViewportSize);
  }

  // ----------RENDER---------- //

  render() {
    const { sliderWidth, isThumbnailMounted, imgWidth, imgHeight } = this.state;
    const { imagesURLs, thumbnailsURLs } = this.props;

    return (
      <div className="gallery_slider" ref={this.sliderRef} style={{ width: sliderWidth }}>
        {imagesURLs.map((path, index) => (
          <SliderImage
            path={path}
            index={index}
            imgWidth={imgWidth}
            imgHeight={imgHeight}
            imageRefs={this.imageRefs}
            setImageRatio={this.setImageRatio}
            key={`SliderImage${index + 1}`}
          >
            {thumbnailsURLs && isThumbnailMounted[index] && (
              <Thumbnail
                index={index}
                path={thumbnailsURLs[index]}
                imgHeight={imgHeight}
                setImageRatio={this.setImageRatio}
                setImageWidth={this.setImageWidth}
              />
            )}
          </SliderImage>
        ))}
      </div>
    );
  }
}

export default ParallaxSlider;
