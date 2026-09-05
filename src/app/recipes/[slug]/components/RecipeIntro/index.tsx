import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import styles from "./style.module.css";
import {Box} from "@mui/material";
import {ImageBordered} from "@/components/Images";
import {useTheme} from "@mui/material/styles";
import {useMediaQuery} from "@mui/system";
import {getCleanEntry} from "@/helpers/wp-html";

interface RecipeIntroProps {
    imageUrl?: string;
    imageTitle?: string;
    recipePreview?: string;
}

const RecipeIntro: React.FC<RecipeIntroProps> = ({ imageUrl, imageTitle, recipePreview }) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    // Описание приходит из WP Recipe Maker готовым HTML и уходит в dangerouslySetInnerHTML —
    // санитизация обязательна. getCleanEntry дорогой, мемоизируем по входу.
    const preview = React.useMemo(() => getCleanEntry(recipePreview || ''), [recipePreview]);

    return (
        <ErrorBoundary componentName="RecipeIntro">
            <Box component='div' sx={{display: {lg: 'flex'}, gap: '24px', mb: 4}} >
                {imageUrl && (
                    <ImageBordered src={ imageUrl } alt={ imageTitle || '' } classNameWrapper={styles.imageBox}/>
                )}
                {(isDesktop && preview) && (
                    <Box component='div'
                        sx={{ flexGrow: '1' }}
                        dangerouslySetInnerHTML={{ __html: preview }}
                    />
                )}
            </Box>
        </ErrorBoundary>
    );
};

export default RecipeIntro;
