import {alpha, createTheme} from "@mui/material/styles";
import {darkThemeColors} from "@/lib/theme/darkThemeColors";

export const deadSpaceBaseTheme = createTheme({
    cssVariables: true,
    palette: {
        mode: 'dark' as const,
        primary: {
            main: darkThemeColors.primary.main,
            light: darkThemeColors.primary.light,
            dark: darkThemeColors.primary.dark,
            contrastText: darkThemeColors.primary.contrastText,
        },
        secondary: {
            main: darkThemeColors.secondary.main,
            light: darkThemeColors.secondary.light,
            dark: darkThemeColors.secondary.dark,
            contrastText: darkThemeColors.secondary.contrastText,
        },
        info: {
            main: darkThemeColors.info.main,
            light: darkThemeColors.info.light,
            dark: darkThemeColors.info.dark,
        },
        warning: {
            main: darkThemeColors.warning.main,
            light: darkThemeColors.warning.light,
            dark: darkThemeColors.warning.dark,
        },
        error: {
            main: darkThemeColors.error.main,
            light: darkThemeColors.error.light,
            dark: darkThemeColors.error.dark,
        },
        success: {
            main: darkThemeColors.success.main,
            light: darkThemeColors.success.light,
            dark: darkThemeColors.success.dark,
        },
        background: {
            default: darkThemeColors.background.default,
            paper: darkThemeColors.background.paper,
        },
        text: {
            primary: darkThemeColors.text.primary,
            secondary: darkThemeColors.text.secondary,
            disabled: darkThemeColors.text.disabled,
        },
        divider: alpha(darkThemeColors.primary.main, 0.2),
        action: {
            active: darkThemeColors.action.active,
            hover: alpha(darkThemeColors.primary.main, 0.08),
            hoverOpacity: 0.08,
            selected: alpha(darkThemeColors.primary.main, 0.16),
            selectedOpacity: 0.16,
            disabled: darkThemeColors.action.disabled,
            disabledBackground: alpha(darkThemeColors.action.disabled, 0.12),
            disabledOpacity: 0.38,
            focus: alpha(darkThemeColors.primary.main, 0.12),
            focusOpacity: 0.12,
            activatedOpacity: 0.24,
        },
    },
    typography: {
        fontFamily: 'var(--font-roboto-mono), "Courier New", monospace',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            color: darkThemeColors.primary.light,
            letterSpacing: '0.5px',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            color: darkThemeColors.primary.light,
            letterSpacing: '0.25px',
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
            color: darkThemeColors.primary.main,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
            color: darkThemeColors.primary.main,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
            color: darkThemeColors.text.primary,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
            color: darkThemeColors.primary.light,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
            color: darkThemeColors.text.primary,
        },
        body2: {
            fontSize: '0.875rem',
            color: darkThemeColors.primary.light,
        },
        button: {
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: '1px',
            fontSize: '0.875rem',
        },
        caption: {
            color: '#88aacc',
            fontSize: '0.75rem',
            letterSpacing: '0.25px',
        },
        overline: {
            color: darkThemeColors.primary.main,
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
        },
    },
    shape: {
        borderRadius: 4,
    },
});