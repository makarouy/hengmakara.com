'use client';
import React, { useState, useEffect } from 'react';
import { RiSunLine, RiMoonLine } from '@remixicon/react';

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Check local storage or system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            setIsDark(false);
            document.body.classList.add('light-mode');
        } else {
            setIsDark(true);
            document.body.classList.remove('light-mode');
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            // Switch to Light
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            // Switch to Dark
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    return (
        <button 
            onClick={toggleTheme} 
            className="theme-btn-toggle"
            aria-label="Toggle Dark/Light Mode"
            style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: '50%',
                width: '45px',
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--heading-color)',
                cursor: 'pointer',
                marginLeft: '15px',
                transition: 'all 0.3s ease'
            }}
        >
            {isDark ? <RiSunLine size={20} /> : <RiMoonLine size={20} />}
        </button>
    );
};

export default ThemeToggle;
