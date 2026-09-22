import React from "react";
import Box from '@mui/material/Box';
import styles from './style.module.css';

type Props = {
    /** Надпись, по которой спойлер открывают. */
    summary: React.ReactNode;
    className?: string;
    children: React.ReactNode;
};

/**
 * Нативный спойлер: раскрытие берёт на себя браузер, состояния и анимации нет.
 * Браузерный маркер убран, вместо него «+» и «−».
 */
const Spoiler: React.FC<Props> = ({summary, className, children}) => (
    <Box component={'details'} className={className ? `${styles.Spoiler} ${className}` : styles.Spoiler}>
        <Box component={'summary'} className={styles.Summary}>
            {summary}
        </Box>
        {children}
    </Box>
);

export default Spoiler;
