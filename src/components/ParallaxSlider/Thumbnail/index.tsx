import React from 'react';
import Spinner from './Spinner';
import { SetImageRatio } from '../types';

interface Props {
  index: number;
  path: string;
  imgHeight: number;
  onLoadHandler: SetImageRatio;
}

const Thumbnail: React.FC<Props> = ({ index, path, imgHeight, onLoadHandler }) => (
  <div className="thumbnailWrapper" id={`thumbnailWrapper${index + 1}`}>
    <Spinner />
    <img
      src={path}
      height={imgHeight}
      className="thumbnail"
      alt={`thumbnail${index + 1}`}
      onLoad={onLoadHandler}
    />
  </div>
);

export default Thumbnail;
