// ----------PARALLAX SLIDER---------- //

export interface Props {
  imagesURLs: string[];
  thumbnailsURLs?: string[];
  speed?: number;
}

export interface State {
  isThumbnailMounted: boolean[];
  imgRatio: number;
  imgWidth: number;
  imgHeight: number;
  ease: number;
  sliderWidth: number;
  sliderMargin: number;
  x: number;
  scrollY: number;
  windowWidth: number;
  windowHeight: number;
}

export type SetTransform = (el: HTMLElement, value: string) => void;
export type HandleScroll = (event: WheelEvent) => void;
export type SetFullSizePhoto = (event: Event) => void;
export type EqualNumberIDs = (el: any) => void;
export type HandleImageLoad = React.ReactEventHandler<HTMLImageElement>;
export type GenerateThumbnails = (path: string[]) => void;

// ----------SLIDER CONTENT---------- //

interface SliderContent {
  path: string;
  index: number;
  imgHeight: number;
  setImageRatio: HandleImageLoad;
}

export interface SliderImageProps extends SliderContent {
  imgWidth: number;
  imageRefs: (HTMLImageElement | null)[];
}

export interface ThumbnailProps extends SliderContent {
  setImageWidth: HandleImageLoad;
}
