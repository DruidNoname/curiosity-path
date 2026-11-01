'use client';

import React from 'react';
import MainLayout from "@/components/Layouts/MainLayout";
import { QueryClientProvider, makeQueryClient } from '@/features/query';
import { ThemeProvider } from '@/features/theme';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    // Ленивый инициализатор: QueryClient создаётся один раз на монтирование,
    // а не на каждый рендер.
    const [queryClient] = React.useState(makeQueryClient);

    return (
        <QueryClientProvider client={ queryClient }>
            <ThemeProvider>
                <MainLayout>
                    {children}
                </MainLayout>
            </ThemeProvider>
        </QueryClientProvider>
    );
}