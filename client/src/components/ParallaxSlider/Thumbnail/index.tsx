import React from 'react';
import Spinner from './Spinner';
import { ThumbnailProps, HandleImageLoad } from '../types';

const Thumbnail: React.FC<ThumbnailProps> = ({
  index,
  path,
  imgHeight,
  setImageRatio,
  setImageWidth,
}) => {
  const handleThumbnailLoad: HandleImageLoad = (event) => {
    setImageRatio(event);
    setImageWidth(event);
  };

  return (
    <div className="thumbnailWrapper" id={`thumbnailWrapper${index + 1}`}>
      <Spinner />
      <img
        src={path}
        height={imgHeight}
        className="thumbnail"
        alt={`thumbnail${index + 1}`}
        onLoad={handleThumbnailLoad}
      />
    </div>
  );
};
export default Thumbnail;
