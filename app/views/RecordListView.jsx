'use client';

import styles from './RecordListView.module.css';
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
        <div className={styles.listScreen}>
            <header className={styles.listHeader}>
                <div className={styles.headerLeft}>
                    <button
                        type="button"
                        className={styles.backBtn}
                        onClick={onBack}
                        aria-label="뒤로 가기"
                    >
                        ‹
                    </button>
                    <h1 className={styles.listTitle}>{title}</h1>
                </div>

                <div className={styles.sortToggle}>
                    <button
                        className={`${styles.sortBtn} ${sortBy === 'created_at' ? styles.active : ''}`}
                        onClick={() => setSortBy('created_at')}
                    >
                        수정
                    </button>
                    <button
                        className={`${styles.sortBtn} ${sortBy === 'date' ? styles.active : ''}`}
                        onClick={() => setSortBy('date')}
                    >
                        시술
                    </button>
                </div>
            </header>

            <main className={styles.listMain}>
                {loading ? (
                    <div className={styles.listLoading}>기록 불러오는 중...</div>
                ) : !session ? (
                    <div className={styles.listEmpty}>
                        <p>로그인이 필요한 서비스입니다.</p>
                        <p>'MY' 탭 매뉴에서 로그인 후<br />나만의 시술 기록을 관리해보세요! ✨</p>
                    </div>
                ) : records.length === 0 ? (
                    <div className={styles.listEmpty}>
                        <p>아직 기록이 없습니다.</p>
                        <p>첫 기록을 남겨보세요! ✨</p>
                    </div>
                ) : (
                    <ul className={styles.recordList}>
                        {records.map((record) => (
                            <li
                                key={record.id}
                                className={`${styles.recordItemWrapper} ${swipedItemId === record.id ? styles.swiped : ''}`}
                                onTouchStart={(e) => onTouchStart(e, record.id)}
                                onTouchMove={(e) => onTouchMove(e, record.id)}
                            >
                                <div
                                    className={styles.recordItem}
                                    onClick={() => {
                                        if (swipedItemId === record.id) {
                                            setSwipedItemId(null);
                                        } else {
                                            onRecordClick?.(record);
                                        }
                                    }}
                                >
                                    <div className={styles.recordBody}>
                                        <div className={styles.recordMainInfo}>
                                            <strong className={styles.recordTitle}>{record.procedure_title || '일반 기록'}</strong>
                                            {record.hospital && <span className={styles.recordHospital}>{record.hospital}</span>}
                                        </div>
                                        <div className={styles.recordSideInfo}>
                                            <span className={styles.recordDateLabel}>{record.date.replace(/-/g, '.')}</span>
                                            {record.memo && (
                                                <span className={styles.recordMemoLine}>{record.memo}</span>
                                            )}
                                        </div>
                                    </div>
                                    <span className={styles.recordArrow}>›</span>
                                </div>
                                <button
                                    className={styles.recordDeleteBtn}
                                    onClick={(e) => handleDelete(e, record.id)}
                                    aria-label="기록 삭제"
                                >
                                    <span className={styles.deleteIconBg}>
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

