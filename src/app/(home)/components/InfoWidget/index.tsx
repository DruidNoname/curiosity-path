import React from "react";
import styles from "./style.module.css";
import {Box, Card, Typography} from "@mui/material";
import ErrorBoundary from "@/components/ErrorBoundary";

type Props = {
    count: number;
}
const InfoWidget: React.FC<Props> = ( { count }) => {

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
                    <Typography
                        variant="body1"
                        component="p"
                    >
                        { `Всего постов: ${count}` }
                    </Typography>
                </Box>
            </Card>
        </ErrorBoundary>
    )
};

export default InfoWidget