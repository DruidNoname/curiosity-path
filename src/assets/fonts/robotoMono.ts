// src/fonts/robotoMono.ts
import localFont from 'next/font/local'

export const robotoMono = localFont({
    src: [
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
})
