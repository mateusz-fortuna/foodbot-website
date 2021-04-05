import React, { useState, useEffect, useContext, useCallback } from 'react';
import { LanguageContext } from '../../assets/js/context/languageContext';
import Spinner from '../Spinner';
import './index.sass';

const ImagesContainer = React.forwardRef(({ windowWidth, windowHeight }, ref) => {
  // Get names of all images in gallery
  const languageContext = useContext(LanguageContext);
  const { imagesNames } = languageContext.dictionary.gallery;

  // Set paths to those images
  const imagesPath = require.context('../../assets/images/gallery', true);
  const thumbnailsPath = require.context('../../assets/images/gallery/thumbnails', true);

  // Store references to <img> elements
  const [imgRefs, setImgRefs] = useState([]);
  const imgRef = useCallback((imgNode) => setImgRefs((refs) => [...refs, imgNode]), []);

  const [thumbnailsRefs, setThumbnailsRefs] = useState([]);
  const thumbnailRef = useCallback((node) => setThumbnailsRefs((refs) => [...refs, node]), []);

  // Generate the images with their wrapper dynamically
  // Load the thumbnails by default
  const images = imagesNames.map((name) => (
    <div className="imageWrapper" key={`${name}Wrapper`}>
      <div className="thumbnailWrapper" id={`${name}ThumbnailWrapper`} ref={thumbnailRef}>
        <Spinner />
        <div
          className="thumbnail"
          style={{
            width: windowWidth,
            height: windowHeight,
            backgroundImage: `url(${thumbnailsPath(`./${name}.jpg`)})`,
          }}
        />
      </div>
      <img
        width={windowWidth}
        src={imagesPath(`./${name}.jpg`)}
        alt={name}
        id={name}
        key={name}
        ref={imgRef}
        className="gallery_image"
      />
    </div>
  ));

  // When the full resolution photos are loaded, replace them with the thumbnails
  const setFullSizePhotos = (event) => {
    const img = event.target;
    const imgID = img.getAttribute('id');

    const thumbnailIndex = thumbnailsRefs.findIndex(
      (thumbnail) => thumbnail.getAttribute('id') === `${imgID}ThumbnailWrapper`
    );
    const thumbnail = thumbnailsRefs[thumbnailIndex];

    thumbnail.parentNode.removeChild(thumbnail);
  };

  useEffect(() => {
    const referencesLoaded = imgRefs.length === imagesNames.length;

    if (referencesLoaded) imgRefs.forEach((el) => el.addEventListener('load', setFullSizePhotos));
    return () => {
      imgRefs.forEach((el) => el.removeEventListener('load', setFullSizePhotos));
    };
  });

  return (
    <div className="gallery_slider" ref={ref}>
      {images}
    </div>
  );
});

export default ImagesContainer;
