import React, { useState, useEffect, useContext, useCallback } from 'react';
import { LanguageContext } from '../../assets/js/context/languageContext';
import './index.sass';

const ImagesContainer = React.forwardRef((props, ref) => {
  const { windowWidth } = props;

  const [imagesLoaded, setImagesLoaded] = useState(0);

  // Get names of all images in gallery
  const languageContext = useContext(LanguageContext);
  const { imagesNames } = languageContext.dictionary.gallery;

  // Set paths to those images
  const imagesPath = require.context('../../assets/images/gallery', true);
  const thumbnailsPath = require.context('../../assets/images/gallery/thumbnails', true);

  // Store references to <img> elements
  const [imgRefs, setImgRefs] = useState([]);
  const imgRef = useCallback((imgNode) => setImgRefs((oldArray) => [...oldArray, imgNode]), []);

  // Generate the images with their wrapper dynamically
  // Load the thumbnails by default
  const images = imagesNames.map((name) => (
    <div className="imageWrapper" key={`${name}Wrapper`}>
      <img
        width={windowWidth}
        src={thumbnailsPath(`./${name}.jpg`)}
        data-src={imagesPath(`./${name}.jpg`)}
        alt={name}
        key={name}
        ref={imgRef}
        className="gallery_image thumbnail"
      />
    </div>
  ));

  // When the full resolution photos are loaded, replace them with the thumbnails
  const setFullSizePhotos = (event) => {
    const el = event.target;
    el.setAttribute('src', el.getAttribute('data-src'));
    el.removeAttribute('data-src');
    el.classList.remove('thumbnail');

    setImagesLoaded((val) => val + 1);
  };

  useEffect(() => {
    const preventRenderOverflow = imagesLoaded !== imagesNames.length;
    const runWithAllReferences = imgRefs.length === imagesNames.length;

    if (preventRenderOverflow && runWithAllReferences) {
      imgRefs.forEach((el) => el.addEventListener('load', setFullSizePhotos));
    }
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
