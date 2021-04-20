export interface Props {
  imagesURLs: string[];
  thumbnailsURLs?: string[];
  speed?: number;
}

export interface State {
  thumbnails: JSX.Element[];
  images: JSX.Element[];
  imgWidth: number | 'auto';
  imgRatio: number;
  scrollY: number;
  ease: number;
  sliderWidth: number;
  x: number;
  endX: number;
  windowWidth: number;
  windowHeight: number;
}

export type SetTransform = (el: HTMLElement, value: string) => void;
export type HandleScroll = (event: WheelEvent) => void;
export type InsertThumbnail = (index: number) => JSX.Element | undefined;
export type SetFullSizePhoto = (event: Event) => void;
export type EqualNumberIDs = (el: any) => void;
export type SetImageRatio = React.ReactEventHandler<HTMLImageElement>;
