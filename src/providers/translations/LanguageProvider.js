import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const previousLanguage = localStorage.getItem("messenger_language");

    const supportedLanguages = ["en", "de", "ua"];
    const currentLanguage = previousLanguage && supportedLanguages.includes(previousLanguage) ?
        previousLanguage :
        "en"

    const [language, setLanguage] = useState(currentLanguage);

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem("messenger_language", lang);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
