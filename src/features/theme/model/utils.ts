export const generateRGBfromHEX = (hexColor: string): string => {
    hexColor = hexColor.replace('#', '');

    if (hexColor.length === 3) {
        hexColor = hexColor.split('').map(char => char + char).join('');
    }

    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);

    return `${r}, ${g}, ${b}`;
};

type SemanticColor = { main: string; light: string; dark: string };
type PrimaryColor = SemanticColor & { contrastText: string };

export type ThemeColorTokens = {
    primary: PrimaryColor;
    secondary: PrimaryColor;
    info: SemanticColor;
    warning: SemanticColor;
    error: SemanticColor;
    success: SemanticColor;
    background: { default: string; paper: string };
    text: { primary: string; secondary: string; disabled: string };
    action: { active: string; disabled: string };
};

const rgb = (hex: string) => generateRGBfromHEX(hex);

export const buildCssVars = (c: ThemeColorTokens): Record<string, string> => ({
    '--color-primary-main':          c.primary.main,
    '--color-primary-light':         c.primary.light,
    '--color-primary-dark':          c.primary.dark,
    '--color-primary-contrast':      c.primary.contrastText,
    '--color-primary-main-rgb':      rgb(c.primary.main),
    '--color-primary-light-rgb':     rgb(c.primary.light),
    '--color-primary-dark-rgb':      rgb(c.primary.dark),
    '--color-primary-contrast-rgb':  rgb(c.primary.contrastText),

    '--color-secondary-main':        c.secondary.main,
    '--color-secondary-light':       c.secondary.light,
    '--color-secondary-dark':        c.secondary.dark,
    '--color-secondary-contrast':    c.secondary.contrastText,
    '--color-secondary-main-rgb':    rgb(c.secondary.main),
    '--color-secondary-light-rgb':   rgb(c.secondary.light),
    '--color-secondary-dark-rgb':    rgb(c.secondary.dark),

    '--color-info-main':             c.info.main,
    '--color-info-light':            c.info.light,
    '--color-info-main-rgb':         rgb(c.info.main),

    '--color-warning-main':          c.warning.main,
    '--color-warning-light':         c.warning.light,
    '--color-warning-main-rgb':      rgb(c.warning.main),
    '--color-warning-light-rgb':     rgb(c.warning.light),

    '--color-error-main':            c.error.main,
    '--color-error-light':           c.error.light,
    '--color-error-main-rgb':        rgb(c.error.main),
    '--color-error-light-rgb':       rgb(c.error.light),

    '--color-success-main':          c.success.main,
    '--color-success-light':         c.success.light,
    '--color-success-main-rgb':      rgb(c.success.main),
    '--color-success-light-rgb':     rgb(c.success.light),

    '--color-background-default':    c.background.default,
    '--color-background-paper':      c.background.paper,
    '--color-background-default-rgb': rgb(c.background.default),
    '--color-background-paper-rgb':  rgb(c.background.paper),

    '--color-text-primary':          c.text.primary,
    '--color-text-secondary':        c.text.secondary,
    '--color-text-disabled':         c.text.disabled,
    '--color-text-primary-rgb':      rgb(c.text.primary),
    '--color-text-secondary-rgb':    rgb(c.text.secondary),
    '--color-text-disabled-rgb':     rgb(c.text.disabled),

    '--color-action-active':         c.action.active,
    '--color-action-disabled':       c.action.disabled,
    '--color-action-active-rgb':     rgb(c.action.active),
    '--color-action-disabled-rgb':   rgb(c.action.disabled),
});
