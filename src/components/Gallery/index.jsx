import React, { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import Cursor from '../Cursor';
import TransitionOut from '../Transitions/TransitionOut';
import { NavigationButton } from '../Navigation/NavigationButton/index.tsx';
import ParallaxSlider from '../ParallaxSlider/index.tsx';
import { LanguageContext } from '../../assets/js/context/languageContext';
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
          className="gallery__navButton gallery__navButton--features"
          reference={featuresNavButton}
          target="features"
        >
          Back to Features
        </NavigationButton>
        <ParallaxSlider imagesURLs={imagesURLs} thumbnailsURLs={thumbnailsURLs} />
        <NavigationButton
          className="gallery__navButton gallery__navButton--contact"
          reference={contactNavButton}
          target="contact"
        >
          Go to Contact
        </NavigationButton>
      </Col>
    </Row>
  );
};

export default Gallery;
