'use client';

import styles from './ProcedureDetailView.module.css';
import { useState, useMemo } from "react";
import {
    RECENT_PROCEDURE,
    NEXT_PROCEDURE_DATE,
    PROCEDURE_TIMELINE_SAMPLE,
    RECOVERY_STATE_OPTIONS,
} from "@/constants";

function getDday(dateStr) {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split(".").map(Number);
    const start = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    return Math.floor((today - start) / (24 * 60 * 60 * 1000));
}

function ProcedureDetailView({ procedure = RECENT_PROCEDURE, onBack }) {
    const [recoveryState, setRecoveryState] = useState(procedure.recoveryState || "회복 중");
    const [nextDate, setNextDate] = useState(NEXT_PROCEDURE_DATE);

    const dday = useMemo(() => getDday(procedure.procedureDate), [procedure.procedureDate]);

    const handleRecoveryChange = (label) => {
        setRecoveryState(label);
    };

    const handleEditNextAppointment = () => {
        const input = prompt("다음 예약일 (YYYY.MM.DD)", nextDate || "");
        if (input !== null && input.trim()) setNextDate(input.trim());
    };

    return (
        <div className={styles.procedureDetailScreen}>
            <header className="list-header">
                <button type="button" className="back-btn" onClick={onBack} aria-label="뒤로 가기">
                    ‹
                </button>
                <h1 className="list-title">시술 상세</h1>
            </header>

            <main className={styles.procedureDetailMain}>
                {/* 1. 시술 정보 카드 */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>시술 정보</h2>
                    <div className={styles.infoList}>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>시술 이름</span>
                            <span className={styles.infoValue}>{procedure.title}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>병원</span>
                            <span className={styles.infoValue}>{procedure.hospital}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>시술일</span>
                            <span className={styles.infoValue}>{procedure.procedureDate}</span>
                        </div>
                        <div className={`${styles.infoRow} ${styles.ddayRow}`}>
                            <span className={styles.infoLabel}>경과</span>
                            <span className={`${styles.infoValue} ${styles.ddayValue}`}>D+{dday ?? "—"}</span>
                        </div>
                    </div>
                </section>

                {/* 2. 회복 상태 변경 */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>회복 상태</h2>
                    <div className={styles.recoveryBtns}>
                        {RECOVERY_STATE_OPTIONS.map((opt) => (
                            <button
                                key={opt.id}
                                type="button"
                                className={`${styles.recoveryBtn} ${recoveryState === opt.label ? styles.active : ""}`}
                                onClick={() => handleRecoveryChange(opt.label)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 3. 다음 예약 정보 */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>다음 예약</h2>
                    <div className={styles.nextArea}>
                        <span className={styles.nextDate}>
                            {nextDate ? nextDate : "예약 없음"}
                        </span>
                        <button
                            type="button"
                            className={styles.nextEditBtn}
                            onClick={handleEditNextAppointment}
                        >
                            예약 수정
                        </button>
                    </div>
                </section>

                {/* 4. 전체 기록 타임라인 */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>기록 타임라인</h2>
                    <ul className={styles.timeline}>
                        {PROCEDURE_TIMELINE_SAMPLE.map((entry) => (
                            <li key={entry.dday} className={styles.timelineItem}>
                                <span className={styles.timelineDday}>D+{entry.dday}</span>
                                <span className={styles.timelineDate}>{entry.date}</span>
                                <p className={styles.timelineSummary}>{entry.summary}</p>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* 5. Before / After */}
                {procedure.hasBeforeAfter && (
                    <section className={styles.card}>
                        <h2 className={styles.cardTitle}>Before / After</h2>
                        <div className={styles.beforeAfter}>
                            <div className={styles.baCol}>
                                <span className={styles.baLabel}>Before</span>
                                <div className={styles.baPlaceholder} />
                            </div>
                            <div className={styles.baCol}>
                                <span className={styles.baLabel}>After</span>
                                <div className={styles.baPlaceholder} />
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

export default ProcedureDetailView;
