import React from "react";
import { Box, IconButton, Menu as MenuLib, MenuItem, Button, Link } from '@mui/material';
import MenuIcon from "@mui/icons-material/Menu";

const Menu: React.FC = () => {
// Внутри компонента Header:
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const navigationItems = [
        { label: 'Главная', path: '/' },
        { label: 'Капоэйра', path: '/capoeira-songs' },
        { label: 'Рецепты', path: '/recipes' },
        { label: 'Эксперименты (dev)', path: '/test-subject' },
        { label: 'Обо мне', path: '/about' },
    ];
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Какое меню показать, решает CSS по брейкпоинту темы (md): в разметке оба, лишнее скрыто.
    // Раньше это делал эффект с подпиской на resize — на телефоне сначала мелькало
    // десктопное меню, а состояние обновлялось на каждый пиксель изменения ширины окна.
    return (
        <>
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
                    {navigationItems.map((item) => (
                        <MenuItem
                            key={item.path}
                            component={Link}
                            href={item.path}
                            onClick={handleClose}
                        >
                            {item.label}
                        </MenuItem>
                    ))}
                </MenuLib>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, mr: 3 }}>
                {navigationItems.map((item) => (
                    <Button
                        key={item.path}
                        component={Link}
                        href={item.path}
                        color="inherit"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 'medium',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                        }}
                    >
                        {item.label}
                    </Button>
                ))}
            </Box>
        </>
    );
};

export default Menu;