'use client'

import styles from './BottomNav.module.css';
import { TAB_ITEMS } from "@/constants";

function BottomNav({ activeTab, onTabChange }) {
    const renderIcon = (tab) => {
        const isActive = activeTab === tab.id;
        const color = isActive ? 'var(--point)' : 'currentColor';
        const strokeWidth = isActive ? 2 : 1.5;

        if (tab.id === 'home') {
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            );
        }
        if (tab.id === 'record') {
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                </svg>
            );
        }
        if (tab.id === 'my') {
            return (
                <div className={styles.iconContainerWithBadge}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className={styles.notificationBadge} />
                </div>
            );
        }
        return tab.icon;
    };

    return (
        <nav className={styles.bottomNav}>
            {TAB_ITEMS.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    className={`${styles.bottomNavItem} ${activeTab === tab.id ? styles.active : ""}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    <span className={styles.bottomNavIcon}>{renderIcon(tab)}</span>
                    <span className={styles.bottomNavLabel}>{tab.label}</span>
                </button>
            ))}
        </nav>
    );
}

export default BottomNav;
