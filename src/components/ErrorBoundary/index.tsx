'use client';

import React, { Component, ErrorInfo } from 'react';
import ErrorFallback from './Fallback';

interface Props {
    children: React.ReactNode;
    /** Имя для диагностики: попадает в консоль вместе с ошибкой. Указывать всегда. */
    componentName: string;
    /** Свой запасной экран вместо стандартного. */
    fallback?: React.ReactNode;
}

interface State {
    error: Error | null;
}

/**
 * Граница ошибок: упавший рендер внутри неё заменяется запасным экраном, а не роняет
 * всё приложение. Ловит только ошибки рендера; ошибки запросов React Query страницы
 * показывают сами.
 */
export default class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(
            `🔥 Error in component: ${this.props.componentName}\n`,
            `Error: ${error.message}\n`,
            `Component Stack: ${errorInfo.componentStack}\n`,
            `Error Stack: ${error.stack}`
        );
    }

    // Сброс вместо перезагрузки: содержимое отрисуется заново, а кеш запросов, тема и
    // остальная страница останутся как были.
    private reset = () => this.setState({ error: null });

    render() {
        if (this.state.error) {
            return this.props.fallback ?? <ErrorFallback error={this.state.error} onRetry={this.reset}/>;
        }

        return this.props.children;
    }
}
