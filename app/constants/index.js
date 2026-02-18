// 샘플 기록 리스트
export const DERMA_RECORDS = [
    { id: 1, date: "2025.02.14", title: "레이저 토닝", memo: "광채 개선 목적", hospital: "○○ 피부과" },
    { id: 2, date: "2025.02.07", title: "피부 스케일링", memo: "각질 관리", hospital: "○○ 피부과" },
    { id: 3, date: "2025.01.28", title: "보톡스", memo: "이마 주름", hospital: "△△ 성형외과" },
    { id: 4, date: "2025.01.15", title: "필러 시술", memo: "턱라인", hospital: "△△ 성형외과" },
];

// 메인 홈용: 최근 시술 1건 (시술일 문자열 YYYY.MM.DD → D-day 계산용)
export const RECENT_PROCEDURE = {
    id: 1,
    title: "레이저 토닝",
    hospital: "○○ 피부과",
    procedureDate: "2025.02.14",
    memo: "광채 개선 목적",
    recoveryState: "회복 중",
    hasBeforeAfter: true,
};
// 다음 시술 예정일 (없으면 null) — "다음 시술까지 N일" 표시용
export const NEXT_PROCEDURE_DATE = "2025.03.15"; // 예약 있으면 날짜, 없으면 null

// 맞춤 추천: 사용자 표시명 (섹션 타이틀용)
export const USER_DISPLAY_NAME = "회원";

// 맞춤 추천 더미: D-day 구간별/시술 타입별 문구
export const RECOMMEND_AFTERCARE = {
    title: "지금 필요한 관리",
    tag: "Aftercare",
    getCopy: (procedureTitle, dday) => `${procedureTitle} 시술 후 ${dday}일차라 추천드려요`,
    getContent: (dday) => (dday <= 7 ? "진정·자외선 차단 가이드" : "피부 보습·재생 관리"),
};
export const RECOMMEND_PREP = {
    title: "다음 시술 준비",
    tag: "Warning",
    copy: "예약 3일 전이라면",
    content: "시술 전 금지사항·주의사항",
};
export const RECOMMEND_RELATED = {
    title: "관련 시술/관리 추천",
    tag: "Guide",
    getCopy: (procedureTitle) => `${procedureTitle} 후 관리`,
    content: "콜라겐·진정 관리 콘텐츠",
};

// 시술별 회복 기록 타임라인 샘플 (D+N 일자별)
export const PROCEDURE_TIMELINE_SAMPLE = [
    { dday: 1, date: "2025.02.15", summary: "붓기 조금, 열감 있음" },
    { dday: 2, date: "2025.02.16", summary: "붓기 줄어듦" },
    { dday: 3, date: "2025.02.17", summary: "피부 각질 약간" },
];

// 회복 상태 옵션
export const RECOVERY_STATE_OPTIONS = [
    { id: "recovering", label: "회복 중" },
    { id: "almost", label: "거의 회복" },
    { id: "done", label: "완료" },
];

export const RECORD_SAMPLE_BY_TYPE = {
    derma: DERMA_RECORDS,
};

export const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export const TYPE_LABELS = {
    derma: "피부과 기록",
    stamp: "외모 맘에 드는 날",
};

export const TAB_ITEMS = [
    { id: "home", label: "홈", icon: "⌂" },
    { id: "record", label: "기록", icon: "▤" },
    { id: "my", label: "마이", icon: "🧑" },
];

export const MENU_ITEMS = [
    {
        id: "derma",
        title: "피부과 기록",
        description: "시술·처방·피부 상태를 한곳에",
        icon: "✨",
        gradient: "linear-gradient(135deg, #fce8e8 0%, #f5e8e8 100%)",
        accent: "#e08b8b",
    },
];

export const LIST_VIEWS = {
    "derma-list": { title: "피부과 기록", records: DERMA_RECORDS },
};

// 예약 관리: 시술 주기 옵션 (주 단위)
export const CYCLE_OPTIONS = [
    { value: 4, label: "4주" },
    { value: 6, label: "6주" },
    { value: 8, label: "8주" },
];

// 예약 히스토리 샘플
export const APPOINTMENT_HISTORY_SAMPLE = [
    { id: 1, date: "2025.02.14", title: "레이저 토닝" },
    { id: 2, date: "2024.12.20", title: "피부 스케일링" },
    { id: 3, date: "2024.11.01", title: "레이저 토닝" },
];
