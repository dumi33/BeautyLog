"use client";

import { useState, useMemo } from "react";
import {
    NEXT_PROCEDURE_DATE,
    CYCLE_OPTIONS,
    APPOINTMENT_HISTORY_SAMPLE,
} from "@/constants";

function toInputDate(str) {
    if (!str) return "";
    const [y, m, d] = str.split(".").map(Number);
    return [y, String(m).padStart(2, "0"), String(d).padStart(2, "0")].join("-");
}

function toDisplayDate(str) {
    if (!str) return "";
    const [y, m, d] = str.split(/[-.]/).map((x) => parseInt(x, 10));
    return `${y}.${String(m).padStart(2, "0")}.${String(d).padStart(2, "0")}`;
}

function getDaysUntil(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split(/[-.]/).map((x) => parseInt(x, 10));
    const next = new Date(parts[0], parts[1] - 1, parts[2]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    next.setHours(0, 0, 0, 0);
    return Math.max(0, Math.floor((next - today) / (24 * 60 * 60 * 1000)));
}

function AppointmentManageView({ onBack }) {
    const [nextDate, setNextDate] = useState(
        NEXT_PROCEDURE_DATE ? toInputDate(NEXT_PROCEDURE_DATE) : ""
    );
    const [cycleWeeks, setCycleWeeks] = useState(4);
    const [customWeeks, setCustomWeeks] = useState("");
    const [notifyOn, setNotifyOn] = useState(true);

    const daysUntil = useMemo(() => {
        if (!nextDate) return null;
        return getDaysUntil(nextDate.replace(/-/g, "."));
    }, [nextDate]);

    const handleCycleSelect = (weeks) => {
        setCycleWeeks(weeks);
        setCustomWeeks("");
    };

    return (
        <div className="appointment-manage-screen">
            <header className="list-header">
                <button type="button" className="back-btn" onClick={onBack} aria-label="뒤로 가기">
                    ‹
                </button>
                <h1 className="list-title">예약 관리</h1>
            </header>

            <main className="appointment-manage-main">
                {/* D-day 요약 */}
                <section className="appointment-manage-card appointment-manage-summary">
                    <span className="appointment-manage-summary-label">다음 예약까지</span>
                    <span className="appointment-manage-summary-value">
                        {daysUntil !== null ? `D-${daysUntil}` : "—"}
                    </span>
                    {nextDate && (
                        <span className="appointment-manage-summary-date">
                            {toDisplayDate(nextDate)}
                        </span>
                    )}
                </section>

                {/* 다음 예약 날짜 */}
                <section className="appointment-manage-card">
                    <h2 className="appointment-manage-card-title">다음 예약 날짜</h2>
                    <input
                        type="date"
                        className="appointment-manage-date-input"
                        value={nextDate}
                        onChange={(e) => setNextDate(e.target.value)}
                    />
                </section>

                {/* 시술 주기 */}
                <section className="appointment-manage-card">
                    <h2 className="appointment-manage-card-title">시술 주기</h2>
                    <div className="appointment-manage-cycle-options">
                        {CYCLE_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                className={`appointment-manage-cycle-btn ${cycleWeeks === opt.value && !customWeeks ? "active" : ""}`}
                                onClick={() => handleCycleSelect(opt.value)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    <div className="appointment-manage-cycle-custom">
                        <label className="appointment-manage-label">직접 입력</label>
                        <input
                            type="number"
                            min={1}
                            max={52}
                            className="appointment-manage-weeks-input"
                            placeholder="주"
                            value={customWeeks}
                            onChange={(e) => setCustomWeeks(e.target.value)}
                        />
                    </div>
                </section>

                {/* 알림 설정 */}
                <section className="appointment-manage-card">
                    <div className="appointment-manage-row">
                        <span className="appointment-manage-label">예약 알림</span>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={notifyOn}
                            className={`appointment-manage-toggle ${notifyOn ? "on" : ""}`}
                            onClick={() => setNotifyOn((v) => !v)}
                        >
                            <span className="appointment-manage-toggle-thumb" />
                        </button>
                    </div>
                </section>

                {/* 예약 히스토리 */}
                <section className="appointment-manage-card">
                    <h2 className="appointment-manage-card-title">예약 히스토리</h2>
                    <ul className="appointment-manage-history">
                        {APPOINTMENT_HISTORY_SAMPLE.map((item) => (
                            <li key={item.id} className="appointment-manage-history-item">
                                <span className="appointment-manage-history-date">{item.date}</span>
                                <span className="appointment-manage-history-title">{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
        </div>
    );
}

export default AppointmentManageView;
