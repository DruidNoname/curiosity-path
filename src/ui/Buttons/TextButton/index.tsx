import React from "react";
import MuiButton, { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';

/** Имя нужно, чтобы кнопка могла достать надпись селектором на ховере. */
const LABEL_CLASS = 'TextButton-label';

/**
 * Кнопка, которая выглядит обычным текстом: без обводки, капса и разрядки, прижата
 * к левому краю. Под основной надписью может стоять мелкая подпись (`hint`).
 *
 * Стили завёрнуты в `&&`: тема задаёт кнопкам капс, разрядку и полужирный тем же
 * весом селектора, и без подъёма специфичности исход зависел бы от того, чей класс
 * эмоушен вставит в <head> последним.
 */
const StyledButton = styled(MuiButton, {
    shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ selected }) => ({
    '&&': {
        justifyContent: 'flex-start',
        textAlign: 'left',
        textTransform: 'none',
        letterSpacing: 'normal',
        fontWeight: 400,
        lineHeight: 1.3,
        // Паддинга нет: иначе надпись уезжает относительно текста, рядом с которым
        // кнопка стоит.
        padding: '0',
        minWidth: 0,
        color: selected ? 'var(--color-primary-main)' : 'var(--color-text-primary)',
        // Ни подложки, ни подскока из темы: единственная реакция на ховер — подчёркивание.
        '&:hover': {
            backgroundColor: 'transparent',
            transform: 'none',
        },
        // Подчёркивается только надпись: подсказка остаётся спокойной.
        [`&:hover .${LABEL_CLASS}`]: {
            textDecorationColor: 'currentColor',
        },
        [`&:focus-visible .${LABEL_CLASS}`]: {
            textDecorationColor: 'currentColor',
        },
    },
}));

const Content = styled('span')({
    display: 'block',
});

// Размеры берутся из типографики темы: styled(Typography) не годится — обёртка теряет
// полиморфный `component`, а внутри кнопки нужны именно инлайновые элементы.
const Label = styled('span', {
    shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
    ...theme.typography.body2,
    display: 'block',
    fontWeight: selected ? 600 : 400,
    // Подчёркивание есть всегда, но прозрачное: так оно плавно проявляется по ховеру
    // и при этом не дёргает вёрстку, как появляющийся border.
    textDecoration: 'underline',
    textDecorationColor: 'transparent',
    textUnderlineOffset: '2px',
    transition: 'text-decoration-color 0.2s ease',
}));

const Hint = styled('span')(({ theme }) => ({
    ...theme.typography.caption,
    display: 'block',
    opacity: 0.75,
}));

export type TextButtonProps = Omit<ButtonProps, 'variant'> & {
    /** Мелкая подпись под надписью — например, что кнопка подставит. */
    hint?: string;
    /** Выбранное состояние: акцентный цвет и полужирная надпись. */
    selected?: boolean;
};

const TextButton = React.forwardRef<HTMLButtonElement, TextButtonProps>((
    { children, hint, selected, ...rest },
    ref,
) => (
    // forwardRef нужен, чтобы кнопку можно было обернуть в Tooltip: он позиционируется по ref.
    <StyledButton ref={ref} variant={'text'} selected={selected} {...rest}>
        <Content>
            <Label className={LABEL_CLASS} selected={selected}>{children}</Label>
            {hint ? <Hint>{hint}</Hint> : null}
        </Content>
    </StyledButton>
));

TextButton.displayName = 'TextButton';

export default TextButton;
