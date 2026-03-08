import React from "react";
import styles from "./style.module.css";
import {Box, Typography} from "@mui/material";
import {ImageBordered} from "@/components/Images";


type Props = {
    excerpt: string;
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
                    <Typography
                        variant="body1"
                        component="div"
                        dangerouslySetInnerHTML={{__html: excerpt}}
                    />
                    <div className={ styles.clear }></div>
                </Box>
                :
                <Typography
                    variant="body1"
                    component="div"
                    dangerouslySetInnerHTML={{__html: excerpt}}
                />
    );
};