'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';

function RecordListView({ title, onBack, onRecordClick }) {
    const { data: session } = useSession();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [swipedItemId, setSwipedItemId] = useState(null);
    const [touchStart, setTouchStart] = useState(null);
    const [sortBy, setSortBy] = useState('created_at'); // 'created_at' 또는 'date'

    const fetchRecords = async () => {
        if (!session?.user?.email) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('records')
                .select('*')
                .eq('user_email', session.user.email)
                .order(sortBy, { ascending: false });

            if (error) throw error;
            setRecords(data || []);
        } catch (error) {
            console.error('Error fetching records:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [session?.user?.email, sortBy]);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        console.log("Deleting record:", id);
        if (!confirm("정말 이 기록을 삭제하시겠습니까?")) {
            setSwipedItemId(null);
            return;
        }

        try {
            const { error } = await supabase
                .from('records')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Supabase delete error:', error);
                throw error;
            }

            console.log("Delete successful for id:", id);
            setRecords(prev => prev.filter(r => r.id !== id));
            setSwipedItemId(null);
        } catch (error) {
            console.error('Error deleting record:', error);
            alert("삭제 중 오류가 발생했습니다. (권한 문제일 수 있습니다)");
        }
    };

    const onTouchStart = (e, id) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e, id) => {
        if (!touchStart) return;
        const currentTouch = e.targetTouches[0].clientX;
        const diff = touchStart - currentTouch;

        if (diff > 50) { // 50px 이상 슬라이드 시
            setSwipedItemId(id);
        } else if (diff < -50) {
            setSwipedItemId(null);
        }
    };

    return (
        <div className="list-screen">
            <header className="list-header">
                <div className="header-left">
                    <button
                        type="button"
                        className="back-btn"
                        onClick={onBack}
                        aria-label="뒤로 가기"
                    >
                        ‹
                    </button>
                    <h1 className="list-title">{title}</h1>
                </div>

                <div className="sort-toggle">
                    <button
                        className={`sort-btn ${sortBy === 'created_at' ? 'active' : ''}`}
                        onClick={() => setSortBy('created_at')}
                    >
                        수정
                    </button>
                    <button
                        className={`sort-btn ${sortBy === 'date' ? 'active' : ''}`}
                        onClick={() => setSortBy('date')}
                    >
                        시술
                    </button>
                </div>
            </header>

            <main className="list-main">
                {loading ? (
                    <div className="list-loading">기록 불러오는 중...</div>
                ) : !session ? (
                    <div className="list-empty">
                        <p>로그인이 필요한 서비스입니다.</p>
                        <p>'MY' 탭 매뉴에서 로그인 후<br />나만의 시술 기록을 관리해보세요! ✨</p>
                    </div>
                ) : records.length === 0 ? (
                    <div className="list-empty">
                        <p>아직 기록이 없습니다.</p>
                        <p>첫 기록을 남겨보세요! ✨</p>
                    </div>
                ) : (
                    <ul className="record-list">
                        {records.map((record) => (
                            <li
                                key={record.id}
                                className={`record-item-wrapper ${swipedItemId === record.id ? 'swiped' : ''}`}
                                onTouchStart={(e) => onTouchStart(e, record.id)}
                                onTouchMove={(e) => onTouchMove(e, record.id)}
                            >
                                <div
                                    className="record-item"
                                    onClick={() => {
                                        if (swipedItemId === record.id) {
                                            setSwipedItemId(null);
                                        } else {
                                            onRecordClick?.(record);
                                        }
                                    }}
                                >
                                    <div className="record-body">
                                        <div className="record-main-info">
                                            <strong className="record-title">{record.procedure_title || '일반 기록'}</strong>
                                            {record.hospital && <span className="record-hospital">{record.hospital}</span>}
                                        </div>
                                        <div className="record-side-info">
                                            <span className="record-date-label">{record.date.replace(/-/g, '.')}</span>
                                            {record.memo && (
                                                <span className="record-memo-line">{record.memo}</span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="record-arrow">›</span>
                                </div>
                                <button
                                    className="record-delete-btn"
                                    onClick={(e) => handleDelete(e, record.id)}
                                    aria-label="기록 삭제"
                                >
                                    <span className="delete-icon-bg">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
}

export default RecordListView;

