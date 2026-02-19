"use client";

import styles from './HomeView.module.css';
import { useMemo } from "react";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();

  const handleRecordAdd = () => {
    if (!session) {
      alert("로그인 후 이용 가능한 서비스입니다. 'MY' 탭에서 로그인을 진행해 주세요!");
      return;
    }
    onMenuClick("record-write");
  };

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
      <main className={`${styles.homeMain}`}>
        {/* 상단: D-day → 시술 상세 / 다음 시술까지 → 예약 관리 */}
        <section className={styles.homeSummary}>
          <div className={styles.homeSummaryBadges}>
            <button
              type="button"
              className={`${styles.homeSummaryBadge} ${styles.homeSummaryBadgeBtn}`}
              onClick={() => onMenuClick("procedure-detail")}
            >
              <span className={styles.homeSummaryLabel}>시술 D-day</span>
              <span className={styles.homeSummaryValue}>D+{dday ?? "—"}</span>
            </button>
            <button
              type="button"
              className={`${styles.homeSummaryBadge} ${styles.homeSummaryBadgeBtn}`}
              onClick={() => onMenuClick("appointment-manage")}
            >
              <span className={styles.homeSummaryLabel}>다음 시술까지</span>
              <span className={styles.homeSummaryValue}>
                {daysUntilNext !== null ? `${daysUntilNext}일` : "—"}
              </span>
            </button>
          </div>
        </section>

        {/* 중앙: 최근 시술 카드 — 클릭 시 시술 상세 */}
        <section className={styles.homeRecentSection}>
          <h2 className={styles.homeSectionTitle}>최근 시술</h2>
          <article
            className={`${styles.recentCard} ${styles.recentCardClickable}`}
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
            <div className={styles.recentCardHeader}>
              <span className={styles.recentCardTitle}>
                {RECENT_PROCEDURE.title}
              </span>
              <span className={styles.recentCardDday}>D+{dday ?? "—"}</span>
            </div>
            <div className={styles.recentCardMeta}>
              <span className={styles.recentCardHospital}>
                {RECENT_PROCEDURE.hospital}
              </span>
              <span className={styles.recentCardDate}>
                {RECENT_PROCEDURE.procedureDate}
              </span>
            </div>
            <div className={styles.recentCardRecovery}>
              <span className={styles.recentCardRecoveryLabel}>회복 상태</span>
              <span className={styles.recentCardRecoveryValue}>
                {RECENT_PROCEDURE.recoveryState}
              </span>
            </div>
            {RECENT_PROCEDURE.hasBeforeAfter && (
              <span className={styles.recentCardBeforeAfter}>
                Before / After 보기 <span className={styles.ctaArrow}>→</span>
              </span>
            )}
          </article>
        </section>

        {/* 오늘 기록 추가 — 강조 CTA → 기록 작성 화면 */}
        <section className={styles.homeCtaSection}>
          <button
            type="button"
            className={styles.homeCtaPrimary}
            onClick={handleRecordAdd}
          >
            기록 추가 <span className={styles.ctaArrow}>→</span>
          </button>
        </section>

        {/* 캘린더: 기본 일주일 표시, 한 달 보기 클릭 시 확장 */}
        <section className={styles.homeCalendarSection}>
          <Calendar />
        </section>

        {/* 시술 기반 맞춤 추천: 최근 시술·예약일 기준 동적 노출 */}
        <section className={styles.homeRecommendSection}>
          <h2 className={styles.homeRecommendTitle}>
            {session?.user?.name ? session.user.name.slice(1) : USER_DISPLAY_NAME}님을 위한 맞춤 관리
          </h2>
          <div className={styles.homeRecommendScroll}>
            {/* ① 지금 필요한 관리 — D-day 기반 */}
            <article className={styles.homeRecommendCard}>
              <span className={`${styles.homeRecommendTag} ${styles.homeRecommendTagAftercare}`}>{RECOMMEND_AFTERCARE.tag}</span>
              <h3 className={styles.homeRecommendCardTitle}>{RECOMMEND_AFTERCARE.title}</h3>
              <p className={styles.homeRecommendCardDesc}>
                {dday != null
                  ? RECOMMEND_AFTERCARE.getCopy(RECENT_PROCEDURE.title, dday)
                  : "최근 시술 기준 추천"}
              </p>
              <p className={styles.homeRecommendCardContent}>
                {dday != null ? RECOMMEND_AFTERCARE.getContent(dday) : RECOMMEND_AFTERCARE.getContent(3)}
              </p>
            </article>

            {/* ② 다음 시술 준비 — 예약 3일 이내일 때만 */}
            {showNextPrep && (
              <article className={styles.homeRecommendCard}>
                <span className={`${styles.homeRecommendTag} ${styles.homeRecommendTagWarning}`}>{RECOMMEND_PREP.tag}</span>
                <h3 className={styles.homeRecommendCardTitle}>{RECOMMEND_PREP.title}</h3>
                <p className={styles.homeRecommendCardDesc}>{RECOMMEND_PREP.copy}</p>
                <p className={styles.homeRecommendCardContent}>{RECOMMEND_PREP.content}</p>
              </article>
            )}

            {/* ③ 관련 시술/관리 추천 — 최근 시술 카테고리 기반 */}
            <article className={styles.homeRecommendCard}>
              <span className={`${styles.homeRecommendTag} ${styles.homeRecommendTagGuide}`}>{RECOMMEND_RELATED.tag}</span>
              <h3 className={styles.homeRecommendCardTitle}>{RECOMMEND_RELATED.title}</h3>
              <p className={styles.homeRecommendCardDesc}>
                {RECOMMEND_RELATED.getCopy(RECENT_PROCEDURE.title)}
              </p>
              <p className={styles.homeRecommendCardContent}>{RECOMMEND_RELATED.content}</p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}

export default HomeView;
