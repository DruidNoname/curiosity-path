import React from 'react';
import { Box, BoxProps, styled } from '@mui/material';

// component зафиксирован как img; в MUI 7 BoxProps допускает любой ElementType и конфликтует с Box<'img'>
type Props = Omit<BoxProps<'img'>, 'component'> & {
    // добавьте свои дополнительные пропсы здесь, если нужно
};

// Создаем styled компонент
const ImageStyled = styled(Box<'img'>)({
    width: '100%',
    height: 'auto',
});

const Image: React.FC<Props> = (props) => {
    const { ...imageProps } = props;

    return (
        <ImageStyled
            component="img"
            {...imageProps}
        />
    );
};

export default Image;