import {Box, Button, Typography} from "@mui/material";
import styles from "./style.module.css";
import Skeleton from "@/ui/Skeleton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import {useRouter} from "next/navigation";

type Props = {
    title: string;
    subtitle?: string;
    isLoading?: boolean;
    date?: string;
    tags?: any; //я ещё не решила, чем они будут приходить
    variant?: 'h2' |  'h3' |  'h4';
}
const SingleEntryTitle: React.FC<Props> = ({title, isLoading, date, tags, variant, subtitle}) => {
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
                    variant={variant ? variant : 'h1'}
                    component="h1"
                    className={styles.SingleEntryTitle}
                >
                    { isLoading ? <Skeleton width={320}/> : title }
                </Typography>
                { subtitle ? <Typography
                    variant="h4"
                    component="h2"
                    className={styles.SingleEntrySubtitle}> { subtitle } </Typography> : null }
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