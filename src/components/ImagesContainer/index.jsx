import React, { useState, useEffect, useContext, useCallback } from 'react';
import { LanguageContext } from '../../assets/js/context/languageContext';
import Spinner from '../Spinner';
import './index.sass';

const ImagesContainer = React.forwardRef(({ windowHeight, imgRefs, setImgRefs }, ref) => {
  // Get names of all images in gallery
  const languageContext = useContext(LanguageContext);
  const { gallery } = languageContext.dictionary;
  const imagesNames = gallery.imagesNames.map((name) => name);
  const [thumbnailsNames, setThumbnailsNames] = useState(imagesNames);

  const imageRatio = gallery.imageRatio
    .split(':')
    .reduce((width, height) => parseFloat(width) / parseFloat(height));

  // Check if images got their references to execute animations
  const referencesLoaded = imgRefs.length === imagesNames.length;

  // Set paths to those images
  const imagesPath = require.context('../../assets/images/gallery', true);
  const thumbnailsPath = require.context('../../assets/images/gallery/thumbnails', true);

  // Store references to <img> elements
  const imgRef = useCallback((imgNode) => setImgRefs((refs) => [...refs, imgNode]), [setImgRefs]);

  // Image width based on viewport height
  const imageWidth = 0.7 * windowHeight * parseFloat(imageRatio).toFixed(2);
  const imagesQuantity = imagesNames.length;

  const containerWidth = imagesQuantity * imageWidth;

  // Generate the images and the thumbnails dynamically

  const thumbnails = thumbnailsNames.map((name) => (
    <div className="thumbnailWrapper" id={`${name}ThumbnailWrapper`}>
      <Spinner />
      <div
        className="thumbnail"
        style={{
          width: imageWidth,
          height: 0.7 * windowHeight,
          backgroundImage: `url(${thumbnailsPath(`./${name}.jpg`)})`,
        }}
      />
    </div>
  ));

  const images = imagesNames.map((name, index) => (
    <div className="imageWrapper" key={`${name}Wrapper`} style={{ width: `${imageWidth - 200}px` }}>
      {thumbnails[index]}
      <img
        width={imageWidth}
        src={imagesPath(`./${name}.jpg`)}
        alt={name}
        id={name}
        key={name}
        ref={imgRef}
        className="gallery_image"
      />
    </div>
  ));

  // When the full resolution photo is loaded, unmount the thumbnail
  const setFullSizePhotos = useCallback(
    (event) => {
      const img = event.target;
      const imgID = img.getAttribute('id');
      const thumbnailIndex = thumbnailsNames.indexOf(imgID);

      setThumbnailsNames((arr) => arr.splice(thumbnailIndex, 1));

      img.removeEventListener('load', setFullSizePhotos);
    },
    [thumbnailsNames]
  );

  useEffect(() => {
    if (referencesLoaded) imgRefs.forEach((el) => el.addEventListener('load', setFullSizePhotos));
  }, [imgRefs, referencesLoaded, setFullSizePhotos]);

  return (
    <div className="gallery_slider" ref={ref} style={{ width: containerWidth }}>
      {images}
    </div>
  );
});

export default ImagesContainer;
