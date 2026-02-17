import {Box, Button, Typography} from "@mui/material";
import styles from "./style.module.css";
import Skeleton from "@/ui/Skeleton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import {useRouter} from "next/navigation";

type Props = {
    title: string;
    isLoading: boolean;
    date?: string;
    tags?: any; //я ещё не решила, чем они будут приходить
}
const SingleEntryTitle: React.FC<Props> = ({title, isLoading, date, tags}) => {
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
        <Box className={styles.SingleEntryTitleBlock}>
            <Box>
                <Typography
                    variant="h1"
                    component="h1"
                    className={styles.SingleEntryTitle}
                >
                    { isLoading ? <Skeleton width={320}/> : title }
                </Typography>
                {date ? <Typography
                    variant="body1"
                    component="div"> { `Запись от ${date}` } </Typography> : null }
                {tags ? <Typography
                    variant="body1"
                    component="div"> { `Теги: ${tags}` } </Typography> : null }

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

export default SingleEntryTitle;