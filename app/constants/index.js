// 샘플 기록 리스트
export const DERMA_RECORDS = [
    { id: 1, date: "2025.02.14", title: "레이저 토닝", memo: "광채 개선 목적" },
    { id: 2, date: "2025.02.07", title: "피부 스케일링", memo: "각질 관리" },
    { id: 3, date: "2025.01.28", title: "보톡스", memo: "이마 주름" },
    { id: 4, date: "2025.01.15", title: "필러 시술", memo: "턱라인" },
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
    { id: "news", label: "소식", icon: "💬" },
    { id: "my", label: "마이", icon: "🧑" },
];

export const MENU_ITEMS = [
    {
        id: "derma",
        title: "피부과 기록",
        description: "시술·처방·피부 상태를 한곳에",
        icon: "✨",
        gradient: "linear-gradient(135deg, #f5e8e8 0%, #efe0e8 100%)",
        accent: "#d4a5a5",
    },
];

export const LIST_VIEWS = {
    "derma-list": { title: "피부과 기록", records: DERMA_RECORDS },
};
