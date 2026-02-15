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

export default TopBar;
