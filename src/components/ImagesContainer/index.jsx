import React, { useState, useEffect, useContext, useCallback } from 'react';
import { LanguageContext } from '../../assets/js/context/languageContext';
import Spinner from '../Spinner';
import './index.sass';

const ImagesContainer = React.forwardRef(({ windowWidth, windowHeight }, ref) => {
  // Get names of all images in gallery
  const languageContext = useContext(LanguageContext);
  const { imagesNames } = languageContext.dictionary.gallery;
  const [thumbnailsNames, setThumbnailsNames] = useState(imagesNames);

  // Set paths to those images
  const imagesPath = require.context('../../assets/images/gallery', true);
  const thumbnailsPath = require.context('../../assets/images/gallery/thumbnails', true);

  // Store references to <img> elements
  const [imgRefs, setImgRefs] = useState([]);
  const imgRef = useCallback((imgNode) => setImgRefs((refs) => [...refs, imgNode]), []);

  // Generate the images and the thumbnails dynamically

  const thumbnails = thumbnailsNames.map((name) => (
    <div className="thumbnailWrapper" id={`${name}ThumbnailWrapper`}>
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
  ));

  const images = imagesNames.map((name, index) => (
    <div className="imageWrapper" key={`${name}Wrapper`}>
      {thumbnails[index]}
      <img
        height={windowHeight}
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
  const setFullSizePhotos = (event) => {
    const img = event.target;
    const imgID = img.getAttribute('id');
    const index = thumbnailsNames.indexOf(imgID);

    setThumbnailsNames((arr) => arr.splice(index, 1));

    img.removeEventListener('load', setFullSizePhotos);
  };

  useEffect(() => {
    const referencesLoaded = imgRefs.length === imagesNames.length;

    if (referencesLoaded) imgRefs.forEach((el) => el.addEventListener('load', setFullSizePhotos));
  });

  return (
    <div className="gallery_slider" ref={ref}>
      {images}
    </div>
  );
});

export default ImagesContainer;
