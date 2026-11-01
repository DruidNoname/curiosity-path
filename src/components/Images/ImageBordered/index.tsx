import React from "react";
import styles from './style.module.css';
import Image from "@/ui/Image";
import {Box, BoxProps} from "@mui/material";

type Props = BoxProps<'img'> & {
    classNameWrapper?: string;
    /** Обязателен: для декоративной картинки — пустая строка. */
    alt: string;
};
export const ImageBordered: React.FC<Props> = (props) => {
    const { classNameWrapper, className, alt, ...imageProps } = props;

    return (
        <Box className={[styles.ImageWrapper, classNameWrapper].join(' ')}>
            <Image className={[styles.Image, className].filter(Boolean).join(' ')} alt={alt} {...imageProps}/>
        </Box>
    );
};
