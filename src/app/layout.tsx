import type { Metadata } from 'next';
import '../styles/index.css';
import ClientLayout from './ClientLayout';
import { robotoMono } from '@/assets/fonts/robotoMono';
import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

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
        {/*
          Блокирующий скрипт MUI: выставляет data-theme на <html> ДО первой отрисовки,
          исходя из сохранённого режима / системной темы. Должен идти первым в <body>.
          attribute='data-theme' совпадает с colorSchemeSelector в theme.ts.
        */}
        <InitColorSchemeScript attribute="data-theme" defaultMode="system" />
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