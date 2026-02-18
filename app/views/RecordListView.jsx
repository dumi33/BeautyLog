'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';

function RecordListView({ title, onBack, onRecordClick }) {
    const { data: session } = useSession();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecords = async () => {
            if (!session?.user?.email) return;

            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('records')
                    .select('*')
                    .eq('user_email', session.user.email)
                    .order('date', { ascending: false });

                if (error) throw error;
                setRecords(data || []);
            } catch (error) {
                console.error('Error fetching records:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, [session?.user?.email]); // 세션 정보가 로드되면 데이터를 가져오도록 수정

    return (
        <div className="list-screen">
            <header className="list-header">
                <h1 className="list-title">{title}</h1>
            </header>
            <main className="list-main">
                {loading ? (
                    <div className="list-loading">기록 불러오는 중...</div>
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
                                className="record-item"
                                onClick={() => onRecordClick?.(record)}
                            >
                                <div className="record-body">
                                    <div className="record-main-info">
                                        <strong className="record-title">{record.procedure_title || '일반 기록'}</strong>
                                        {record.hospital && <span className="record-hospital">{record.hospital}</span>}
                                    </div>
                                    <div className="record-sub-info">
                                        <span className="record-date-label">{record.date.replace(/-/g, '.')}</span>
                                        {record.memo && (
                                            <span className="record-memo-line">{record.memo}</span>
                                        )}
                                    </div>
                                </div>
                                <span className="record-arrow">›</span>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
}

export default RecordListView;

