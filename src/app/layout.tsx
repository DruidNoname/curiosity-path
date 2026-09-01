import type { Metadata } from 'next';
import '../styles/index.css';
import ClientLayout from './ClientLayout';
import { robotoMono } from '@/assets/fonts/robotoMono';
import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { urls } from '@/config/urls';
import { SITE_NAME, SITE_DESCRIPTION } from '@/config/site';

/**
 * Дефолтные метаданные и OG-теги для всего сайта.
 *
 * Мессенджеры (телеграм, вконтакте, вотсап) строят превью ссылки по HTML и НЕ
 * выполняют JavaScript, поэтому всё, что нужно превью, должно быть в разметке.
 * Страницы переопределяют это своим generateMetadata; `title.template`
 * подставляет их заголовок в «%s — Журнал открытой миру».
 *
 * `metadataBase` нужен, чтобы относительные пути картинок превращались в
 * абсолютные URL — иначе превью картинку не найдёт.
 */
export const metadata: Metadata = {
    metadataBase: new URL(urls.base),
    title: {
        default: SITE_NAME,
        template: `%s — ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    openGraph: {
        type: 'website',
        siteName: SITE_NAME,
        locale: 'ru_RU',
        url: urls.base,
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
    },
    twitter: {
        card: 'summary',
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
    },
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