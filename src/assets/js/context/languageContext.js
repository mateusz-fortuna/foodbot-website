import react, { useState } from 'react';
import { languageOptions, dictionaryList } from '../dictionaryList';

export const LanguageContext = createContext( {
  userLanguage: 'en',
  dictionary: dictionaryList.en
} );

export const LanguageProvider = ( { children } ) => {
  const [ userLanguage, setUserLanguage ] = useState( 'en' );

  const provider = {
    userLanguage,
    dictionary: dictionaryList[ userLanguage ],
    userLanguageChange: selected => {
      const newLanguage = languageOptions[ selected ] ? selected : 'en';
      setUserLanguage( newLanguage );
      window.localStorage.setItem( 'rcm-lang', newLanguage );
    }
  };

  return(
    <LanguageContext.Provider value={ provider }>
      { children }
    </LanguageContext.Provider>
  );
};