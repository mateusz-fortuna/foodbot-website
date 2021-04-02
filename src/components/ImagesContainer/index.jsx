import React, { useState, useEffect, useContext, useRef } from 'react';
import { LanguageContext } from '../../assets/js/context/languageContext';
import './index.sass';

const ImagesContainer = () => {
  const languageContext = useContext(LanguageContext);
  const { imagesNames } = languageContext.dictionary.gallery;

  const [images, setImages] = useState([]);
  const imagesRefs = useRef([]);

  const imagesPath = require.context('../../assets/images/gallery', true);
  const thumbnailsPath = require.context('../../assets/images/gallery/thumbnails', true);

  const initImages = () => {
    imagesNames.map((name, index) => {
      const image = (
        <div className="imageWrapper" key={`${name}Wrapper`}>
          <img
            width={1920}
            src={thumbnailsPath(`./${name}.jpg`)}
            data-src={imagesPath(`./${name}.jpg`)}
            alt={name}
            key={name}
            ref={(el) => {
              imagesRefs.current[index] = el;
            }}
            className="galleryImage thumbnail"
          />
        </div>
      );
      return setImages((imagesArr) => [...imagesArr, image]);
    });
  };

  const loadFullSizePhotos = () => {
    imagesRefs.current.map((node) => {
      node.setAttribute('src', node.getAttribute('data-src'));
      node.removeAttribute('data-src');
      return node.classList.remove('thumbnail');
    });
  };

  useEffect(() => {
    initImages();
    window.addEventListener('load', loadFullSizePhotos);

    return () => {
      window.removeEventListener('load', loadFullSizePhotos);
    };
  }, []);

  return <div className="imagesContainer">{images}</div>;
};

export default ImagesContainer;
