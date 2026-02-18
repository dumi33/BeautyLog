import { useState } from "react";
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
    const [memo, setMemo] = useState(record?.memo || "");
    const [recoveryState, setRecoveryState] = useState(record?.recovery_state || "recovering");
    const [isSaving, setIsSaving] = useState(false);

    const isMemoChanged = memo !== (record?.memo || "");
    const isRecoveryChanged = recoveryState !== (record?.recovery_state || "recovering");
    const isChanged = isMemoChanged || isRecoveryChanged;

    if (!record) return null;

    const displayDate = record.date ? record.date.replace(/-/g, '.') : '';

    const handleUpdate = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('records')
                .update({
                    memo: memo.trim(),
                    recovery_state: recoveryState
                })
                .eq('id', record.id);

            if (error) throw error;

            if (onSave) onSave({
                ...record,
                memo: memo.trim(),
                recovery_state: recoveryState
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
        <div className="record-write-screen">
            <header className="list-header">
                <button
                    type="button"
                    className="back-btn"
                    onClick={handleBack}
                    aria-label="뒤로 가기"
                >
                    ‹
                </button>
                <h1 className="list-title">기록 상세</h1>
            </header>

            <main className="record-write-main">
                {/* ... 기존 날짜, 시술 정보, 회복 상태 카드 유지 ... */}
                <section className="record-write-card">
                    <div className="record-write-date-info">
                        <span className="record-write-label">날짜</span>
                        <span className="record-write-date">{displayDate}</span>
                    </div>
                </section>

                <section className="record-write-card">
                    <div className="record-write-field-group">
                        <label className="record-write-label">피부과 명</label>
                        <div className="record-detail-text">{record.hospital || '입력 정보 없음'}</div>
                    </div>
                    <div className="record-write-field-group" style={{ marginTop: '16px' }}>
                        <label className="record-write-label">시술명</label>
                        <div className="record-detail-text">{record.procedure_title || '입력 정보 없음'}</div>
                    </div>
                </section>

                <section className="record-write-card">
                    <span className="record-write-label">회복 상태</span>
                    <div className="record-write-recovery-group">
                        {RECOVERY_STATE_OPTIONS.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                className={`record-write-recovery-btn ${recoveryState === option.id ? "active" : ""}`}
                                onClick={() => setRecoveryState(option.id)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="record-write-card">
                    <span className="record-write-label">상태 상세</span>
                    {STATE_OPTIONS.map(({ id, label, key }) => (
                        <div key={id} className="record-write-state-row">
                            <span className="record-write-state-name">{label}</span>
                            <div className="record-write-levels">
                                {LEVELS.map(({ value, label: levelLabel }) => (
                                    <div
                                        key={value}
                                        className={`record-write-level-btn ${record.states?.[key] === value ? "active" : ""}`}
                                        style={{ cursor: 'default' }}
                                    >
                                        {levelLabel}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                {/* 메모 카드 (수정 가능 버전) */}
                <section className="record-write-card">
                    <label className="record-write-label">메모 수정</label>
                    <textarea
                        className="record-write-memo"
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="메모를 입력해 주세요"
                        rows={5}
                    />
                </section>

                {/* 저장 버튼 (수정사항이 있을 때만 하단에 표시) */}
                {isChanged && (
                    <button
                        type="button"
                        className="record-write-save"
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
