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
export const NEXT_PROCEDURE_DATE = null; // 예: "2025.03.15"

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
    { id: "news", label: "소식", icon: "◇" },
    { id: "my", label: "마이", icon: "👤" },
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
