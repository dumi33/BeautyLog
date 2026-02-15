import { useMemo } from "react";

// 월별로 랜덤 기록일 생성 (년·월이 바뀔 때만 재계산)
export function useRandomRecordDays(year, month) {
    return useMemo(() => {
        const lastDay = new Date(year, month + 1, 0).getDate();
        const pick = (n) => {
            const set = new Set();
            while (set.size < n) set.add(Math.floor(Math.random() * lastDay) + 1);
            return [...set];
        };
        return {
            derma: pick(4 + Math.floor(Math.random() * 3)), // 4~6일
            stamp: pick(3 + Math.floor(Math.random() * 4)), // 외모 맘에 드는 날 3~6일
        };
    }, [year, month]);
}
