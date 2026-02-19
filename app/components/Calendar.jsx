'use client'

import styles from './Calendar.module.css';
import { useState, useEffect } from "react";
import { WEEKDAYS, TYPE_LABELS, RECORD_SAMPLE_BY_TYPE } from "@/constants";

function getWeekDates(today) {
    const dayOfWeek = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - dayOfWeek);
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        dates.push(d);
    }
    return dates;
}

function Calendar() {
    const [expanded, setExpanded] = useState(false);
    const [yearMonth, setYearMonth] = useState(() => {
        const now = new Date();
        return { year: now.getFullYear(), month: now.getMonth() };
    });
    const [selectedDate, setSelectedDate] = useState(null);
    const today = new Date();

    const year = yearMonth.year;
    const month = yearMonth.month;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startBlank = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const [recordDays, setRecordDays] = useState({ derma: [], stamp: [] });

    useEffect(() => {
        const lastDayNum = new Date(year, month + 1, 0).getDate();
        const pick = (n) => {
            const set = new Set();
            while (set.size < n) set.add(Math.floor(Math.random() * lastDayNum) + 1);
            return [...set];
        };
        setRecordDays({
            derma: pick(4 + Math.floor(Math.random() * 3)),
            stamp: pick(3 + Math.floor(Math.random() * 4)),
        });
        setSelectedDate(null);
    }, [year, month]);

    const prevMonth = () => {
        if (month === 0) setYearMonth({ year: year - 1, month: 11 });
        else setYearMonth({ year, month: month - 1 });
    };
    const nextMonth = () => {
        if (month === 11) setYearMonth({ year: year + 1, month: 0 });
        else setYearMonth({ year, month: month + 1 });
    };

    const days = [];
    for (let i = 0; i < startBlank; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    const isToday = (d) =>
        d !== null &&
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === d;

    const isTodayDate = (date) =>
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();

    const getDayTypes = (d) => {
        if (d === null) return [];
        const types = [];
        if (recordDays.derma.includes(d)) types.push("derma");
        if (recordDays.stamp.includes(d)) types.push("stamp");
        return types;
    };

    const getDayTypesForDate = (date) => {
        if (year !== date.getFullYear() || month !== date.getMonth()) return [];
        return getDayTypes(date.getDate());
    };

    const hasStamp = (d) => d !== null && recordDays.stamp.includes(d);

    const hasStampDate = (date) => {
        if (year !== date.getFullYear() || month !== date.getMonth()) return false;
        return hasStamp(date.getDate());
    };

    const handleDayClick = (d) => {
        if (d === null) return;
        setSelectedDate({ year, month, day: d });
    };

    const handleWeekDayClick = (date) => {
        setSelectedDate({
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
        });
    };

    const selectedDayTypes = selectedDate ? getDayTypes(selectedDate.day) : [];
    const dateLabel = selectedDate
        ? `${selectedDate.year}.${String(selectedDate.month + 1).padStart(2, "0")}.${String(selectedDate.day).padStart(2, "0")}`
        : "";

    const weekDates = getWeekDates(today);

    if (!expanded) {
        return (
            <section className={`${styles.homeCalendar}`}>
                <div className={styles.calendarWeekdays}>
                    {WEEKDAYS.map((w) => (
                        <span key={w} className={styles.calendarWeekday}>
                            {w}
                        </span>
                    ))}
                </div>
                <div className={`${styles.calendarGrid} ${styles.calendarGridWeek}`}>
                    {weekDates.map((date, i) => {
                        const d = date.getDate();
                        const dayTypes = getDayTypesForDate(date).filter((t) => t !== "stamp");
                        const showStamp = hasStampDate(date);
                        const selected =
                            selectedDate &&
                            selectedDate.year === date.getFullYear() &&
                            selectedDate.month === date.getMonth() &&
                            selectedDate.day === d;
                        return (
                            <button
                                key={i}
                                type="button"
                                className={`${styles.calendarDay} ${isTodayDate(date) ? styles.today : ""} ${selected ? styles.selected : ""} ${showStamp ? styles.hasStamp : ""}`}
                                onClick={() => handleWeekDayClick(date)}
                            >
                                {d}
                                {showStamp && (
                                    <span className={styles.calendarStamp} aria-label="외모 맘에 드는 날">
                                        ♥
                                    </span>
                                )}
                                {dayTypes.length > 0 && (
                                    <div className={styles.calendarDayDots}>
                                        {dayTypes.map((t) => (
                                            <span key={t} className={`${styles.calendarDot} ${t === 'derma' ? styles.calendarDotDerma : ''}`} />
                                        ))}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
                <button
                    type="button"
                    className={styles.calendarExpandBtn}
                    onClick={() => setExpanded(true)}
                >
                    한 달 보기
                </button>
                {selectedDate && (
                    <div className={styles.dayDetail}>
                        <div className={styles.dayDetailHeader}>
                            <h3 className={styles.dayDetailDate}>{dateLabel}</h3>
                            <button
                                type="button"
                                className={styles.dayDetailClose}
                                onClick={() => setSelectedDate(null)}
                                aria-label="닫기"
                            >
                                ✕
                            </button>
                        </div>
                        {selectedDayTypes.length === 0 ? (
                            <p className={styles.dayDetailEmpty}>이 날은 기록이 없어요</p>
                        ) : (
                            <ul className={styles.dayDetailList}>
                                {selectedDayTypes.map((typeId) => {
                                    if (typeId === "stamp") {
                                        return (
                                            <li key={typeId} className={`${styles.dayDetailItem} ${styles.dayDetailItemStamp}`}>
                                                <span className={styles.dayDetailStampIcon}>♥</span>
                                                <div className={styles.dayDetailBody}>
                                                    <span className={styles.dayDetailCategory}>{TYPE_LABELS.stamp}</span>
                                                </div>
                                            </li>
                                        );
                                    }
                                    const records = RECORD_SAMPLE_BY_TYPE[typeId];
                                    const sample = records[selectedDate.day % records.length];
                                    return (
                                        <li key={typeId} className={`${styles.dayDetailItem} ${typeId === 'derma' ? styles.dayDetailItemDerma : ''}`}>
                                            <span className={styles.dayDetailDot} />
                                            <div className={styles.dayDetailBody}>
                                                <span className={styles.dayDetailCategory}>{TYPE_LABELS[typeId]}</span>
                                                <span className={styles.dayDetailTitle}>{sample.title}</span>
                                                {sample.memo && (
                                                    <span className={styles.dayDetailMemo}>{sample.memo}</span>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                )}
            </section>
        );
    }

    return (
        <section className={styles.homeCalendar}>
            <div className={styles.calendarHeader}>
                <button type="button" className={styles.calendarNav} onClick={prevMonth} aria-label="이전 달">
                    ‹
                </button>
                <h2 className={styles.calendarTitle}>
                    {year}년 {month + 1}월
                </h2>
                <button type="button" className={styles.calendarNav} onClick={nextMonth} aria-label="다음 달">
                    ›
                </button>
            </div>
            <button
                type="button"
                className={styles.calendarCollapseBtn}
                onClick={() => setExpanded(false)}
            >
                일주일만 보기
            </button>
            <div className={styles.calendarWeekdays}>
                {WEEKDAYS.map((w) => (
                    <span key={w} className={styles.calendarWeekday}>
                        {w}
                    </span>
                ))}
            </div>
            <div className={styles.calendarGrid}>
                {days.map((d, i) => {
                    const dayTypes = getDayTypes(d).filter((t) => t !== "stamp");
                    const showStamp = hasStamp(d);
                    return (
                        <button
                            key={i}
                            type="button"
                            className={`${styles.calendarDay} ${d === null ? styles.empty : ""} ${isToday(d) ? styles.today : ""} ${selectedDate && d === selectedDate.day ? styles.selected : ""} ${showStamp ? styles.hasStamp : ""}`}
                            onClick={() => handleDayClick(d)}
                            disabled={d === null}
                        >
                            {d}
                            {showStamp && (
                                <span className={styles.calendarStamp} aria-label="외모 맘에 드는 날">
                                    ♥
                                </span>
                            )}
                            {dayTypes.length > 0 && (
                                <div className={styles.calendarDayDots}>
                                    {dayTypes.map((t) => (
                                        <span key={t} className={`${styles.calendarDot} ${t === 'derma' ? styles.calendarDotDerma : ''}`} />
                                    ))}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {selectedDate && (
                <div className={styles.dayDetail}>
                    <div className={styles.dayDetailHeader}>
                        <h3 className={styles.dayDetailDate}>{dateLabel}</h3>
                        <button
                            type="button"
                            className={styles.dayDetailClose}
                            onClick={() => setSelectedDate(null)}
                            aria-label="닫기"
                        >
                            ✕
                        </button>
                    </div>
                    {selectedDayTypes.length === 0 ? (
                        <p className={styles.dayDetailEmpty}>이 날은 기록이 없어요</p>
                    ) : (
                        <ul className={styles.dayDetailList}>
                            {selectedDayTypes.map((typeId) => {
                                if (typeId === "stamp") {
                                    return (
                                        <li key={typeId} className={`${styles.dayDetailItem} ${styles.dayDetailItemStamp}`}>
                                            <span className={styles.dayDetailStampIcon}>♥</span>
                                            <div className={styles.dayDetailBody}>
                                                <span className={styles.dayDetailCategory}>{TYPE_LABELS.stamp}</span>
                                            </div>
                                        </li>
                                    );
                                }
                                const records = RECORD_SAMPLE_BY_TYPE[typeId];
                                const sample = records[selectedDate.day % records.length];
                                return (
                                    <li key={typeId} className={`${styles.dayDetailItem} ${typeId === 'derma' ? styles.dayDetailItemDerma : ''}`}>
                                        <span className={styles.dayDetailDot} />
                                        <div className={styles.dayDetailBody}>
                                            <span className={styles.dayDetailCategory}>{TYPE_LABELS[typeId]}</span>
                                            <span className={styles.dayDetailTitle}>{sample.title}</span>
                                            {sample.memo && (
                                                <span className={styles.dayDetailMemo}>{sample.memo}</span>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </section>
    );
}

export default Calendar;
