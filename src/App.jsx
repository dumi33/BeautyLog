import { useState, useMemo, useEffect } from "react";
import "./App.css";

// 월별로 랜덤 기록일 생성 (년·월이 바뀔 때만 재계산)
function useRandomRecordDays(year, month) {
  return useMemo(() => {
    const lastDay = new Date(year, month + 1, 0).getDate();
    const pick = (n) => {
      const set = new Set();
      while (set.size < n) set.add(Math.floor(Math.random() * lastDay) + 1);
      return [...set];
    };
    return {
      derma: pick(4 + Math.floor(Math.random() * 3)), // 4~6일
      salon: pick(3 + Math.floor(Math.random() * 3)), // 3~5일
      lash: pick(2 + Math.floor(Math.random() * 2)), // 2~3일
      stamp: pick(3 + Math.floor(Math.random() * 4)), // 외모 맘에 드는 날 3~6일
    };
  }, [year, month]);
}

const MENU_ITEMS = [
  {
    id: "derma",
    title: "피부과 기록",
    description: "시술·처방·피부 상태를 한곳에",
    icon: "✨",
    gradient: "linear-gradient(135deg, #f5e8e8 0%, #efe0e8 100%)",
    accent: "#d4a5a5",
  },
  {
    id: "salon",
    title: "미용실 기록",
    description: "컷·펌·염색·관리 이력",
    icon: "💇‍♀️",
    gradient: "linear-gradient(135deg, #efe8f2 0%, #ebe0ed 100%)",
    accent: "#c4a8d4",
  },
  {
    id: "lash",
    title: "속눈썹·펍 기록",
    description: "리프팅·펌·관리 일정",
    icon: "👁️",
    gradient: "linear-gradient(135deg, #e8f0eb 0%, #e5ede8 100%)",
    accent: "#a8c4b0",
  },
  {
    id: "sport",
    title: "필라테스/테니스/헬스 기록",
    description: "운동·수업·회차 기록",
    icon: "🏃",
    gradient: "linear-gradient(135deg, #e3f2f4 0%, #dceef0 100%)",
    accent: "#6eb5c4",
  },
];

// 샘플 기록 리스트
const DERMA_RECORDS = [
  { id: 1, date: "2025.02.14", title: "레이저 토닝", memo: "광채 개선 목적" },
  { id: 2, date: "2025.02.07", title: "피부 스케일링", memo: "각질 관리" },
  { id: 3, date: "2025.01.28", title: "보톡스", memo: "이마 주름" },
  { id: 4, date: "2025.01.15", title: "필러 시술", memo: "턱라인" },
];

const SALON_RECORDS = [
  { id: 1, date: "2025.02.12", title: "컷 + 펌", memo: "웨이브 펌" },
  { id: 2, date: "2025.01.28", title: "염색", memo: "브라운 톤" },
  { id: 3, date: "2025.01.10", title: "트리트먼트", memo: "손상 모발 관리" },
];

const LASH_RECORDS = [
  { id: 1, date: "2025.02.10", title: "속눈썹 리프팅", memo: "펌 + 염색" },
  { id: 2, date: "2025.01.20", title: "속눈썹 펌", memo: "6주 후 재시술" },
];

const SPORT_RECORDS = [
  { id: 1, date: "2025.02.13", title: "필라테스", memo: "매트 1시간" },
  { id: 2, date: "2025.02.10", title: "헬스", memo: "상체" },
  { id: 3, date: "2025.02.05", title: "테니스", memo: "1세트" },
];

const RECORD_SAMPLE_BY_TYPE = {
  derma: DERMA_RECORDS,
  salon: SALON_RECORDS,
  lash: LASH_RECORDS,
  sport: SPORT_RECORDS,
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const TYPE_LABELS = {
  derma: "피부과 기록",
  salon: "미용실 기록",
  lash: "속눈썹·펍 기록",
  sport: "필라테스/테니스/헬스 기록",
  stamp: "외모 맘에 드는 날",
};

const TAB_ITEMS = [
  { id: "home", label: "홈", icon: "⌂" },
  { id: "record", label: "기록", icon: "▤" },
  { id: "mission", label: "미션", icon: "★" },
  { id: "news", label: "소식", icon: "◇" },
  { id: "my", label: "마이", icon: "👤" },
];

// 예뻐지는 비법 리스트
const BEAUTY_TIPS = [
  {
    id: 1,
    title: "매일 아침 물 2잔 공복에 마시기",
    desc: "몸의 노폐물을 씻어내고 피부 탄력에 도움",
  },
  {
    id: 2,
    title: "자기 30분 전 스마트폰 끄기",
    desc: "푸른빛 차단으로 피부 휴식·멜라토닌 분비",
  },
  {
    id: 3,
    title: "선크림 아침 루틴에 꼭 넣기",
    desc: "자외선 차단이 미백·주름 예방의 기본",
  },
  { id: 4, title: "하루 1번 스트레칭 10분", desc: "혈액순환과 얼굴 붓기 완화" },
  {
    id: 5,
    title: "밤에 꼭 세안하고 수분 크림",
    desc: "잠드는 동안 피부 재생 돕기",
  },
  { id: 6, title: "당·짠 음식 줄이기", desc: "피부 염증·붓기 예방" },
  {
    id: 7,
    title: "이번 주 헤어/피부 기록 1번 남기기",
    desc: "꾸준한 기록이 습관이 됩니다",
  },
];

function TopBar() {
  return (
    <header className="top-bar">
      <div className="top-bar-brand">
        <span className="top-bar-logo-icon" aria-hidden>
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 6v16M16 10c-5-2-10 0-10 6s2 8 10 8 10-2 10-8-5-8-10-6"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M16 10c5-2 10 0 10 6s-2 8-10 8-10-2-10-8 5-8 10-6"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </span>
        <h1 className="top-bar-logo">뷰티로그</h1>
      </div>
      <button type="button" className="top-bar-menu" aria-label="메뉴">
        <span className="hamburger" />
        <span className="hamburger" />
        <span className="hamburger" />
      </button>
    </header>
  );
}

function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav">
      {TAB_ITEMS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`bottom-nav-item ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="bottom-nav-icon">{tab.icon}</span>
          <span className="bottom-nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

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

  const recordDays = useRandomRecordDays(year, month);

  useEffect(() => setSelectedDate(null), [year, month]);

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
    if (recordDays.salon.includes(d)) types.push("salon");
    if (recordDays.lash.includes(d)) types.push("lash");
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
              className={`calendar-day ${d === null ? "empty" : ""} ${
                isToday(d) ? "today" : ""
              } ${selectedDate && d === selectedDate.day ? "selected" : ""} ${
                showStamp ? "has-stamp" : ""
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

function HomeView({ onMenuClick }) {
  const [hovered, setHovered] = useState(null);

  return (
    <>
      <main className="main home-main">
        <Calendar />
        <p className="main-desc">오늘은 어떤 기록을 남길까요?</p>
        <ul className="menu-list">
          {MENU_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                className={`menu-card ${hovered === item.id ? "hover" : ""}`}
                style={{
                  "--card-gradient": item.gradient,
                  "--card-accent": item.accent,
                }}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onMenuClick(item.id)}
              >
                <span
                  className="menu-icon"
                  style={{ background: item.gradient }}
                >
                  {item.icon}
                </span>
                <div className="menu-text">
                  <span className="menu-title">{item.title}</span>
                  <span className="menu-desc">{item.description}</span>
                </div>
                <span className="menu-arrow">→</span>
              </button>
            </li>
          ))}
        </ul>
      </main>
      <footer className="footer">
        <p>토스인앱 · 여성을 위한 뷰티 기록</p>
      </footer>
    </>
  );
}

function RecordListView({ title, records, onBack }) {
  return (
    <div className="list-screen">
      <header className="list-header">
        <button
          type="button"
          className="back-btn"
          onClick={onBack}
          aria-label="뒤로 가기"
        >
          ‹
        </button>
        <h1 className="list-title">{title}</h1>
      </header>
      <main className="list-main">
        <ul className="record-list">
          {records.map((record) => (
            <li key={record.id} className="record-item">
              <span className="record-date">{record.date}</span>
              <div className="record-body">
                <strong className="record-title">{record.title}</strong>
                {record.memo && (
                  <span className="record-memo">{record.memo}</span>
                )}
              </div>
              <span className="record-arrow">›</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

const LIST_VIEWS = {
  "derma-list": { title: "피부과 기록", records: DERMA_RECORDS },
  "salon-list": { title: "미용실 기록", records: SALON_RECORDS },
  "lash-list": { title: "속눈썹·펍 기록", records: LASH_RECORDS },
  "sport-list": { title: "필라테스/테니스/헬스 기록", records: SPORT_RECORDS },
};

function RecordTabView() {
  return (
    <div className="tab-placeholder">
      <p>전체 기록을 한눈에 볼 수 있어요</p>
    </div>
  );
}

function MissionTabView() {
  return (
    <div className="mission-tab">
      <p className="mission-intro">매일 조금씩 실천해 보세요</p>
      <ul className="mission-list">
        {BEAUTY_TIPS.map((tip) => (
          <li key={tip.id} className="mission-item">
            <span className="mission-num">{tip.id}</span>
            <div className="mission-body">
              <strong className="mission-title">{tip.title}</strong>
              <span className="mission-desc">{tip.desc}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewsTabView() {
  return (
    <div className="tab-placeholder">
      <p>소식이 여기 모여요</p>
    </div>
  );
}

function MyTabView() {
  return (
    <div className="tab-placeholder">
      <p>마이페이지</p>
    </div>
  );
}

function App() {
  const [tab, setTab] = useState("home");
  const [view, setView] = useState("home");

  const isListScreen = LIST_VIEWS[view];

  return (
    <div className="app-layout">
      <TopBar />
      <div className="app-content">
        {isListScreen ? (
          <RecordListView
            title={LIST_VIEWS[view].title}
            records={LIST_VIEWS[view].records}
            onBack={() => setView("home")}
          />
        ) : tab === "home" ? (
          <HomeView onMenuClick={(id) => setView(`${id}-list`)} />
        ) : tab === "record" ? (
          <RecordTabView />
        ) : tab === "mission" ? (
          <MissionTabView />
        ) : tab === "news" ? (
          <NewsTabView />
        ) : (
          <MyTabView />
        )}
      </div>
      <BottomNav activeTab={tab} onTabChange={setTab} />
    </div>
  );
}

export default App;
