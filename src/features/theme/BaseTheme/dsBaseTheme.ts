import {createTheme} from "@mui/material/styles";
export const deadSpaceBaseTheme = createTheme({
    cssVariables: true,
    typography: {
        fontFamily: 'var(--font-roboto-mono), "Courier New", monospace',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            letterSpacing: '0.5px',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            letterSpacing: '0.25px',
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
        },
        button: {
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: '1px',
            fontSize: '0.875rem',
        },
        caption: {
            fontSize: '0.75rem',
            letterSpacing: '0.25px',
        },
        overline: {
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