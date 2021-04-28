import React, { Component, createRef } from 'react';
import Thumbnail from './Thumbnail';
import { lerp } from '../../assets/js/lerp';
import { Props, State, SetTransform, HandleScroll, SetFullSizePhoto, SetImageRatio } from './types';
import './index.sass';

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
      scrollY: 0,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    };
  }

  // ----------HELPERS---------- //

  setTransform: SetTransform = (el, value) => (el.style.transform = value);

  setImageRatio: SetImageRatio = ({ target }) => {
    const img = target as HTMLImageElement;
    this.setState({ imgRatio: +(img.width / img.height).toFixed(2) });
  };

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
      this.setState(({ x, scrollY, ease }) => ({
        x: +lerp(x, scrollY, ease).toFixed(2),
      }));

      this.setTransform(slider, `translate3d(${-this.state.x}px,0,0)`);
      this.animateImages();

      this.requestID = requestAnimationFrame(this.animateSlider);
    }
  };

  // ----------HANDLERS---------- //

  handleScroll: HandleScroll = ({ deltaY }) => {
    const { scrollY, sliderWidth, windowWidth, sliderMargin } = this.state;

    // Scrolling between 0 and the slider width
    const scrollingWithBoundaries =
      Math.max(0, scrollY + deltaY) &&
      Math.min(scrollY + deltaY, sliderWidth - windowWidth + 2 * sliderMargin);

    this.setState(() => ({
      scrollY: +scrollingWithBoundaries.toFixed(2),
    }));
  };

  setFullSizePhoto: SetFullSizePhoto = ({ target }) => {
    // Get the target image id and use it as an index
    const img = target as HTMLDivElement;
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

    this.requestID = requestAnimationFrame(this.animateSlider);
    window.addEventListener('wheel', this.handleScroll);
    window.addEventListener('resize', this.updateViewportSize);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { windowHeight, imgHeight, imgRatio } = this.state;

    // Conditions
    const windowHeightChanged = prevState.windowHeight !== windowHeight;
    const imgRatioChanged = prevState.imgRatio !== imgRatio;
    const referencesLoaded = this.imageRefs.length === this.props.imagesURLs.length;

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
        this.setState({ sliderMargin: slider.getBoundingClientRect().x });
        this.setState(({ sliderMargin }) => ({
          sliderWidth: slider.clientWidth + sliderMargin * this.imagesQuantity,
        }));
      }
    }

    // Set onLoad listener on the images when all references are loaded
    if (referencesLoaded) {
      [...this.imageRefs].forEach((el) => el?.addEventListener('load', this.setFullSizePhoto));
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.requestID);
    window.removeEventListener('wheel', this.handleScroll);
    window.removeEventListener('resize', this.updateViewportSize);
  }

  // ----------RENDER---------- //

  render() {
    const { sliderWidth, isThumbnailMounted, imgWidth, imgHeight } = this.state;
    const { imagesURLs } = this.props;

    return (
      <div className="gallery_slider" ref={this.sliderRef} style={{ width: sliderWidth }}>
        {imagesURLs.map((path, index) => (
          <div
            className="imageWrapper"
            key={`Wrapper${index + 1}`}
            style={{ width: imgWidth - 200 }}
          >
            {isThumbnailMounted[index] && (
              <Thumbnail
                index={index}
                path={path}
                imgHeight={imgHeight}
                onLoadHandler={this.setImageRatio}
              />
            )}

            <img
              height={imgHeight}
              src={path}
              alt={`${index + 1}`}
              id={`image${index + 1}`}
              key={`image${index + 1}`}
              ref={(el) => (this.imageRefs[index] = el)}
              className="gallery_image"
              onLoad={this.setImageRatio}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default ParallaxSlider;
