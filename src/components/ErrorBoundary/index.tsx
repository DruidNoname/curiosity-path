// PostDay/SimpleErrorBoundary.tsx
'use client';

import React, { Component, ErrorInfo } from 'react';

interface Props {
    children: React.ReactNode;
    componentName: string;
    fallback?: React.ReactNode;
}

interface State {
    hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Логируем ошибку с именем компонента
        console.error(
            `🔥 Error in component: ${this.props.componentName}\n`,
            `Error: ${error.message}\n`,
            `Component Stack: ${errorInfo.componentStack}\n`,
            `Error Stack: ${error.stack}`
        );

        // Можно также отправить в сервис мониторинга
        // this.sendErrorToMonitoring(error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    minHeight: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <h2 style={{ color: '#d32f2f' }}>Ошибка!</h2>
                    <p>Что-то пошло не так. Пожалуйста, обновите страницу.</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            backgroundColor: '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Обновить страницу
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}