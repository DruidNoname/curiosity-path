import React from "react";
import { usePathname } from "next/navigation";
import { Box, IconButton, Menu as MenuLib, MenuItem, Button, Link } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import MenuIcon from "@mui/icons-material/Menu";

const navigationItems = [
    { label: 'Главная', path: '/' },
    { label: 'Капоэйра', path: '/capoeira-songs' },
    { label: 'Рецепты', path: '/recipes' },
    { label: 'Эксперименты (dev)', path: '/test-subject' },
    { label: 'Обо мне', path: '/about' },
];

// Главная активна только на самой себе, остальные разделы — и на вложенных страницах
// (/recipes/categories/... подсвечивает «Рецепты»).
const isActivePath = (pathname: string, path: string) =>
    path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`);

// Пункт навигации — не кнопка-действие, а вкладка на фоне шапки. От темы кнопке достаются
// цвет text-варианта (в светлой схеме синий по синей шапке), backdrop-filter (размывает
// шапку под кнопкой — выглядит вдавленной) и подъём на hover; здесь всё это снимаем.
const navButtonSx = (active: boolean): SxProps<Theme> => [
    {
        textTransform: 'none',
        fontWeight: 'medium',
        color: 'inherit',
        backdropFilter: 'none',
        border: 'none',
        borderRadius: '4px 4px 0 0',
        boxShadow: active ? 'inset 0 -2px 0 currentColor' : 'none',
        backgroundColor: active ? 'rgba(var(--color-primary-main-rgb), 0.15)' : 'transparent',
        '&:hover': {
            transform: 'none',
            backgroundColor: 'rgba(var(--color-primary-main-rgb), 0.1)',
        },
    },
    (t) => t.applyStyles('light', {
        backgroundColor: active ? 'rgba(var(--color-primary-contrast-rgb), 0.2)' : 'transparent',
        '&:hover': {
            backgroundColor: 'rgba(var(--color-primary-contrast-rgb), 0.12)',
        },
    }),
];

const Menu: React.FC = () => {
    const pathname = usePathname() ?? '';
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [isMobile, setIsMobile] = React.useState(false);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    React.useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 900);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);


    return (

        isMobile ?
            <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 2 }}>
                <IconButton
                    size="large"
                    color="inherit"
                    onClick={handleClick}
                >
                    <MenuIcon />
                </IconButton>
                <MenuLib
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    {navigationItems.map((item) => {
                        const active = isActivePath(pathname, item.path);
                        return (
                            <MenuItem
                                key={item.path}
                                component={Link}
                                // Под пунктом — ссылка, а не <button>: MUI 9 требует сказать это явно.
                                nativeButton={false}
                                href={item.path}
                                selected={active}
                                aria-current={active ? 'page' : undefined}
                                onClick={handleClose}
                            >
                                {item.label}
                            </MenuItem>
                        );
                    })}
                </MenuLib>
            </Box>
            :
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, mr: 3 }}>
                {navigationItems.map((item) => {
                    const active = isActivePath(pathname, item.path);
                    return (
                        <Button
                            key={item.path}
                            component={Link}
                            nativeButton={false}
                            href={item.path}
                            color="inherit"
                            aria-current={active ? 'page' : undefined}
                            sx={navButtonSx(active)}
                        >
                            {item.label}
                        </Button>
                    );
                })}
            </Box>
    );
};

export default Menu;
