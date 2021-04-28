import React, { Component, createRef } from 'react';
import { lerp } from '../../assets/js/lerp';
import Spinner from './Spinner';
import './index.sass';
import {
  Props,
  State,
  SetTransform,
  HandleScroll,
  GenerateThumbnails,
  SetFullSizePhoto,
  EqualNumberIDs,
  SetImageRatio,
} from './types';

class ParallaxSlider extends Component<Props, State> {
  private sliderRef: React.RefObject<HTMLDivElement>;
  private imageRefs: (HTMLImageElement | null)[];
  private wrapperRefs: (HTMLDivElement | null)[];
  private imagesQuantity: number;
  private requestID: number;

  constructor(props: Props) {
    super(props);
    const { speed, imagesURLs } = props;

    this.sliderRef = createRef();
    this.imageRefs = [];
    this.wrapperRefs = [];

    this.state = {
      thumbnails: [],
      images: [],
      ease: speed ? speed : 0.05,
      imgRatio: 0,
      imgWidth: 0,
      sliderWidth: 0,
      sliderMargin: 0,
      x: 0,
      scrollY: 0,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    };

    this.imagesQuantity = imagesURLs.length;
    this.requestID = 0;

    this.handleScroll = this.handleScroll.bind(this);
    this.updateViewportSize = this.updateViewportSize.bind(this);
    this.setFullSizePhoto = this.setFullSizePhoto.bind(this);
    this.setImageRatio = this.setImageRatio.bind(this);
  }

  // ----------HELPERS---------- //

  setTransform: SetTransform = (el, value) => (el.style.transform = value);

  // ----------ANIMATIONS---------- //

  animateImages = () => {
    const { x, imgWidth } = this.state;

    if (typeof imgWidth === 'number') {
      const ratio = x / imgWidth;

      [...this.imageRefs].forEach((img, index) => {
        const intersectionRatioValue = +(ratio - index * 0.07).toFixed(2);
        if (img) this.setTransform(img, `translate3d(${intersectionRatioValue * 70}px, 0,0)`);
      });
    }
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

  setImageRatio: SetImageRatio = ({ target }) => {
    const img = target as HTMLImageElement;
    this.setState({ imgRatio: +(img.width / img.height).toFixed(2) });
  };

  updateViewportSize = () => {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });
  };

  setFullSizePhoto: SetFullSizePhoto = ({ target }) => {
    // Get the target image id and use it as an index to remove
    const img = target as HTMLDivElement;
    const imgID = img.getAttribute('id')?.match(/\d+/);

    if (imgID) {
      // Remove the thumbnail from the array and its event
      this.setState(({ thumbnails }) => ({ thumbnails: thumbnails.splice(+imgID - 1, 1) }));
      img.removeEventListener('load', this.setFullSizePhoto);
    }
  };

  // ----------JSX TEMPLATE---------- //

  // A function which generates the thumbnails and pass them to the state

  generateThumbnails: GenerateThumbnails = (urlArray) =>
    urlArray?.map((path, index) => {
      this.setState(({ thumbnails, windowHeight }) => ({
        thumbnails: [
          ...thumbnails,
          <div className="thumbnailWrapper" id={`thumbnailWrapper${index + 1}`}>
            <Spinner />
            <img
              src={path}
              height={0.7 * windowHeight}
              className="thumbnail"
              alt={`thumbnail${index + 1}`}
            />
          </div>,
        ],
      }));
    });

  // A function which generates the images with their wrappers and thumbnails
  // And pass them to the state

  generateImages = (urlArray: string[]) =>
    urlArray.map((path, index) => {
      return this.setState(({ images, thumbnails, windowHeight }) => ({
        images: [
          ...images,
          <div
            className="imageWrapper"
            key={`Wrapper${index + 1}`}
            ref={(ref) => (this.wrapperRefs[index] = ref)}
          >
            {thumbnails[index]}
            <img
              height={0.7 * windowHeight}
              src={path}
              alt={`${index + 1}`}
              id={`image${index + 1}`}
              key={`image${index + 1}`}
              ref={(el) => (this.imageRefs[index] = el)}
              className="gallery_image"
              onLoad={this.setImageRatio}
            />
          </div>,
        ],
      }));
    });

  // ----------COMPONENT LIFE CYCLE---------- //

  componentDidMount() {
    // Generate JSX
    const { thumbnailsURLs, imagesURLs } = this.props;

    if (thumbnailsURLs) this.generateThumbnails(thumbnailsURLs);
    this.generateImages(imagesURLs);

    // Event listeners
    this.requestID = requestAnimationFrame(this.animateSlider);
    window.addEventListener('wheel', this.handleScroll);
    window.addEventListener('resize', this.updateViewportSize);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { windowHeight, imgRatio, imgWidth } = this.state;
    const { thumbnailsURLs, imagesURLs } = this.props;

    if (prevState.imgRatio !== imgRatio) {
      // Set image width based on its ratio
      // And set proper width of the wrappers

      const imageWidth = 0.7 * windowHeight * imgRatio;

      this.setState({ imgWidth: +imageWidth.toFixed(2) });

      [...this.wrapperRefs].forEach((el) => {
        if (el && typeof imgWidth === 'number') {
          el.style.width = `${imageWidth - 200}px`;
        }
      });

      // Store the slider margin in the state
      // And then set its width based on this margin

      const slider = this.sliderRef.current;

      if (slider) {
        this.setState({ sliderMargin: slider.getBoundingClientRect().x });

        this.setState(({ sliderMargin }) => ({
          sliderWidth: slider.clientWidth + sliderMargin * this.imagesQuantity,
        }));
      }
    }

    if (this.state.images.length === this.props.imagesURLs.length) {
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
    const { sliderWidth, images } = this.state;

    return (
      <div
        className="gallery_slider"
        ref={this.sliderRef}
        style={{ width: sliderWidth === 0 ? 'auto' : sliderWidth }}
      >
        {images}
      </div>
    );
  }
}

export default ParallaxSlider;
