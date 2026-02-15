"use client";

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
        <div className="procedure-detail-screen">
            <header className="list-header">
                <button type="button" className="back-btn" onClick={onBack} aria-label="뒤로 가기">
                    ‹
                </button>
                <h1 className="list-title">시술 상세</h1>
            </header>

            <main className="procedure-detail-main">
                {/* 1. 시술 정보 카드 */}
                <section className="procedure-detail-card">
                    <h2 className="procedure-detail-card-title">시술 정보</h2>
                    <div className="procedure-detail-info">
                        <div className="procedure-detail-info-row">
                            <span className="procedure-detail-info-label">시술 이름</span>
                            <span className="procedure-detail-info-value">{procedure.title}</span>
                        </div>
                        <div className="procedure-detail-info-row">
                            <span className="procedure-detail-info-label">병원</span>
                            <span className="procedure-detail-info-value">{procedure.hospital}</span>
                        </div>
                        <div className="procedure-detail-info-row">
                            <span className="procedure-detail-info-label">시술일</span>
                            <span className="procedure-detail-info-value">{procedure.procedureDate}</span>
                        </div>
                        <div className="procedure-detail-info-row procedure-detail-dday-row">
                            <span className="procedure-detail-info-label">경과</span>
                            <span className="procedure-detail-info-value procedure-detail-dday">D+{dday ?? "—"}</span>
                        </div>
                    </div>
                </section>

                {/* 2. 회복 상태 변경 */}
                <section className="procedure-detail-card">
                    <h2 className="procedure-detail-card-title">회복 상태</h2>
                    <div className="procedure-detail-recovery-btns">
                        {RECOVERY_STATE_OPTIONS.map((opt) => (
                            <button
                                key={opt.id}
                                type="button"
                                className={`procedure-detail-recovery-btn ${recoveryState === opt.label ? "active" : ""}`}
                                onClick={() => handleRecoveryChange(opt.label)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 3. 다음 예약 정보 */}
                <section className="procedure-detail-card">
                    <h2 className="procedure-detail-card-title">다음 예약</h2>
                    <div className="procedure-detail-next">
                        <span className="procedure-detail-next-date">
                            {nextDate ? nextDate : "예약 없음"}
                        </span>
                        <button
                            type="button"
                            className="procedure-detail-next-edit"
                            onClick={handleEditNextAppointment}
                        >
                            예약 수정
                        </button>
                    </div>
                </section>

                {/* 4. 전체 기록 타임라인 */}
                <section className="procedure-detail-card">
                    <h2 className="procedure-detail-card-title">기록 타임라인</h2>
                    <ul className="procedure-detail-timeline">
                        {PROCEDURE_TIMELINE_SAMPLE.map((entry) => (
                            <li key={entry.dday} className="procedure-detail-timeline-item">
                                <span className="procedure-detail-timeline-dday">D+{entry.dday}</span>
                                <span className="procedure-detail-timeline-date">{entry.date}</span>
                                <p className="procedure-detail-timeline-summary">{entry.summary}</p>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* 5. Before / After */}
                {procedure.hasBeforeAfter && (
                    <section className="procedure-detail-card">
                        <h2 className="procedure-detail-card-title">Before / After</h2>
                        <div className="procedure-detail-before-after">
                            <div className="procedure-detail-ba-col">
                                <span className="procedure-detail-ba-label">Before</span>
                                <div className="procedure-detail-ba-placeholder" />
                            </div>
                            <div className="procedure-detail-ba-col">
                                <span className="procedure-detail-ba-label">After</span>
                                <div className="procedure-detail-ba-placeholder" />
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

export default ProcedureDetailView;
