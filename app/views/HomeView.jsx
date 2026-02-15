'use client'

import { useState } from "react";
import { MENU_ITEMS } from "@/constants";
import Calendar from "@/components/Calendar";

function HomeView({ onMenuClick }) {
    const [hovered, setHovered] = useState(null);

    return (
        <>
            <main className="main home-main">
                <Calendar />
                <p className="main-desc">오늘은 어떤 기록을 남길까요?</p>
                <ul className="menu-list">
                    {MENU_ITEMS.map((item) => (
                        <li key={item.id}>
                            <button
                                className={`menu-card ${hovered === item.id ? "hover" : ""}`}
                                style={{
                                    "--card-gradient": item.gradient,
                                    "--card-accent": item.accent,
                                }}
                                onMouseEnter={() => setHovered(item.id)}
                                onMouseLeave={() => setHovered(null)}
                                onClick={() => onMenuClick(item.id)}
                            >
                                <span
                                    className="menu-icon"
                                    style={{ background: item.gradient }}
                                >
                                    {item.icon}
                                </span>
                                <div className="menu-text">
                                    <span className="menu-title">{item.title}</span>
                                    <span className="menu-desc">{item.description}</span>
                                </div>
                                <span className="menu-arrow">→</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </main>
            <footer className="footer">
                <p>토스인앱 · 여성을 위한 뷰티 기록</p>
            </footer>
        </>
    );
}

export default HomeView;
