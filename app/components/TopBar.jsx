'use client'

import { useState, useEffect } from 'react';
import styles from './TopBar.module.css';

function TopBar({ onLogoClick }) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = savedTheme === 'dark';
        setIsDark(prefersDark);
        if (prefersDark) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        if (newIsDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <header className={styles.topBar}>
            <div
                className={styles.topBarBrand}
                onClick={onLogoClick}
                role="button"
                tabIndex={0}
                aria-label="홈으로 이동"
            >
                {/* Logo remains centered */}
                <span className={styles.topBarLogoIcon} aria-hidden>
                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 6v16M16 10c-5-2-10 0-10 6s2 8 10 8 10-2 10-8-5-8-10-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
                    </svg>
                </span>
            </div>

            <div className={styles.headerRight}>
                <button
                    type="button"
                    className={styles.darkModeToggle}
                    onClick={toggleDarkMode}
                    aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
                >
                    {isDark ? '☀️' : '🌙'}
                </button>
            </div>
        </header>
    );
}

export default TopBar;
