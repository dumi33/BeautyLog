'use client';

import styles from './RecordWriteView.module.css';
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
    const [nextAppointment, setNextAppointment] = useState(null); // 'YYYY-MM-DD' 또는 null
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

    // 이미지 압축 함수
    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 1200;
                    const MAX_HEIGHT = 1200;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    // quality 0.7로 압축하여 Blob 생성
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, "image/jpeg", 0.7);
                };
            };
            reader.onerror = (error) => reject(error);
        });
    };

    // 파일 업로드 함수
    const uploadImages = async (userId) => {
        const uploadedPaths = [];

        for (const file of photos) {
            try {
                // 0. 이미지 압축
                const compressedBlob = await compressImage(file);

                // 1. 파일명 생성 (경로 단순화: userId/timestamp_random.jpg)
                const timestamp = Date.now();
                const randomStr = Math.random().toString(36).substring(7);
                const filePath = `${userId}/${timestamp}_${randomStr}.jpg`;

                console.log("Uploading to path:", filePath);

                const { data, error: uploadError } = await supabase.storage
                    .from('beautyLog')
                    .upload(filePath, compressedBlob, {
                        contentType: 'image/jpeg',
                        upsert: true
                    });

                if (uploadError) {
                    console.error('Supabase Storage Error Detail:', uploadError);
                    throw new Error(`스토리지 오류: ${uploadError.message}`);
                }

                uploadedPaths.push(filePath);
                console.log("Upload success:", data.path);
            } catch (err) {
                console.error('Individual file upload failed:', err);
                throw err;
            }
        }
        return uploadedPaths;
    };

    const handleSave = async () => {
        if (!session) {
            alert("로그인이 필요합니다.");
            return;
        }

        if (!hospital.trim()) {
            alert("피부과 명을 입력해 주세요.");
            return;
        }

        if (!procedureTitle.trim()) {
            alert("시술명을 입력해 주세요.");
            return;
        }

        const inputDateStr = date.toISOString().split('T')[0];
        if (nextAppointment && nextAppointment < inputDateStr) {
            alert("다음 예약일은 시술일보다 이전일 수 없습니다.");
            return;
        }

        setSaving(true);
        try {
            // 1. 이미지 먼저 스토리지에 업로드
            let imagePaths = [];
            if (photos.length > 0) {
                imagePaths = await uploadImages(session.user.id || session.user.email);
            }

            // 2. DB에 기록 저장 (이미지 경로 포함)
            const payload = {
                user_email: session.user.email,
                date: date.toISOString().split('T')[0],
                hospital: hospital.trim(),
                procedure_title: procedureTitle.trim(),
                recovery_state: recoveryState,
                states: states,
                timeline: memo.trim() ? [{
                    date: date.toISOString().split('T')[0],
                    content: memo.trim(),
                    created_at: new Date().toISOString()
                }] : [],
                photo_count: photos.length,
                image_paths: imagePaths,
                next_appointment: nextAppointment,
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
            alert(error.message || "저장 중 오류가 발생했습니다.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.recordWriteScreen}>
            <header className={styles.listHeader}>
                <button
                    type="button"
                    className={styles.backBtn}
                    onClick={onBack}
                    aria-label="뒤로 가기"
                >
                    ‹
                </button>
                <h1 className={styles.listTitle}>오늘 기록</h1>
            </header>

            <main className={styles.recordWriteMain}>
                {/* 날짜 카드 */}
                <section className={styles.recordWriteCard}>
                    <div className={styles.recordWriteDateRow}>
                        <div className={styles.recordWriteDateInfo}>
                            <span className={styles.recordWriteLabel}>시술 날짜</span>
                            <span className={styles.recordWriteDate}>{formatDisplayDate(date)}</span>
                        </div>
                        <label className={styles.recordDatePickerLabel}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <input
                                type="date"
                                className={styles.recordDateInputHidden}
                                value={formatDateToInput(date)}
                                onChange={(e) => setDate(new Date(e.target.value))}
                            />
                        </label>
                    </div>
                </section>

                {/* 시술 정보 카드 */}
                <section className={styles.recordWriteCard}>
                    <div className="record-write-field-group">
                        <label className={styles.recordWriteLabel}>*피부과</label>
                        <input
                            type="text"
                            className={styles.recordWriteInput}
                            placeholder="방문하신 피부과 이름을 입력해 주세요"
                            value={hospital}
                            onChange={(e) => setHospital(e.target.value)}
                        />
                    </div>
                    <div className="record-write-field-group" style={{ marginTop: '16px' }}>
                        <label className={styles.recordWriteLabel}>*시술명</label>
                        <input
                            type="text"
                            className={styles.recordWriteInput}
                            placeholder="받으신 시술명을 입력해 주세요"
                            value={procedureTitle}
                            onChange={(e) => setProcedureTitle(e.target.value)}
                        />
                    </div>
                </section>

                {/* 회복 상태 카드 */}
                <section className={styles.recordWriteCard}>
                    <span className={styles.recordWriteLabel}>회복 상태</span>
                    <div className={styles.recordWriteRecoveryGroup}>
                        {RECOVERY_STATE_OPTIONS.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                className={`${styles.recordWriteRecoveryBtn} ${recoveryState === option.id ? styles.active : ""}`}
                                onClick={() => setRecoveryState(option.id)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 상태 선택 카드 */}
                <section className={styles.recordWriteCard}>
                    <span className={styles.recordWriteLabel}>오늘의 상태</span>
                    {STATE_OPTIONS.map(({ id, label, key }) => (
                        <div key={id} className={styles.recordWriteStateRow}>
                            <span className={styles.recordWriteStateName}>{label}</span>
                            <div className={styles.recordWriteLevels}>
                                {LEVELS.map(({ value, label: levelLabel }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        className={`${styles.recordWriteLevelBtn} ${states[key] === value ? styles.active : ""}`}
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
                <section className={styles.recordWriteCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className={styles.recordWriteLabel} style={{ margin: 0 }}>사진</span>
                        {photos.length < 5 && (
                            <label className={styles.recordWriteNextAddBtn} style={{ cursor: 'pointer' }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handlePhotoChange}
                                    className={styles.recordWritePhotoInput}
                                />
                                +
                            </label>
                        )}
                    </div>
                    {photos.length > 0 && (
                        <div className={styles.recordWritePhotos} style={{ marginTop: '12px' }}>
                            {photos.map((file, i) => (
                                <div key={i} className={styles.recordWritePhotoPreview}>
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt=""
                                        className={styles.recordWritePhotoImg}
                                    />
                                    <button
                                        type="button"
                                        className={styles.recordWritePhotoRemove}
                                        onClick={() => removePhoto(i)}
                                        aria-label="삭제"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* 메모 카드 */}
                <section className={styles.recordWriteCard}>
                    <label className={styles.recordWriteLabel} htmlFor="record-write-memo">
                        기록 타임라인
                    </label>
                    <textarea
                        id="record-write-memo"
                        className={styles.recordWriteMemo}
                        placeholder="오늘 피부 상태나 따로 적고 싶은 내용을 입력해 주세요."
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        rows={2}
                    />
                </section>

                {/* 다음 예약 카드 */}
                <section className={styles.recordWriteCard}>
                    <div
                        className={styles.recordWriteNextHeader}
                        onClick={() => !nextAppointment && setNextAppointment(formatDateToInput(new Date()))}
                    >
                        <span className={styles.recordWriteLabel} style={{ margin: 0 }}>다음 예약</span>
                        {!nextAppointment ? (
                            <button type="button" className={styles.recordWriteNextAddBtn}>
                                +
                            </button>
                        ) : (
                            <button
                                type="button"
                                className={styles.recordWriteNextRemoveBtn}
                                onClick={(e) => { e.stopPropagation(); setNextAppointment(null); }}
                            >
                                ×
                            </button>
                        )}
                    </div>
                    {nextAppointment && (
                        <div className="record-write-next-content" style={{ marginTop: '12px' }}>
                            <input
                                type="date"
                                className={styles.recordWriteInput}
                                value={nextAppointment}
                                onChange={(e) => setNextAppointment(e.target.value)}
                            />
                        </div>
                    )}
                </section>

                {/* 저장 버튼 */}
                <button
                    type="button"
                    className={styles.recordWriteSave}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "저장 중…" : "저장"}
                </button>
            </main>
        </div >
    );
}

export default RecordWriteView;
