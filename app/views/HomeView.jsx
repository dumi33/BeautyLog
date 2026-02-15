"use client";

import { useState, useMemo } from "react";
import { MENU_ITEMS, RECENT_PROCEDURE, NEXT_PROCEDURE_DATE } from "@/constants";
import Calendar from "@/components/Calendar";

function getDday(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split(".").map(Number);
  const procedure = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  procedure.setHours(0, 0, 0, 0);
  return Math.floor((today - procedure) / (24 * 60 * 60 * 1000));
}

function getDaysUntilNext(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split(".").map(Number);
  const next = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  next.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((next - today) / (24 * 60 * 60 * 1000)));
}

function HomeView({ onMenuClick }) {
  const [hovered, setHovered] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const dday = useMemo(() => getDday(RECENT_PROCEDURE.procedureDate), []);
  const daysUntilNext = useMemo(
    () => getDaysUntilNext(NEXT_PROCEDURE_DATE),
    []
  );

  return (
    <>
      <main className="main home-main">
        {/* 상단: D-day, 다음 시술까지 — 눈에 띄게 */}
        <section className="home-summary">
          <div className="home-summary-badges">
            <div className="home-summary-badge">
              <span className="home-summary-label">시술 D-day</span>
              <span className="home-summary-value">D+{dday ?? "—"}</span>
            </div>
            <div className="home-summary-badge">
              <span className="home-summary-label">다음 시술까지</span>
              <span className="home-summary-value">
                {daysUntilNext !== null ? `${daysUntilNext}일` : "—"}
              </span>
            </div>
          </div>
        </section>

        {/* 중앙: 최근 시술 카드 */}
        <section className="home-recent-section">
          <h2 className="home-section-title">최근 시술</h2>
          <article className="recent-card">
            <div className="recent-card-header">
              <span className="recent-card-title">
                {RECENT_PROCEDURE.title}
              </span>
              <span className="recent-card-dday">D+{dday ?? "—"}</span>
            </div>
            <div className="recent-card-meta">
              <span className="recent-card-hospital">
                {RECENT_PROCEDURE.hospital}
              </span>
              <span className="recent-card-date">
                {RECENT_PROCEDURE.procedureDate}
              </span>
            </div>
            <div className="recent-card-recovery">
              <span className="recent-card-recovery-label">회복 상태</span>
              <span className="recent-card-recovery-value">
                {RECENT_PROCEDURE.recoveryState}
              </span>
            </div>
            {RECENT_PROCEDURE.hasBeforeAfter && (
              <button type="button" className="recent-card-before-after">
                Before / After 보기
              </button>
            )}
          </article>
        </section>

        {/* 오늘 기록 추가 — 강조 CTA */}
        <section className="home-cta-section">
          <button
            type="button"
            className="home-cta-primary"
            onClick={() => onMenuClick("derma")}
          >
            오늘 기록 추가
          </button>
        </section>

        {/* 캘린더: 보조 영역, 접기/펼치기 */}
        <section className="home-calendar-section">
          <button
            type="button"
            className="home-calendar-toggle"
            onClick={() => setCalendarOpen((v) => !v)}
            aria-expanded={calendarOpen}
          >
            <span>캘린더</span>
            <span className="home-calendar-toggle-icon">
              {calendarOpen ? "▼" : "▶"}
            </span>
          </button>
          {calendarOpen && (
            <div className="home-calendar-wrap">
              <Calendar />
            </div>
          )}
        </section>

        {/* 기존 메뉴 진입 (피부과 기록 등) */}
        <p className="main-desc">더 보기</p>
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
        <p>토스인앱 · 뷰티 기록</p>
      </footer>
    </>
  );
}

export default HomeView;
