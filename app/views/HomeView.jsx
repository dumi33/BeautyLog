"use client";

import { useMemo } from "react";
import {
  RECENT_PROCEDURE,
  NEXT_PROCEDURE_DATE,
  USER_DISPLAY_NAME,
  RECOMMEND_AFTERCARE,
  RECOMMEND_PREP,
  RECOMMEND_RELATED,
} from "@/constants";
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

  const dday = useMemo(() => getDday(RECENT_PROCEDURE.procedureDate), []);
  const daysUntilNext = useMemo(
    () => getDaysUntilNext(NEXT_PROCEDURE_DATE),
    []
  );
  const showNextPrep = useMemo(
    () => NEXT_PROCEDURE_DATE != null && daysUntilNext !== null && daysUntilNext <= 3,
    [daysUntilNext]
  );

  return (
    <>
      <main className="main home-main">
        {/* 상단: D-day → 시술 상세 / 다음 시술까지 → 예약 관리 */}
        <section className="home-summary">
          <div className="home-summary-badges">
            <button
              type="button"
              className="home-summary-badge home-summary-badge-btn"
              onClick={() => onMenuClick("procedure-detail")}
            >
              <span className="home-summary-label">시술 D-day</span>
              <span className="home-summary-value">D+{dday ?? "—"}</span>
            </button>
            <button
              type="button"
              className="home-summary-badge home-summary-badge-btn"
              onClick={() => onMenuClick("appointment-manage")}
            >
              <span className="home-summary-label">다음 시술까지</span>
              <span className="home-summary-value">
                {daysUntilNext !== null ? `${daysUntilNext}일` : "—"}
              </span>
            </button>
          </div>
        </section>

        {/* 중앙: 최근 시술 카드 — 클릭 시 시술 상세 */}
        <section className="home-recent-section">
          <h2 className="home-section-title">최근 시술</h2>
          <article
            className="recent-card recent-card-clickable"
            role="button"
            tabIndex={0}
            onClick={() => onMenuClick("procedure-detail")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onMenuClick("procedure-detail");
              }
            }}
          >
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
              <span className="recent-card-before-after">Before / After 보기</span>
            )}
          </article>
        </section>

        {/* 오늘 기록 추가 — 강조 CTA → 기록 작성 화면 */}
        <section className="home-cta-section">
          <button
            type="button"
            className="home-cta-primary"
            onClick={() => onMenuClick("record-write")}
          >
            오늘 기록 추가
          </button>
        </section>

        {/* 캘린더: 기본 일주일 표시, 한 달 보기 클릭 시 확장 */}
        <section className="home-calendar-section">
          <Calendar />
        </section>

        {/* 시술 기반 맞춤 추천: 최근 시술·예약일 기준 동적 노출 */}
        <section className="home-recommend-section">
          <h2 className="home-recommend-title">{USER_DISPLAY_NAME}님을 위한 맞춤 관리</h2>
          <div className="home-recommend-scroll">
            {/* ① 지금 필요한 관리 — D-day 기반 */}
            <article className="home-recommend-card">
              <span className="home-recommend-tag home-recommend-tag-aftercare">{RECOMMEND_AFTERCARE.tag}</span>
              <h3 className="home-recommend-card-title">{RECOMMEND_AFTERCARE.title}</h3>
              <p className="home-recommend-card-desc">
                {dday != null
                  ? RECOMMEND_AFTERCARE.getCopy(RECENT_PROCEDURE.title, dday)
                  : "최근 시술 기준 추천"}
              </p>
              <p className="home-recommend-card-content">
                {dday != null ? RECOMMEND_AFTERCARE.getContent(dday) : RECOMMEND_AFTERCARE.getContent(3)}
              </p>
            </article>

            {/* ② 다음 시술 준비 — 예약 3일 이내일 때만 */}
            {showNextPrep && (
              <article className="home-recommend-card">
                <span className="home-recommend-tag home-recommend-tag-warning">{RECOMMEND_PREP.tag}</span>
                <h3 className="home-recommend-card-title">{RECOMMEND_PREP.title}</h3>
                <p className="home-recommend-card-desc">{RECOMMEND_PREP.copy}</p>
                <p className="home-recommend-card-content">{RECOMMEND_PREP.content}</p>
              </article>
            )}

            {/* ③ 관련 시술/관리 추천 — 최근 시술 카테고리 기반 */}
            <article className="home-recommend-card">
              <span className="home-recommend-tag home-recommend-tag-guide">{RECOMMEND_RELATED.tag}</span>
              <h3 className="home-recommend-card-title">{RECOMMEND_RELATED.title}</h3>
              <p className="home-recommend-card-desc">
                {RECOMMEND_RELATED.getCopy(RECENT_PROCEDURE.title)}
              </p>
              <p className="home-recommend-card-content">{RECOMMEND_RELATED.content}</p>
            </article>
          </div>
        </section>
      </main>
      <footer className="footer">
        <p>토스인앱 · 뷰티 기록</p>
      </footer>
    </>
  );
}

export default HomeView;
