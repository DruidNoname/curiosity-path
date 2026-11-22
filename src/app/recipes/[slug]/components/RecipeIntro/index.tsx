import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import styles from "./style.module.css";
import {Box} from "@mui/material";
import {ImageBordered} from "@/components/Images";
import {useTheme} from "@mui/material/styles";
import {useMediaQuery} from "@mui/system";
import WpHtml from "@/ui/WpHtml";

interface RecipeIntroProps {
    imageUrl?: string;
    imageTitle?: string;
    recipePreview?: string;
}

const RecipeIntro: React.FC<RecipeIntroProps> = ({ imageUrl, imageTitle, recipePreview }) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <ErrorBoundary componentName="RecipeIntro">
            <Box component='div' sx={{display: {lg: 'flex'}, gap: '24px', mb: 4}} >
                {imageUrl && (
                    <ImageBordered src={ imageUrl } alt={ imageTitle || '' } classNameWrapper={styles.imageBox}/>
                )}
                {/* Описание приходит из WP Recipe Maker готовым HTML — очищает его WpHtml. */}
                {isDesktop && (
                    <WpHtml html={recipePreview} sx={{ flexGrow: '1' }} />
                )}
            </Box>
        </ErrorBoundary>
    );
};

export default RecipeIntro;
