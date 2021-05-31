import React, { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { LanguageContext } from '../../assets/js/context/languageContext';
import Cursor from '../Cursor/index';
import TransitionOut from '../Transitions/TransitionOut';
import ParallaxSlider from '../ParallaxSlider/index.tsx';
import './index.sass';

const Gallery = ({ reference, navigationButtons }) => {
  // Get number of the images
  const languageContext = useContext(LanguageContext);
  const { imagesQuantity } = languageContext.dictionary.gallery[0];

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
        <ParallaxSlider
          imagesURLs={imagesURLs}
          thumbnailsURLs={thumbnailsURLs}
          navigationButtons={navigationButtons}
        />
      </Col>
    </Row>
  );
};

export default Gallery;
