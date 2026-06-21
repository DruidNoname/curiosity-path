import React from "react";
import { Box, Chip, Typography } from "@mui/material";

interface FilteredTitleProps {
    icon: React.ReactElement;
    label: string;
    title: string;
}

const FilteredTitle: React.FC<FilteredTitleProps> = ({ icon, label, title }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Chip
                icon={icon}
                label={label}
                color="primary"
                size="small"
            />
            <Typography
                variant="h4"
                component="h1"
                sx={{pb: 0}}
            >
                {title}
            </Typography>
        </Box>
    );
};

export default FilteredTitle;
