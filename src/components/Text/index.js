import { useContext } from 'react';
import { LanguageContext } from '../../assets/js/context/languageContext';

const Text = ({ category, textID }) => {
  const languageContext = useContext(LanguageContext);
  return languageContext.dictionary[category][textID] || textID;
};

export default Text;
