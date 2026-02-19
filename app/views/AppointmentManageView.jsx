'use client';

import styles from './AppointmentManageView.module.css';
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
        <div className={styles.appointmentManageScreen}>
            <header className="list-header">
                <button type="button" className="back-btn" onClick={onBack} aria-label="뒤로 가기">
                    ‹
                </button>
                <h1 className="list-title">예약 관리</h1>
            </header>

            <main className={styles.appointmentManageMain}>
                {/* D-day 요약 */}
                <section className={`${styles.card} ${styles.summary}`}>
                    <span className={styles.summaryLabel}>다음 예약까지</span>
                    <span className={styles.summaryValue}>
                        {daysUntil !== null ? `D-${daysUntil}` : "—"}
                    </span>
                    {nextDate && (
                        <span className={styles.summaryDate}>
                            {toDisplayDate(nextDate)}
                        </span>
                    )}
                </section>

                {/* 다음 예약 날짜 */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>다음 예약 날짜</h2>
                    <input
                        type="date"
                        className={styles.dateInput}
                        value={nextDate}
                        onChange={(e) => setNextDate(e.target.value)}
                    />
                </section>

                {/* 시술 주기 */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>시술 주기</h2>
                    <div className={styles.cycleOptions}>
                        {CYCLE_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                className={`${styles.cycleBtn} ${cycleWeeks === opt.value && !customWeeks ? styles.active : ""}`}
                                onClick={() => handleCycleSelect(opt.value)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    <div className={styles.cycleCustom}>
                        <label className={styles.label}>직접 입력</label>
                        <input
                            type="number"
                            min={1}
                            max={52}
                            className={styles.weeksInput}
                            placeholder="주"
                            value={customWeeks}
                            onChange={(e) => setCustomWeeks(e.target.value)}
                        />
                    </div>
                </section>

                {/* 알림 설정 */}
                <section className={styles.card}>
                    <div className={styles.row}>
                        <span className={styles.label}>예약 알림</span>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={notifyOn}
                            className={`${styles.toggle} ${notifyOn ? styles.on : ""}`}
                            onClick={() => setNotifyOn((v) => !v)}
                        >
                            <span className={styles.toggleThumb} />
                        </button>
                    </div>
                </section>

                {/* 예약 히스토리 */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>예약 히스토리</h2>
                    <ul className={styles.history}>
                        {APPOINTMENT_HISTORY_SAMPLE.map((item) => (
                            <li key={item.id} className={styles.historyItem}>
                                <span className={styles.historyDate}>{item.date}</span>
                                <span className={styles.historyTitle}>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
        </div>
    );
}

export default AppointmentManageView;
