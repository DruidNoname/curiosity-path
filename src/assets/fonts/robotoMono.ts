// src/fonts/robotoMono.ts
import localFont from 'next/font/local';

export const robotoMono = localFont({
    src: [
        {
            path: './RobotoMono-Light.woff2',
            weight: '300',
            style: 'normal',
        },
        {
            path: './RobotoMono-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: './RobotoMono-Medium.woff2',
            weight: '500',
            style: 'normal',
        },
        {
            path: './RobotoMono-SemiBold.woff2',
            weight: '600',
            style: 'normal',
        },
        {
            path: './RobotoMono-Bold.woff2',
            weight: '700',
            style: 'normal',
        },
        // Fallback в TTF формате для совместимости
        {
            path: './RobotoMono-Light.ttf',
            weight: '300',
            style: 'normal',
        },
        {
            path: './RobotoMono-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: './RobotoMono-Medium.ttf',
            weight: '500',
            style: 'normal',
        },
        {
            path: './RobotoMono-SemiBold.ttf',
            weight: '600',
            style: 'normal',
        },
        {
            path: './RobotoMono-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
    ],
    variable: '--font-roboto-mono',
    display: 'swap',
});