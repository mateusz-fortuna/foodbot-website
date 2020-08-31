import { useContext } from 'react';
import { LanguageContext } from '../../assets/js/context/languageContext';

const Text = props => {
    const { category, textID } = props;
    const languageContext = useContext( LanguageContext );

    return languageContext.dictionary[ category ][ textID ] || textID;
};

export default Text;
