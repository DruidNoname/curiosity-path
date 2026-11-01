import React from 'react';

import styles from './style.module.css';
import { Card } from '@mui/material';
import {Course} from "@/features/recipes/types"; // предполагается использование Material-UI

type Props = {
    cat: Course
}

export const CourseCard: React.FC<Props> = ({ cat }) => {
    const className = [styles[`course-${cat.id}`], styles.course].join(' ');

    return (
        <Card
            key={cat.id}
            component={'a'}
            href={`/recipes/categories/${cat.slug}`}
            id={`course-${cat.id}`}
            className={className}
            sx={{
                width: {
                    xs: '100%',
                    sm: 'calc(50% - 12px)',
                    lg: 'calc(33.33% - 24px)'
                },
                textDecoration: 'none',
                padding: 3,
                // Справа в карточке — иконка категории (::after в style.module.css, right: 24px).
                // Отступ считаем от неё, чтобы длинное название на узком экране не заезжало под картинку.
                pr: 'calc(24px + var(--icon-height) + 16px)',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            {`${cat.name} (${cat.count})`}
        </Card>
    );
};