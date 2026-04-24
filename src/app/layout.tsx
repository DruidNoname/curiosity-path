import type { Metadata } from 'next';
import '../styles/index.css';
import ClientLayout from './ClientLayout';
import { robotoMono } from '@/assets/fonts/robotoMono';
import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";

export const metadata: Metadata = {
    title: 'Журнал открытой миру',
    description: 'Путевые заметки мирохода Curiosity',
};
interface RootLayoutProps {
    children: React.ReactNode
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
    return (
        <html lang="ru" className={robotoMono.variable} suppressHydrationWarning>
        <body>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme-mode');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})()` }} />
        <AppRouterCacheProvider>
            <ClientLayout>
                {children}
            </ClientLayout>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
};

export default RootLayout;