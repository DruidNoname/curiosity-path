import React from "react";
import styles from "./style.module.css";
import {Box} from "@mui/material";
import {ImageBordered} from "@/components/Images";
import WpHtml from "@/ui/WpHtml";


type Props = {
    /** Сырой анонс из WP: очистку делает WpHtml. */
    excerpt?: string;
    title: string;
    image?: string;
}
export const Excerpt: React.FC<Props> = ({ excerpt, image, title }) => {

    return(
        image ?
                <Box className={ styles.excerpt }>
                    <ImageBordered
                        src={ image }
                        alt={ title }
                        classNameWrapper={styles.ImageBox}
                        sx={{float: 'left'}}
                    />
                    <WpHtml html={excerpt} variant="body1" />
                    <div className={ styles.clear }></div>
                </Box>
                :
                <WpHtml html={excerpt} variant="body1" />
    );
};