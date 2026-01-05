'use client'
import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';



const Home: React.FC = () => {
    return(
        <ErrorBoundary componentName={'Home'}>
            <p>Homie closely</p>
        </ErrorBoundary>
    )
}

export default Home;