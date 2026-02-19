'use client';

import styles from './RecordDetailView.module.css';
import { useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { RECOVERY_STATE_OPTIONS } from "@/constants";

const STATE_OPTIONS = [
    { id: "swelling", label: "붓기", key: "swelling" },
    { id: "bruise", label: "멍", key: "bruise" },
    { id: "pain", label: "통증", key: "pain" },
    { id: "heat", label: "열감", key: "heat" },
];

const LEVELS = [
    { value: 0, label: "없음" },
    { value: 1, label: "조금" },
    { value: 2, label: "보통" },
    { value: 3, label: "많음" },
    { value: 4, label: "매우" },
];

function RecordDetailView({ record, onBack, onSave }) {
    const [timeline, setTimeline] = useState(() => {
        if (record.timeline && record.timeline.length > 0) return record.timeline;
        if (record.memo) return [{
            date: record.date,
            content: record.memo,
            created_at: record.created_at || new Date().toISOString()
        }];
        return [];
    });
    const [newEntry, setNewEntry] = useState({ date: new Date().toISOString().split('T')[0], content: "" });
    const [recoveryState, setRecoveryState] = useState(record?.recovery_state || "recovering");
    const [nextAppointment, setNextAppointment] = useState(record?.next_appointment || null);
    const [isSaving, setIsSaving] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    // D-Day 계산 헬퍼
    const calculateDday = (targetDate) => {
        if (!record.date || !targetDate) return 0;
        const start = new Date(record.date);
        const target = new Date(targetDate);
        start.setHours(0, 0, 0, 0);
        target.setHours(0, 0, 0, 0);
        return Math.floor((target - start) / (24 * 60 * 60 * 1000));
    };

    const isTimelineChanged = JSON.stringify(timeline) !== JSON.stringify(record.timeline || (record.memo ? [{
        date: record.date,
        content: record.memo,
        created_at: record.created_at || ""
    }] : []));
    const isRecoveryChanged = recoveryState !== (record?.recovery_state || "recovering");
    const isNextAppointmentChanged = nextAppointment !== (record?.next_appointment || null);
    const isChanged = isTimelineChanged || isRecoveryChanged || isNextAppointmentChanged;

    if (!record) return null;

    const displayDate = record.date ? record.date.replace(/-/g, '.') : '';

    const dday = useMemo(() => {
        if (!record.date) return null;
        // record.date는 'YYYY-MM-DD' 형식으로 가정
        const [y, m, d] = record.date.split("-").map(Number);
        const start = new Date(y, m - 1, d);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        return Math.floor((today - start) / (24 * 60 * 60 * 1000));
    }, [record.date]);

    const handleUpdate = async () => {
        if (nextAppointment && record.date && nextAppointment < record.date) {
            alert("다음 예약일은 시술일보다 이전일 수 없습니다.");
            return;
        }
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('records')
                .update({
                    timeline: timeline,
                    recovery_state: recoveryState,
                    next_appointment: nextAppointment
                })
                .eq('id', record.id);

            if (error) throw error;

            if (onSave) onSave({
                ...record,
                timeline: timeline,
                recovery_state: recoveryState,
                next_appointment: nextAppointment
            });
            return true;
        } catch (error) {
            console.error('Error updating record:', error);
            alert("수정 중 오류가 발생했습니다.");
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleBack = () => {
        if (isChanged) {
            if (!confirm("변경사항이 저장되지 않았습니다. 나가시겠습니까?")) {
                return;
            }
        }
        onBack();
    };

    return (
        <div className={styles.recordDetailScreen}>
            <header className="list-header">
                <div className="header-left">
                    <button
                        type="button"
                        className="back-btn"
                        onClick={handleBack}
                        aria-label="뒤로 가기"
                    >
                        ‹
                    </button>
                    <h1 className="list-title">기록 상세</h1>
                </div>
            </header>

            <main className={styles.recordDetailMain}>
                <section className={styles.procedureDetailCard}>
                    <h2 className={styles.procedureDetailCardTitle}>시술 정보</h2>
                    <div className={styles.procedureDetailInfo}>
                        <div className={styles.procedureDetailInfoRow}>
                            <span className={styles.procedureDetailInfoLabel}>시술 이름</span>
                            <span className={styles.procedureDetailInfoValue}>{record.procedure_title || '기록'}</span>
                        </div>
                        <div className={styles.procedureDetailInfoRow}>
                            <span className={styles.procedureDetailInfoLabel}>병원</span>
                            <span className={styles.procedureDetailInfoValue}>{record.hospital || '정보 없음'}</span>
                        </div>
                        <div className={styles.procedureDetailInfoRow}>
                            <span className={styles.procedureDetailInfoLabel}>시술일</span>
                            <span className={styles.procedureDetailInfoValue}>{displayDate}</span>
                        </div>
                        <div className={`${styles.procedureDetailInfoRow} ${styles.procedureDetailDdayRow}`}>
                            <span className={styles.procedureDetailInfoLabel}>경과</span>
                            <span className={`${styles.procedureDetailInfoValue} ${styles.procedureDetailDday}`}>
                                {dday === 0 ? "D-Day" : dday > 0 ? `D+${dday}` : `D${dday}`}
                            </span>
                        </div>

                        <div className={styles.appointmentSection}>
                            <div className={styles.appointmentHeader}>
                                <span className={styles.procedureDetailInfoLabel} style={{ color: 'var(--point)', marginBottom: 0 }}>다음 예약</span>
                                {!nextAppointment ? (
                                    <button
                                        type="button"
                                        className={styles.btnAdd}
                                        onClick={() => {
                                            const today = new Date().toISOString().split('T')[0];
                                            setNextAppointment(today);
                                        }}
                                    >
                                        +
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className={styles.btnRemove}
                                        onClick={() => setNextAppointment(null)}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>
                        {nextAppointment && (
                            <div style={{ marginTop: '8px' }}>
                                <input
                                    type="date"
                                    className="record-write-input"
                                    value={nextAppointment}
                                    style={{ fontSize: '0.9rem', padding: '8px 12px' }}
                                    onChange={(e) => setNextAppointment(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </section>

                <section className={styles.card}>
                    <span className={styles.label}>회복 상태</span>
                    <div className={styles.recoveryGroup}>
                        {RECOVERY_STATE_OPTIONS.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                className={`${styles.recoveryBtn} ${recoveryState === option.id ? styles.active : ""}`}
                                onClick={() => setRecoveryState(option.id)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </section>

                <section className={styles.card}>
                    <span className={styles.label}>상태 상세</span>
                    <div className={styles.statesRow}>
                        {STATE_OPTIONS.map(({ id, label, key }) => {
                            const levelValue = record.states?.[key];
                            const levelLabel = LEVELS.find(l => l.value === levelValue)?.label || "없음";
                            return (
                                <div key={id} className={styles.stateBadge}>
                                    <span className={styles.stateLabel}>{label}</span>
                                    <span className={styles.stateValue}>{levelLabel}</span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 기록 타임라인 섹션 */}
                <section className={styles.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h2 className={styles.procedureDetailCardTitle} style={{ margin: 0 }}>기록 타임라인</h2>
                        {!showAddForm && (
                            <button
                                type="button"
                                className={styles.btnAdd}
                                onClick={() => setShowAddForm(true)}
                            >
                                +
                            </button>
                        )}
                    </div>

                    {/* 타임라인 목록 */}
                    <div className={styles.timelineList}>
                        {timeline.filter(t => t.content.trim()).length > 0 ? (
                            [...timeline]
                                .filter(t => t.content.trim())
                                .sort((a, b) => new Date(b.date) - new Date(a.date))
                                .map((entry, idx) => {
                                    const dValue = calculateDday(entry.date);
                                    return (
                                        <div key={idx} className={styles.timelineItem}>
                                            <div className={styles.timelineItemHeader}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                                    <span className={`${styles.timelineItemDday} ${dValue === 0 ? styles.today : ''}`}>
                                                        {dValue === 0 ? 'D-Day' : dValue > 0 ? `D+${dValue}` : `D${dValue}`}
                                                    </span>
                                                    <span className={styles.timelineItemDate}>{entry.date.replace(/-/g, '.')}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={styles.timelineItemDeleteBtn}
                                                    onClick={() => {
                                                        if (confirm("이 기록을 삭제하시겠습니까?")) {
                                                            setTimeline(prev => prev.filter(t => t.created_at !== entry.created_at));
                                                        }
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            <div className={styles.timelineItemContent}>{entry.content}</div>
                                        </div>
                                    );
                                })
                        ) : (
                            <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-soft)', fontSize: '0.9rem' }}>
                                기록된 타임라인이 없습니다.
                            </div>
                        )}
                    </div>

                    {/* 타임라인 추가 폼 (조건부 렌더링) */}
                    {showAddForm && (
                        <div className={styles.timelineAdd}>
                            <div className={styles.timelineAddHeader}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                    <input
                                        type="date"
                                        value={newEntry.date}
                                        onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                                        className={styles.timelineDateInput}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        type="button"
                                        className={styles.timelineAddBtn}
                                        onClick={() => {
                                            if (!newEntry.content.trim()) return;
                                            setTimeline(prev => [...prev, { ...newEntry, created_at: new Date().toISOString() }]);
                                            setNewEntry(prev => ({ ...prev, content: "" }));
                                            setShowAddForm(false);
                                        }}
                                    >
                                        추가
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.btnRemove}
                                        onClick={() => setShowAddForm(false)}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                            <textarea
                                className={styles.memoArea}
                                style={{ marginTop: '8px' }}
                                value={newEntry.content}
                                onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="오늘의 회복 상태를 기록해 보세요..."
                                autoFocus
                            />
                        </div>
                    )}
                </section>


                {record.image_paths && record.image_paths.length > 0 && (
                    <section className={styles.card}>
                        <label className={styles.label}>사진</label>
                        <div className={styles.photoGroup}>
                            {record.image_paths.map((path, idx) => {
                                const { data: { publicUrl } } = supabase.storage
                                    .from('beautyLog')
                                    .getPublicUrl(path);

                                return (
                                    <div key={idx} className={styles.photoPreview}>
                                        <img
                                            src={publicUrl}
                                            alt={`관리 사진 ${idx + 1}`}
                                            className={styles.photoImg}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* 저장 버튼 (수정사항이 있을 때만 하단에 표시) */}
                {isChanged && (
                    <button
                        type="button"
                        className={styles.saveBtn}
                        onClick={handleUpdate}
                        disabled={isSaving}
                        style={{ marginTop: '16px' }}
                    >
                        {isSaving ? "저장 중…" : "수정 내용 저장"}
                    </button>
                )}
            </main>
        </div>
    );
}

export default RecordDetailView;
