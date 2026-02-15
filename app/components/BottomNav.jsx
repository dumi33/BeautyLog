'use client'

import { TAB_ITEMS } from "@/constants";

function BottomNav({ activeTab, onTabChange }) {
    return (
        <nav className="bottom-nav">
            {TAB_ITEMS.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    className={`bottom-nav-item ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    <span className="bottom-nav-icon">{tab.icon}</span>
                    <span className="bottom-nav-label">{tab.label}</span>
                </button>
            ))}
        </nav>
    );
}

export default BottomNav;
