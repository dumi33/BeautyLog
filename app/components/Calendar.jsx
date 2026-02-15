'use client'

import { useState, useEffect } from "react";
import { WEEKDAYS, TYPE_LABELS, RECORD_SAMPLE_BY_TYPE } from "@/constants";

function Calendar() {
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
        // Generate random record days only on client side to prevent hydration mismatch
        const lastDay = new Date(year, month + 1, 0).getDate();
        const pick = (n) => {
            const set = new Set();
            while (set.size < n) set.add(Math.floor(Math.random() * lastDay) + 1);
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

    const getDayTypes = (d) => {
        if (d === null) return [];
        const types = [];
        if (recordDays.derma.includes(d)) types.push("derma");
        if (recordDays.stamp.includes(d)) types.push("stamp");
        return types;
    };

    const hasStamp = (d) => d !== null && recordDays.stamp.includes(d);

    const handleDayClick = (d) => {
        if (d === null) return;
        setSelectedDate({ year, month, day: d });
    };

    const selectedDayTypes = selectedDate ? getDayTypes(selectedDate.day) : [];
    const dateLabel = selectedDate
        ? `${selectedDate.year}.${String(selectedDate.month + 1).padStart(
            2,
            "0"
        )}.${String(selectedDate.day).padStart(2, "0")}`
        : "";

    return (
        <section className="home-calendar">
            <div className="calendar-header">
                <button
                    type="button"
                    className="calendar-nav"
                    onClick={prevMonth}
                    aria-label="이전 달"
                >
                    ‹
                </button>
                <h2 className="calendar-title">
                    {year}년 {month + 1}월
                </h2>
                <button
                    type="button"
                    className="calendar-nav"
                    onClick={nextMonth}
                    aria-label="다음 달"
                >
                    ›
                </button>
            </div>
            <div className="calendar-weekdays">
                {WEEKDAYS.map((w) => (
                    <span key={w} className="calendar-weekday">
                        {w}
                    </span>
                ))}
            </div>
            <div className="calendar-grid">
                {days.map((d, i) => {
                    const dayTypes = getDayTypes(d).filter((t) => t !== "stamp");
                    const showStamp = hasStamp(d);
                    return (
                        <button
                            key={i}
                            type="button"
                            className={`calendar-day ${d === null ? "empty" : ""} ${isToday(d) ? "today" : ""
                                } ${selectedDate && d === selectedDate.day ? "selected" : ""} ${showStamp ? "has-stamp" : ""
                                }`}
                            onClick={() => handleDayClick(d)}
                            disabled={d === null}
                        >
                            {d}
                            {showStamp && (
                                <span className="calendar-stamp" aria-label="외모 맘에 드는 날">
                                    ♥
                                </span>
                            )}
                            {dayTypes.length > 0 && (
                                <div className="calendar-day-dots">
                                    {dayTypes.map((t) => (
                                        <span
                                            key={t}
                                            className={`calendar-dot calendar-dot-${t}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {selectedDate && (
                <div className="day-detail">
                    <div className="day-detail-header">
                        <h3 className="day-detail-date">{dateLabel}</h3>
                        <button
                            type="button"
                            className="day-detail-close"
                            onClick={() => setSelectedDate(null)}
                            aria-label="닫기"
                        >
                            ✕
                        </button>
                    </div>
                    {selectedDayTypes.length === 0 ? (
                        <p className="day-detail-empty">이 날은 기록이 없어요</p>
                    ) : (
                        <ul className="day-detail-list">
                            {selectedDayTypes.map((typeId) => {
                                if (typeId === "stamp") {
                                    return (
                                        <li
                                            key={typeId}
                                            className="day-detail-item day-detail-item-stamp"
                                        >
                                            <span className="day-detail-stamp-icon">♥</span>
                                            <div className="day-detail-body">
                                                <span className="day-detail-category">
                                                    {TYPE_LABELS.stamp}
                                                </span>
                                            </div>
                                        </li>
                                    );
                                }
                                const records = RECORD_SAMPLE_BY_TYPE[typeId];
                                const sample = records[selectedDate.day % records.length];
                                return (
                                    <li
                                        key={typeId}
                                        className={`day-detail-item day-detail-item-${typeId}`}
                                    >
                                        <span className="day-detail-dot" />
                                        <div className="day-detail-body">
                                            <span className="day-detail-category">
                                                {TYPE_LABELS[typeId]}
                                            </span>
                                            <span className="day-detail-title">{sample.title}</span>
                                            {sample.memo && (
                                                <span className="day-detail-memo">{sample.memo}</span>
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
