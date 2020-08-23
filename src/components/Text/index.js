import { useContext } from 'react';
import { LanguageContext } from '../../assets/js/context/languageContext';

const Text = ( { textID } ) => {
    const languageContext = useContext( LanguageContext );

    return languageContext.dictionary[ textID ] || textID;
};

export default Text;
