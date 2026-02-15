'use client'

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { supabase } from '@/lib/supabase';

function MyTabView() {
    const { data: session, status } = useSession();
    const [showLoginModal, setShowLoginModal] = useState(false);

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
        signOut();
    };

    return (
        <div className="my-page">
            {/* Profile Header */}
            <section className="my-profile">
                <div className="my-avatar-wrapper">
                    <div className="my-avatar">
                        {session?.user?.image ? (
                            <img
                                src={session.user.image}
                                alt="프로필"
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        ) : (
                            <span className="my-avatar-emoji">👸</span>
                        )}
                    </div>
                    <div className="my-level-badge">Lv.7</div>
                </div>
                <h2 className="my-username">
                    {session?.user?.name || '뷰티 마스터'}
                </h2>
                <p className="my-bio">
                    {session ? `${session.user.email}` : '매일 더 아름다워지는 중 ✨'}
                </p>
            </section>

            {/* Recent Activity */}
            <section className="my-activity">
                <h3 className="my-section-title">최근 활동</h3>
                <ul className="my-activity-list">
                    <li className="my-activity-item">
                        <span className="my-activity-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                                <path d="M9 11l3 3L22 4" />
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                            </svg>
                        </span>
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
                    {!session ? (
                        <li className="my-menu-item" onClick={() => setShowLoginModal(true)}>
                            <span className="my-menu-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <span className="my-menu-label">로그인</span>
                            <span className="my-menu-arrow">›</span>
                        </li>
                    ) : (
                        <li className="my-menu-item" onClick={handleLogout}>
                            <span className="my-menu-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                            </span>
                            <span className="my-menu-label">로그아웃</span>
                            <span className="my-menu-arrow">›</span>
                        </li>
                    )}
                </ul>
            </section>

            {/* Google Login Modal */}
            {showLoginModal && (
                <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">로그인</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowLoginModal(false)}
                                aria-label="닫기"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="modal-description">뷰티로그에 로그인하고 기록을 동기화하세요</p>
                            <button className="google-login-btn" onClick={handleGoogleLogin}>
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
