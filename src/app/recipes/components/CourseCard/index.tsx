import React from 'react';

import styles from './style.module.css';
import { Card, Link } from '@mui/material';
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
                display: 'flex',
                alignItems: 'center'
            }}
        >
            {`${cat.name} (${cat.count})`}
        </Card>
    );
};