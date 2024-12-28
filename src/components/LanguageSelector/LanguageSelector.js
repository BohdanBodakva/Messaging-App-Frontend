import React, { useEffect, useRef, useState } from "react";
import "./LanguageSelector.css";

const LanguageSelector = ({ currentLanguageKey, onLanguageChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAbove, setIsAbove] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { name: "English", key: "en" },
        { name: "Українська", key: "ua" },
    ];

    const currentLanguage = languages.find((l) => l.key === currentLanguageKey);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleLanguageChange = (lang) => {
        onLanguageChange(lang);
        setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen && dropdownRef.current) {
            const { bottom, top, height } = dropdownRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            setIsAbove(bottom + height > viewportHeight);
        }
    }, [isOpen]);

    return (
        <div className="dropdown-container" ref={dropdownRef}>
            <button className="dropdown-button" onClick={toggleDropdown}>
                <span className="hidden-chevron"/>
                <p>{currentLanguage.name}</p>
                <span className={`chevron ${isOpen ? "open" : ""}`}/>
            </button>
            {isOpen && (
                <ul className={`dropdown-menu ${isAbove ? "drop-up" : "drop-down"}`}>
                    {languages.map((lang) => (
                        <li
                            key={lang.key}
                            className="dropdown-item"
                            onClick={() => handleLanguageChange(lang.key)}
                        >
                            {lang.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LanguageSelector;
