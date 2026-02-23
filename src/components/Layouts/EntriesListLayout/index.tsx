import React, { PropsWithChildren } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Box } from "@mui/material";

interface EntriesListLayoutProps {
    mainContent: React.ReactNode;
    asideContent?: React.ReactNode;
}

const EntriesListLayout: React.FC<EntriesListLayoutProps> = ({ mainContent, asideContent }) => {
    return (
        <ErrorBoundary componentName="EntriesListLayout">
            <Box
                component="div"
                sx={{
                    display: { xs: 'block', sm: 'flex' },
                    gap: { sm: '16px', lg: '32px' },
                }}
            >
                <Box
                    component="div"
                    sx={{ flexGrow: 1 }}
                >
                    {mainContent}
                </Box>
                {asideContent && (
                    <Box
                        component="aside"
                        sx={{
                            width: '20%',
                            minWidth: '300px',
                            p: 3,
                            bgcolor: 'background.paper',
                            borderLeft: 1,
                            borderColor: 'divider'
                        }}
                    >
                        {asideContent}
                    </Box>
                )}
            </Box>
        </ErrorBoundary>
    );
};

export default EntriesListLayout;