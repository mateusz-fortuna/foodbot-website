import React, { FC } from 'react';
import { SliderImageProps } from '../types';

const SliderImage: FC<SliderImageProps> = ({
  path,
  index,
  imgWidth,
  imgHeight,
  imageRefs,
  setImageRatio,
  children,
}) => (
  <div className="imageWrapper" style={{ width: imgWidth - 200 }}>
    {children}
    <img
      height={imgHeight}
      src={path}
      alt={`${index + 1}`}
      id={`image${index + 1}`}
      ref={(el) => (imageRefs[index] = el)}
      className="gallery_image"
      onLoad={setImageRatio}
    />
  </div>
);
export default SliderImage;
