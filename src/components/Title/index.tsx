import {Box, Button, Typography} from "@mui/material";
import styles from "./style.module.css";
import Skeleton from "@/ui/Skeleton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import {useRouter} from "next/navigation";

type Props = {
    title: string;
    variant?: 'h2' |  'h1' |  'h4';
    subtitle?: string;
}
const Title: React.FC<Props> = ({title, variant, subtitle}) => {
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
        <Box className={styles.TitleBlock}>
            <Box>
                <Typography
                    variant={variant ? variant : 'h3'}
                    component="h1"
                    className={styles.Title}
                >
                    { title }
                </Typography>
                { subtitle ? <Typography
                    variant="h4"
                    component="h2"
                    className={styles.Subtitle}> { subtitle } </Typography> : null }
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

export default Title;