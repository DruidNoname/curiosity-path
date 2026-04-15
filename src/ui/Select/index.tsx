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

    const customStyles: StylesConfig<OptionType, false> = {
        control: (base, state) => ({
            ...base,
            minHeight: '40px',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: 'var(--color-background-paper-rgb)',
            backdropFilter: 'blur(10px)',
            borderColor: state.isFocused
                ? theme.palette.primary.main
                : 'rgba(var(--color-primary-main-rgb), 0.2)',
            boxShadow: state.isFocused
                ? `0 0 0 2px ${theme.palette.primary.main}20`
                : 'none',
            '&:hover': {
                borderColor: theme.palette.primary.main
            },
            transition: 'all 0.2s ease'
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? `${theme.palette.primary.main}20`
                : state.isFocused
                    ? `${theme.palette.primary.main}30`
                    : 'transparent',
            color: state.isSelected
                ? theme.palette.primary.main
                : theme.palette.text.primary,
            backdropFilter: state.isFocused ? 'blur(4px)' : 'none',
            '&:hover': {
                backgroundColor: `${theme.palette.primary.main}30`
            },
            '&:active': {
                backgroundColor: `${theme.palette.primary.main}40`
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
            border: `1px solid ${theme.palette.primary.main}20`,
            zIndex: 1400 // Увеличиваем z-index для портала
        }),
        menuList: (base) => ({
            ...base,
            padding: theme.spacing(0.5, 0)
        }),
        singleValue: (base) => ({
            ...base,
            color: theme.palette.text.primary
        }),
        placeholder: (base) => ({
            ...base,
            color: theme.palette.text.secondary
        }),
        input: (base) => ({
            ...base,
            color: theme.palette.text.primary
        }),
        indicatorSeparator: (base) => ({
            ...base,
            display: 'none'
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: state.isFocused
                ? theme.palette.primary.main
                : theme.palette.primary.light,
            '&:hover': {
                color: theme.palette.primary.main
            },
            transition: 'transform 0.2s',
            transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'none'
        }),
        clearIndicator: (base, state) => ({
            ...base,
            color: theme.palette.primary.light,
            '&:hover': {
                color: theme.palette.error.main
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