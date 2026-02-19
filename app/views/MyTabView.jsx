'use client';

import styles from './MyTabView.module.css';
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { supabase } from '@/lib/supabase';

function MyTabView({ onTabChange, onRecordClick }) {
    const { data: session, status } = useSession();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [recentRecords, setRecentRecords] = useState([]);

    // 최근 활동 데이터 가져오기 (마지막 3개)
    useEffect(() => {
        const fetchRecent = async () => {
            if (!session?.user?.email) {
                setRecentRecords([]); // 로그아웃 시 데이터 즉시 비우기
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('records')
                    .select('*')
                    .eq('user_email', session.user.email)
                    .order('date', { ascending: false })
                    .limit(3);

                if (error) throw error;
                setRecentRecords(data || []);
            } catch (error) {
                console.error('Error fetching recent records:', error);
            }
        };

        fetchRecent();
    }, [session]);

    // 날짜 상대 표기 (오늘, 1일 전 등)
    const formatRelativeDate = (dateStr) => {
        const target = new Date(dateStr);
        target.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const diffTime = today - target;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return '오늘';
        if (diffDays === 1) return '어제';
        if (diffDays < 7) return `${diffDays}일 전`;
        return dateStr.replace(/-/g, '.');
    };

    // 로그인 성공 시 Supabase에 사용자 정보 저장
    useEffect(() => {
        const saveUserToSupabase = async () => {
            if (session?.user) {
                const { error } = await supabase
                    .from('users')
                    .upsert({
                        email: session.user.email,
                        name: session.user.name,
                        avatar_url: session.user.image,
                    }, {
                        onConflict: 'email'
                    });

                if (error) {
                    console.error('Error saving user to Supabase:', error);
                } else {
                    console.log('User saved to Supabase successfully');
                }
            }
        };

        saveUserToSupabase();
    }, [session]);

    const handleGoogleLogin = () => {
        signIn('google');
    };

    const handleLogout = () => {
        signOut({ redirect: false });
    };

    return (
        <div className={styles.myPage}>
            {/* Profile Header */}
            <section className={styles.myProfile}>
                <div className={styles.myAvatarWrapper}>
                    <div className={styles.myAvatar}>
                        {session?.user?.image ? (
                            <img
                                src={session.user.image}
                                alt="프로필"
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        ) : (
                            <span className={styles.myAvatarEmoji}>👩‍🎨</span>
                        )}
                        {session && <span className={styles.onlineBadge}></span>}
                    </div>
                </div>

                <div className={styles.profileInfo}>
                    <h2 className={styles.myUsername}>
                        {session?.user?.name || 'Beauty Queen'}
                        {session && <span className={styles.userBadge}>
                            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </span>}
                    </h2>
                    {session && <p className={styles.userHandle}>@{session.user.email.split('@')[0]}</p>}
                    <p className={styles.myBio}>
                        {session ? "" : "로그인하고 당신만의 뷰티 히스토리를 관리하세요 ✨"}
                    </p>
                </div>
            </section>

            {/* Recent Activity */}
            <section className={styles.myActivity}>
                <h3 className={styles.mySectionTitle}>최근 활동</h3>
                <ul className={styles.myActivityList}>
                    {recentRecords.length > 0 ? (
                        recentRecords.map((record) => (
                            <li
                                key={record.id}
                                className={styles.myActivityItem}
                                onClick={() => onRecordClick?.(record)}
                            >
                                <span className={styles.myActivityIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                                        <path d="M12 3c.167 2.667 1.333 3.833 4 4-2.667.167-3.833 1.333-4 4-.167-2.667-1.333-3.833-4-4 2.667-.167 3.833-1.333 4-4Z" />
                                        <path d="M19 11c.125 2 .875 2.75 2.5 3-1.625.25-2.375 1-2.5 3-.125-2-.875-2.75-2.5-3 1.625-.25 2.375-1 2.5-3Z" />
                                        <path d="M5 13c.125 2 .875 2.75 2.5 3-1.625.25-2.375 1-2.5 3-.125-2-.875-2.75-2.5-3 1.625-.25 2.375-1 2.5-3Z" />
                                    </svg>
                                </span>
                                <div className={styles.myActivityBody}>
                                    <span className={styles.myActivityTitle}>{record.procedure_title || '일반 기록'}</span>
                                    <span className={styles.myActivityDate}>{formatRelativeDate(record.created_at)}</span>
                                </div>
                                <span className={styles.myActivityArrow}>›</span>
                            </li>
                        ))
                    ) : (
                        <li className={styles.myActivityEmpty}>
                            {session ? "최근 활동이 없습니다." : "로그인 후 기록을 확인하세요."}
                        </li>
                    )}
                </ul>
            </section>

            {/* Settings Menu */}
            <section className={styles.mySettings}>
                <h3 className={styles.mySectionTitle}>본인 인증 및 계정</h3>
                <ul className={styles.myMenuList}>
                    {!session ? (
                        <li className={styles.myMenuItem} onClick={() => setShowLoginModal(true)}>
                            <span className={styles.myMenuIcon}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <span className={styles.myMenuLabel}>로그인</span>
                            <span className={styles.myMenuArrow}>›</span>
                        </li>
                    ) : (
                        <li className={styles.myMenuItem} onClick={handleLogout}>
                            <span className={styles.myMenuIcon}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                            </span>
                            <span className={styles.myMenuLabel}>로그아웃</span>
                            <span className={styles.myMenuArrow}>›</span>
                        </li>
                    )}
                </ul>
            </section>

            {/* Google Login Modal */}
            {showLoginModal && (
                <div className={styles.modalOverlay} onClick={() => setShowLoginModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>로그인</h2>
                            <button
                                className={styles.modalClose}
                                onClick={() => setShowLoginModal(false)}
                                aria-label="닫기"
                            >
                                ✕
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <p className={styles.modalDescription}>뷰티로그에 로그인하고 기록을 동기화하세요</p>
                            <button className={styles.googleLoginBtn} onClick={handleGoogleLogin}>
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google 계정으로 로그인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyTabView;
