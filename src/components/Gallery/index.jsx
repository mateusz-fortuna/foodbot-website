import React, { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { LanguageContext } from '../../assets/js/context/languageContext';

import Cursor from '../Cursor/index';
import TransitionOut from '../Transitions/TransitionOut';
import NavigationButton from '../Navigation/NavigationButton/index.tsx';
import ParallaxSlider from '../ParallaxSlider/index.tsx';
import Arrow from '../Navigation/NavigationButton/Arrow/index.tsx';
import './index.sass';

const Gallery = ({ reference, navigationButtons }) => {
  const { featuresNavButton, contactNavButton } = navigationButtons;

  // Get number of the images
  const languageContext = useContext(LanguageContext);
  const { imagesQuantity } = languageContext.dictionary.gallery;

  // Set paths to the images and the thumbnails
  const imagesPath = require.context('../../assets/images/gallery', true);
  const thumbnailsPath = require.context('../../assets/images/gallery/thumbnails', true);

  const generateUrlArray = (path, length) => {
    const arr = [];
    for (let i = 0; i < length; i++) {
      arr.push(path(`./${i + 1}.jpg`));
    }
    return arr;
  };

  const imagesURLs = generateUrlArray(imagesPath, imagesQuantity);
  const thumbnailsURLs = generateUrlArray(thumbnailsPath, imagesQuantity);

  return (
    <Row className="gallery">
      <TransitionOut />
      <Cursor reference={reference} type="solid" color="dark" />
      <Col sm={12}>
        <NavigationButton
          reference={featuresNavButton}
          target="features"
          text="Back to Features"
          className="gallery__navButton gallery__navButton--features"
        >
          <Arrow direction="up" className="gallery__navButton--svg" size={64} />
        </NavigationButton>
        <ParallaxSlider imagesURLs={imagesURLs} thumbnailsURLs={thumbnailsURLs} />
        <NavigationButton
          reference={contactNavButton}
          target="contact"
          text="Go to Contact"
          className="gallery__navButton gallery__navButton--contact"
        >
          <Arrow direction="down" className="gallery__navButton--svg" size={64} />
        </NavigationButton>
      </Col>
    </Row>
  );
};

export default Gallery;
