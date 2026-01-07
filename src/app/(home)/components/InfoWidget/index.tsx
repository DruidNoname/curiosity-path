import React from "react";
import styles from "./style.module.css";
import {Box, Card, Typography} from "@mui/material";
import ErrorBoundary from "@/components/ErrorBoundary";
import Skeleton from "@/ui/Skeleton";

type Props = {
    count: number;
    isLoading: boolean;
    isError: boolean;
}
const InfoWidget: React.FC<Props> = ( { count, isLoading, isError }) => {

    return (
        <ErrorBoundary componentName={'InfoWidget'}>
            <Card className={styles.InfoWidget}>
                <Box sx={{typography: 'body1'}}>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{mb: 2}}
                    >
                        Журнал открытой миру
                    </Typography>
                    <Typography
                        variant="h5"
                        component="h2"
                        sx={{mb: 5}}
                    >
                        Путевые заметки мирохода Curiosity
                    </Typography>
                    <Typography variant="body1" component="p">
                        {isLoading ? (
                            <Skeleton width={200} sx={{ ml: 'auto' }}/>
                        ) : isError ? (
                            'У самурая нет цели... Только ожидание бека.'
                        ) : (
                            `Всего постов: ${count}`
                        )}
                    </Typography>
                </Box>
            </Card>
        </ErrorBoundary>
    )
};

export default InfoWidget