import React from "react";
import styles from './style.module.css';
import Image from "@/ui/Image";
import {Box, BoxProps} from "@mui/material";

type Props = BoxProps<'img'> & {
    classNameWrapper?: string;
    sign: string;
    /** Обязателен: для декоративной картинки — пустая строка. */
    alt: string;
};
export const ImageSigned: React.FC<Props> = (props) => {
    const { classNameWrapper, sign, alt, ...imageProps } = props;

    return (
        <Box className={[styles.ImageWrapper, classNameWrapper].join(' ')} component={"figure"}>
            <Image className={styles.Image} alt={alt} {...imageProps}/>
            <figcaption id="" className="wp-caption-text">
                {sign}
            </figcaption>
        </Box>
    );
};
