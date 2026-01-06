import type { Metadata } from 'next'
import '../styles/index.css'
import ClientLayout from './ClientLayout'
import ErrorBoundary from "@/components/ErrorBoundary";
import { robotoMono } from '@/assets/fonts/robotoMono';

export const metadata: Metadata = {
    title: 'Журнал открытой миру',
    description: 'Путевые заметки мирохода Curiosity',
}
interface RootLayoutProps {
    children: React.ReactNode
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
    return (
        <html lang="ru" className={robotoMono.variable}>
        <body>
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