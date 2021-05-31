import { useContext } from 'react';
import { LanguageContext } from '../../../assets/js/context/languageContext';

const Text = ({ category, index = 0, textID }) => {
  const languageContext = useContext(LanguageContext);
  return languageContext.dictionary[category][index][textID] || textID;
};

export default Text;
