import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/index.css'
import ClientLayout from './ClientLayout'
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
    title: 'Журнал открытой миру',
    description: 'Путевые заметки мирохода Curiosity',
}
interface RootLayoutProps {
    children: React.ReactNode
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
    return (
        <html lang="ru">
        <body className={inter.className}>
        <ErrorBoundary componentName={'RootLayout'}>
            <ClientLayout>
                {children}
            </ClientLayout>
        </ErrorBoundary>
        </body>
        </html>
    )
};

export default RootLayout