'use client'

import React from 'react'
import MainLayout from "@/components/Layouts/MainLayout"
import { QueryClientProvider } from '@/lib/query'
import { ThemeProvider } from '@/lib/theme'
import queryClient from "@/lib/query/queryClient";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
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