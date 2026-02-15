'use client'

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

export default RecordListView;
