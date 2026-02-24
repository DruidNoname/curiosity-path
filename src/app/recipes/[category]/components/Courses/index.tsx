'use client';

import React from 'react';
import {Box, Link, Typography} from "@mui/material";
import Loader from "@/ui/Loader";
import { useCourses } from "@/features/recipes/hooks";

const Courses: React.FC = () => {

    const { data, isLoading } = useCourses();

    const displayCourses = data || [];

    const totalTags = displayCourses?.length || 0;

    const courseElements = displayCourses.map((course, index, array) => (
        <React.Fragment key={course.id}>
            <Link
                href={`/recipes/${course.slug}`}
                style={{ textDecoration: 'none' }}
            >
                {course.name}
                {course.count !== undefined && course.count > 0 && ` (${course.count})`}
            </Link>
            {index < array.length - 1 && ', '}
        </React.Fragment>
    ));

    if (isLoading) return <Loader/>;

    return (
        <Box sx={{ mb: 4 }}>

                <>
                    <Typography variant={'h5'} sx={{ mb: '16px' }}>
                        {`Доступные теги (${totalTags || 0}): `}
                    </Typography>
                    <Typography variant={'body1'}>
                        { courseElements }
                    </Typography>
                </>
        </Box>
    );
};

export default Courses;