import React, { useContext } from 'react';
import { LanguageContext } from '../../../assets/js/context/languageContext';

const MultiLinesText = (props) => {
  const { category, textID } = props;
  const languageContext = useContext(LanguageContext);

  return (
    languageContext.dictionary[category][textID].split('\n').map((item, index) => (
      <span className="d-block" key={index}>
        {' '}
        {item}{' '}
      </span>
    )) || languageContext.dictionary[category][textID]
  );
};

export default MultiLinesText;
