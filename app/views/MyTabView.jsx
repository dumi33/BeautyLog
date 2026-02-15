'use client'

function MyTabView() {
    return (
        <div className="my-page">
            {/* Profile Header */}
            <section className="my-profile">
                <div className="my-avatar-wrapper">
                    <div className="my-avatar">
                        <span className="my-avatar-emoji">👸</span>
                    </div>
                    <div className="my-level-badge">Lv.7</div>
                </div>
                <h2 className="my-username">뷰티 마스터</h2>
                <p className="my-bio">매일 더 아름다워지는 중 ✨</p>
            </section>

            {/* Beauty Stats */}
            <section className="my-stats">
                <h3 className="my-section-title">이번 달 뷰티 기록</h3>
                <div className="my-stats-grid">
                    <div className="my-stat-card" style={{ "--card-gradient": "linear-gradient(135deg, #f5e8e8 0%, #efe0e8 100%)" }}>
                        <div className="my-stat-icon">📝</div>
                        <div className="my-stat-value">12회</div>
                        <div className="my-stat-label">기록 횟수</div>
                    </div>
                    <div className="my-stat-card" style={{ "--card-gradient": "linear-gradient(135deg, #efe8f2 0%, #ebe0ed 100%)" }}>
                        <div className="my-stat-icon">🎯</div>
                        <div className="my-stat-value">87일</div>
                        <div className="my-stat-label">총 기록 일수</div>
                    </div>
                    <div className="my-stat-card" style={{ "--card-gradient": "linear-gradient(135deg, #e8f0eb 0%, #e5ede8 100%)" }}>
                        <div className="my-stat-icon">🔥</div>
                        <div className="my-stat-value">5일</div>
                        <div className="my-stat-label">연속 기록</div>
                    </div>
                </div>
            </section>

            {/* Recent Activity */}
            <section className="my-activity">
                <h3 className="my-section-title">최근 활동</h3>
                <ul className="my-activity-list">
                    <li className="my-activity-item">
                        <span className="my-activity-icon">✨</span>
                        <div className="my-activity-body">
                            <span className="my-activity-title">피부과 기록</span>
                            <span className="my-activity-date">2일 전</span>
                        </div>
                        <span className="my-activity-arrow">›</span>
                    </li>

                </ul>
            </section>

            {/* Settings Menu */}
            <section className="my-settings">
                <h3 className="my-section-title">설정</h3>
                <ul className="my-menu-list">
                    <li className="my-menu-item">
                        <span className="my-menu-icon">🔔</span>
                        <span className="my-menu-label">알림 설정</span>
                        <span className="my-menu-arrow">›</span>
                    </li>
                    <li className="my-menu-item">
                        <span className="my-menu-icon">👤</span>
                        <span className="my-menu-label">계정 관리</span>
                        <span className="my-menu-arrow">›</span>
                    </li>
                </ul>
            </section>
        </div>
    );
}

export default MyTabView;
