'use client'

import React from 'react'
import MainLayout from "@/components/Layouts/MainLayout"
import { QueryClientProvider } from '@/features/query'
import { ThemeProvider } from '@/features/theme'
import {getQueryClient} from "@/features/query/";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={ queryClient }>
            <ThemeProvider>
                <MainLayout>
                    {children}
                </MainLayout>
            </ThemeProvider>
        </QueryClientProvider>
    )
}