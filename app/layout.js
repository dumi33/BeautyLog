import './globals.css'
import SessionProvider from './components/SessionProvider'

export const metadata = {
    title: '뷰티로그',
    description: '여성을 위한 뷰티 기록',
}

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
            <body>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </body>
        </html>
    )
}
