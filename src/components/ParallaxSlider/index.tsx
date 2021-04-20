import React, { Component, createRef } from 'react';
import { lerp } from '../../assets/js/lerp';
import Spinner from './Spinner';
import {
  Props,
  State,
  SetTransform,
  HandleScroll,
  InsertThumbnail,
  SetFullSizePhoto,
  EqualNumberIDs,
  SetImageRatio,
} from './types';

class ParallaxSlider extends Component<Props, State> {
  private sliderRef: React.RefObject<HTMLDivElement>;
  private imageRefs: Array<HTMLImageElement | null>;
  private requestID: number;

  constructor(props: Props) {
    super(props);
    const { speed } = props;

    this.sliderRef = createRef();
    this.imageRefs = [];

    const slider = this.sliderRef.current;
    const imagesQuantity = this.imageRefs.length;

    this.state = {
      thumbnails: [],
      images: [],
      ease: speed ? speed : 0.05,
      imgRatio: 0,
      imgWidth: 0,
      sliderWidth: 0,
      x: 0,
      endX: 0,
      scrollY: 0,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    };

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
      this.setState(({ x, endX, ease, scrollY }) => ({
        x: +lerp(x, endX, ease).toFixed(2),
        endX: scrollY,
      }));

      this.setTransform(slider, `translate3d(${-this.state.x}px,0,0)`);
      this.animateImages();

      this.requestID = requestAnimationFrame(this.animateSlider);
    }
  };

  // ----------HANDLERS---------- //

  handleScroll: HandleScroll = ({ deltaY }) => {
    this.setState(({ scrollY, sliderWidth }) => ({
      scrollY: +(Math.max(0, scrollY + deltaY) && Math.min(scrollY + deltaY, sliderWidth)).toFixed(
        2
      ),
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
    const { thumbnails } = this.state;

    const img = target as HTMLElement;
    const imgID = img.getAttribute('id');
    const imgNumberID = imgID?.slice(imgID.length - 1);

    const equalNumberIDs: EqualNumberIDs = (el) => {
      const thumbnailID = el.getAttribute('id');
      const thumbnailNumberID = thumbnailID.slice(thumbnailID.length - 1);

      return imgNumberID === thumbnailNumberID;
    };

    const thumbnailIndex = thumbnails.findIndex(equalNumberIDs);

    this.setState(({ thumbnails }) => ({ thumbnails: thumbnails.splice(thumbnailIndex, 1) }));
    img.removeEventListener('load', this.setFullSizePhoto);
  };

  // ----------JSX TEMPLATES---------- //

  // ----------COMPONENT LIFE CYCLE---------- //

  componentDidMount() {
    const { imagesURLs, thumbnailsURLs } = this.props;
    const { imgWidth, windowHeight } = this.state;

    // Generate the thumbnails and pass them to the state

    thumbnailsURLs?.map((path, index) => {
      this.setState(({ thumbnails }) => ({
        thumbnails: [
          ...thumbnails,
          <div className="thumbnailWrapper" id={`ThumbnailWrapper${index + 1}`}>
            <Spinner />
            <div
              className="thumbnail"
              style={{
                width: imgWidth,
                height: 0.7 * windowHeight,
                backgroundImage: `url(${path})`,
              }}
            />
          </div>,
        ],
      }));
    });

    const insertThumbnail: InsertThumbnail = (index) => {
      const { thumbnails } = this.state;
      if (thumbnails.length !== 0) return thumbnails[index];
    };

    // Generate the images with their wrappers and thumbnails
    // And pass them to the state

    imagesURLs.map((path, index) => {
      return this.setState(({ images }) => ({
        images: [
          ...images,
          <div
            className="imageWrapper"
            key={`Wrapper${index + 1}`}
            style={{ width: `${typeof imgWidth === 'number' ? `${imgWidth - 200}px` : 'auto'}` }}
          >
            {insertThumbnail(index)}
            <img
              width={'initial'}
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

    // Event listeners
    this.requestID = requestAnimationFrame(this.animateSlider);
    window.addEventListener('wheel', this.handleScroll);
    window.addEventListener('resize', this.updateViewportSize);
    [...this.imageRefs].forEach((el) => el?.addEventListener('load', this.setFullSizePhoto));
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { windowHeight, windowWidth, imgRatio } = this.state;
    const imgWidth = 0.7 * windowHeight * imgRatio;

    if (prevState.imgRatio !== this.state.imgRatio) {
      this.setState({
        imgWidth: +imgWidth.toFixed(2),
        sliderWidth: +(imgWidth * this.imageRefs.length - windowWidth).toFixed(2),
      });
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
      <div className="gallery_slider" ref={this.sliderRef} style={{ width: sliderWidth }}>
        {images}
      </div>
    );
  }
}

export default ParallaxSlider;
