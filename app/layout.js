import './globals.css'

export const metadata = {
    title: '뷰티로그',
    description: '여성을 위한 뷰티 기록',
}

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
            <body>{children}</body>
        </html>
    )
}
