'use client'

import { TAB_ITEMS } from "@/constants";

function BottomNav({ activeTab, onTabChange }) {
    const renderIcon = (tab) => {
        // SVG icons for better consistency
        if (tab.id === 'my') {
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            );
        }

        return tab.icon;
    };

    return (
        <nav className="bottom-nav">
            {TAB_ITEMS.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    className={`bottom-nav-item ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    <span className="bottom-nav-icon">{renderIcon(tab)}</span>
                    <span className="bottom-nav-label">{tab.label}</span>
                </button>
            ))}
        </nav>
    );
}

export default BottomNav;
