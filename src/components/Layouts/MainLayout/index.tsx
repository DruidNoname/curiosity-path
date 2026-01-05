import React from 'react';
import styles from './style.module.css';
import ErrorBoundary from '@/components/ErrorBoundary';
import {
    Box, Container
} from '@mui/material';
import Header from '@/components/Header';
import Footer from "@/components/Footer";

type Props = {
    children: React.ReactNode;
}

const MainLayout: React.FC<Props> = ({ children }) => {
    // const location = useLocation();

    return (
        <ErrorBoundary componentName={'MainLayout'}>

            <Box className={styles.MainLayout}>
                <Header title={'Журнал открытой миру'}/>
                <Container maxWidth="lg" className={styles.Content}>
                    {children}
                </Container>
                <Footer copyright={`© ${new Date().getFullYear()} Журнал открытой миру `}/>
            </Box>
        </ErrorBoundary>
    );
};

export default MainLayout;
