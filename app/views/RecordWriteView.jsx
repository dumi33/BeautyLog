"use client";

import { useState } from "react";

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

function formatToday() {
    const t = new Date();
    const y = t.getFullYear();
    const m = String(t.getMonth() + 1).padStart(2, "0");
    const d = String(t.getDate()).padStart(2, "0");
    return `${y}.${m}.${d}`;
}

function RecordWriteView({ onBack, onSave }) {
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
        setSaving(true);
        try {
            const payload = {
                date: formatToday(),
                states,
                memo: memo.trim(),
                photoCount: photos.length,
            };
            if (typeof onSave === "function") {
                await onSave(payload);
            }
            if (typeof onBack === "function") {
                onBack();
            }
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
                    <span className="record-write-label">날짜</span>
                    <span className="record-write-date">{formatToday()}</span>
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
