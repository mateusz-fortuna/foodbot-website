import React from 'react';
import { Button } from 'react-bootstrap';
import Text from '../Text';

const DiscoverFeaturesButton = (props) => {
  const { clientWidth, style } = props;

  if (clientWidth < 1200) {
    return (
      <Button type="button" variant="outline-dark" className="learnMoreButton link" style={style}>
        <Text category="home" textID="button" />
      </Button>
    );
  }
  return (
    <div>
      <p className="link" style={style}>
        <Text category="home" textID="button" />
      </p>
      <span className="underline" />
    </div>
  );
};

export default DiscoverFeaturesButton;
