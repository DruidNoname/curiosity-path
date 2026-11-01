import ReactSelect, {Props, StylesConfig} from 'react-select';
import { useTheme } from '@mui/material/styles';
import React from "react";

interface OptionType {
    value: string;
    label: string;
}

type PropsSelect = Props<any, boolean> & {
    className?: string;
    /** Включить портал для меню */
    usePortal?: boolean;
    /** Кастомный target для портала (по умолчанию document.body) */
    portalTarget?: HTMLElement;
}

const Select: React.FC<PropsSelect> = (props) => {
    const {className, usePortal = true, portalTarget, ...selectProps} = props;
    const theme = useTheme();
    const generatedId = React.useId();

    const instanceId = props.instanceId || `select-${generatedId}`;

    // Цвета — только CSS-переменными (--color-*, см. features/theme). theme.palette при
    // cssVariables хранит значения схемы по умолчанию (тёмной) и не переключается вместе
    // со схемой: в светлой теме значение рисовалось почти белым по белому.
    const customStyles: StylesConfig<OptionType, false> = {
        control: (base, state) => ({
            ...base,
            minHeight: '40px',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: 'rgba(var(--color-background-paper-rgb), 0.5)',
            backdropFilter: 'blur(10px)',
            borderColor: state.isFocused
                ? 'var(--color-primary-main)'
                : 'rgba(var(--color-primary-main-rgb), 0.2)',
            boxShadow: state.isFocused
                ? '0 0 0 2px rgba(var(--color-primary-main-rgb), 0.125)'
                : 'none',
            '&:hover': {
                borderColor: 'var(--color-primary-main)'
            },
            transition: 'all 0.2s ease'
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? 'rgba(var(--color-primary-main-rgb), 0.125)'
                : state.isFocused
                    ? 'rgba(var(--color-primary-main-rgb), 0.19)'
                    : 'transparent',
            color: state.isSelected
                ? 'var(--color-primary-main)'
                : 'var(--color-text-primary)',
            backdropFilter: state.isFocused ? 'blur(4px)' : 'none',
            '&:hover': {
                backgroundColor: 'rgba(var(--color-primary-main-rgb), 0.19)'
            },
            '&:active': {
                backgroundColor: 'rgba(var(--color-primary-main-rgb), 0.25)'
            },
            cursor: 'pointer'
        }),
        menu: (base) => ({
            ...base,
            marginTop: '4px',
            backgroundColor: 'var(--color-background-paper)',
            backdropFilter: 'blur(30px)',
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[1],
            border: '1px solid rgba(var(--color-primary-main-rgb), 0.125)',
            zIndex: 1400 // Увеличиваем z-index для портала
        }),
        menuList: (base) => ({
            ...base,
            padding: theme.spacing(0.5, 0)
        }),
        singleValue: (base) => ({
            ...base,
            color: 'var(--color-text-primary)'
        }),
        placeholder: (base) => ({
            ...base,
            color: 'var(--color-text-secondary)'
        }),
        input: (base) => ({
            ...base,
            color: 'var(--color-text-primary)'
        }),
        indicatorSeparator: (base) => ({
            ...base,
            display: 'none'
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: state.isFocused
                ? 'var(--color-primary-main)'
                : 'var(--color-primary-light)',
            '&:hover': {
                color: 'var(--color-primary-main)'
            },
            transition: 'transform 0.2s',
            transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'none'
        }),
        clearIndicator: (base) => ({
            ...base,
            color: 'var(--color-primary-light)',
            '&:hover': {
                color: 'var(--color-error-main)'
            }
        })
    };

    return (
        <ReactSelect
            // @ts-ignore
            styles={customStyles}
            {...selectProps}
            className={className}
            instanceId={instanceId}
            menuPortalTarget={usePortal ? (portalTarget || document.body) : null}
            menuPosition={usePortal ? "fixed" : "absolute"}
        />
    );
};

export default Select;