import { useState } from "react";
import { useSession } from "next-auth/react";
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

function formatDisplayDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}.${m}.${d}`;
}

function formatDateToInput(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function RecordWriteView({ onBack, onSave }) {
    const { data: session } = useSession();
    const [date, setDate] = useState(new Date());
    const [hospital, setHospital] = useState("");
    const [procedureTitle, setProcedureTitle] = useState("");
    const [recoveryState, setRecoveryState] = useState("recovering");
    const [states, setStates] = useState({
        swelling: 0,
        bruise: 0,
        pain: 0,
        heat: 0,
    });
    const [memo, setMemo] = useState("");
    const [photos, setPhotos] = useState([]);
    const [saving, setSaving] = useState(false);

    const setLevel = (key, value) => {
        setStates((prev) => ({ ...prev, [key]: value }));
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setPhotos((prev) => [...prev, ...files].slice(0, 5));
    };

    const removePhoto = (index) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!session) {
            alert("로그인이 필요합니다.");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                user_email: session.user.email,
                date: date.toISOString().split('T')[0],
                hospital: hospital.trim(),
                procedure_title: procedureTitle.trim(),
                recovery_state: recoveryState,
                states: states,
                memo: memo.trim(),
                photo_count: photos.length,
            };

            const { error } = await supabase
                .from('records')
                .insert(payload);

            if (error) throw error;

            if (typeof onSave === "function") {
                await onSave(payload);
            }
            if (typeof onBack === "function") {
                onBack();
            }
        } catch (error) {
            console.error('Error saving record:', error);
            alert("저장 중 오류가 발생했습니다.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="record-write-screen">
            <header className="list-header">
                <button
                    type="button"
                    className="back-btn"
                    onClick={onBack}
                    aria-label="뒤로 가기"
                >
                    ‹
                </button>
                <h1 className="list-title">오늘 기록</h1>
            </header>

            <main className="record-write-main">
                {/* 날짜 카드 */}
                <section className="record-write-card">
                    <div className="record-write-date-row">
                        <div className="record-write-date-info">
                            <span className="record-write-label">날짜</span>
                            <span className="record-write-date">{formatDisplayDate(date)}</span>
                        </div>
                        <label className="record-date-picker-label">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <input
                                type="date"
                                className="record-date-input-hidden"
                                value={formatDateToInput(date)}
                                onChange={(e) => setDate(new Date(e.target.value))}
                            />
                        </label>
                    </div>
                </section>

                {/* 시술 정보 카드 */}
                <section className="record-write-card">
                    <div className="record-write-field-group">
                        <label className="record-write-label">피부과 명</label>
                        <input
                            type="text"
                            className="record-write-input"
                            placeholder="방문하신 피부과 이름을 입력해 주세요"
                            value={hospital}
                            onChange={(e) => setHospital(e.target.value)}
                        />
                    </div>
                    <div className="record-write-field-group" style={{ marginTop: '16px' }}>
                        <label className="record-write-label">시술명</label>
                        <input
                            type="text"
                            className="record-write-input"
                            placeholder="받으신 시술명을 입력해 주세요"
                            value={procedureTitle}
                            onChange={(e) => setProcedureTitle(e.target.value)}
                        />
                    </div>
                </section>

                {/* 회복 상태 카드 */}
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

                {/* 상태 선택 카드 */}
                <section className="record-write-card">
                    <span className="record-write-label">오늘의 상태</span>
                    {STATE_OPTIONS.map(({ id, label, key }) => (
                        <div key={id} className="record-write-state-row">
                            <span className="record-write-state-name">{label}</span>
                            <div className="record-write-levels">
                                {LEVELS.map(({ value, label: levelLabel }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        className={`record-write-level-btn ${states[key] === value ? "active" : ""}`}
                                        onClick={() => setLevel(key, value)}
                                        aria-pressed={states[key] === value}
                                    >
                                        {levelLabel}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                {/* 사진 업로드 카드 */}
                <section className="record-write-card">
                    <span className="record-write-label">사진</span>
                    <div className="record-write-photos">
                        {photos.length < 5 && (
                            <label className="record-write-photo-add">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handlePhotoChange}
                                    className="record-write-photo-input"
                                />
                                <span className="record-write-photo-add-inner">+</span>
                            </label>
                        )}
                        {photos.map((file, i) => (
                            <div key={i} className="record-write-photo-preview">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt=""
                                    className="record-write-photo-img"
                                />
                                <button
                                    type="button"
                                    className="record-write-photo-remove"
                                    onClick={() => removePhoto(i)}
                                    aria-label="삭제"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 메모 카드 */}
                <section className="record-write-card">
                    <label className="record-write-label" htmlFor="record-write-memo">
                        메모
                    </label>
                    <textarea
                        id="record-write-memo"
                        className="record-write-memo"
                        placeholder="오늘 피부 상태나 따로 적고 싶은 내용을 입력해 주세요."
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        rows={4}
                    />
                </section>

                {/* 저장 버튼 */}
                <button
                    type="button"
                    className="record-write-save"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "저장 중…" : "저장"}
                </button>
            </main>
        </div>
    );
}

export default RecordWriteView;
