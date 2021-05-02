import React from 'react';
import { Button } from 'react-bootstrap';
import Text from '../../Text/Text';

const DiscoverFeaturesButton = ({ clientWidth, style, reference, target }) => {
  if (clientWidth < 1200) {
    return (
      <Button
        type="button"
        variant="outline-dark"
        className="learnMoreButton link"
        style={style}
        ref={reference}
        data-target={target}
      >
        <Text category="home" textID="button" />
      </Button>
    );
  }
  return (
    <div>
      <p className="link" style={style} ref={reference} data-target={target}>
        <Text category="home" textID="button" />
      </p>
      <span className="underline" />
    </div>
  );
};

export default DiscoverFeaturesButton;
