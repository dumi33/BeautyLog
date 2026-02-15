'use client'

import { useState, useEffect } from 'react';

function TopBar() {
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
        <header className="top-bar">
            <div className="top-bar-brand">
                <span className="top-bar-logo-icon" aria-hidden>
                    <svg
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M16 6v16M16 10c-5-2-10 0-10 6s2 8 10 8 10-2 10-8-5-8-10-6"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />
                        <path
                            d="M16 10c5-2 10 0 10 6s-2 8-10 8-10-2-10-8 5-8 10-6"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />
                    </svg>
                </span>
                <h1 className="top-bar-logo">뷰티로그</h1>
            </div>
            <button
                type="button"
                className="dark-mode-toggle"
                onClick={toggleDarkMode}
                aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
            >
                {isDark ? '☀️' : '🌙'}
            </button>
        </header>
    );
}

export default TopBar;
