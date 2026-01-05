'use client'

import React from 'react'
import MainLayout from "@/components/Layouts/MainLayout"
import { QueryClientProvider } from '@/lib/query'
import { ThemeProvider } from '@/lib/theme'
import {getQueryClient} from "@/lib/query/";

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