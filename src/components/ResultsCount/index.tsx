import React, { useState } from "react";
import { Typography } from "@mui/material";

interface ResultsCountProps {
    label: string;
    // count может быть undefined во время загрузки — тогда показываем последнее известное значение
    count?: number;
}

const ResultsCount: React.FC<ResultsCountProps> = ({ label, count }) => {
    // Запоминаем последнее известное значение, чтобы счётчик не «схлопывался»,
    // пока count временно undefined (например, при переключении страниц пагинации).
    // Сброс — через смену key компонента (новый запрос → новый key → перемонтирование).
    const [lastKnown, setLastKnown] = useState(0);
    if (count !== undefined && count !== lastKnown) {
        setLastKnown(count);
    }
    const value = count ?? lastKnown;

    if (!value) return null;

    return (
        <Typography variant="body2" color="text.secondary">
            {label}: {value}
        </Typography>
    );
};

export default React.memo(ResultsCount);
