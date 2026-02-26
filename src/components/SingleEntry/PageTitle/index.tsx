import {Box, Button, Typography} from "@mui/material";
import styles from "./style.module.css";
import Skeleton from "@/ui/Skeleton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import {useRouter} from "next/navigation";
import {getCleanEntry} from "@/helpers/utils";

type Props = {
    title: string;
    isLoading: boolean;
    actions?: any; //я ещё не решила, чем они будут приходить
}
const PageTitle: React.FC<Props> = ({title, isLoading, actions}) => {
    const router = useRouter();
    const [canGoBack, setCanGoBack] = React.useState(false);

    React.useEffect(() => {
        setCanGoBack(window.history.length > 1 && !!document.referrer);
    }, []);
    const handleGoBack = () => {
        if (canGoBack) {
            router.back();
        } else {
            router.push('/');
        }
    };

    return (
        <Box className={styles.PageTitleBlock}>
            <Box>
                <Typography
                    variant="h3"
                    component="h1"
                    className={styles.PageTitle}
                >
                    { isLoading ? <Skeleton width={320}/> : getCleanEntry(title) }
                </Typography>
                {actions ? <Typography
                    variant="body1"
                    component="div"> { `Запись от ${actions}` } </Typography> : null }
            </Box>
            <Button
                className={styles.BackButton}
                startIcon={<ArrowBackIcon/>}
                onClick={handleGoBack}
                variant="outlined"
            >
                {canGoBack ? 'Назад' : 'На главную'}
            </Button>
        </Box>
    );
};

export default PageTitle;