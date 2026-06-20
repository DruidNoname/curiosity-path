import { Box, Tooltip } from "@mui/material";
import {PickersDay, PickersDayProps} from "@mui/x-date-pickers";
import React from "react";
import {format} from "date-fns";

interface Props extends PickersDayProps {
    day: Date;
    hasPosts?: boolean;
    postsByDate?: any;
}

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, ''); // Убираем HTML-теги

const PostCalendarDay: React.FC<Props> = ({day, hasPosts, postsByDate, ...other}) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const postsForDay = (hasPosts && postsByDate?.get(dateKey)) || [];

    // Если за день есть пост — рендерим ячейку как ссылку (ButtonBase станет <a>).
    const linkProps = hasPosts
        ? {
            component: 'a' as const,
            href: `/${postsForDay[0].slug}`,
            target: '_blank',
            rel: 'noopener noreferrer',
        }
        : {};

    const tooltipTitle = (
        <>
            {postsForDay.map((post: any) => (
                <div key={post.id}>{stripHtml(post.title)}</div>
            ))}
        </>
    );

    const dayElement = (
        <PickersDay
            {...other}
            {...linkProps}
            day={day}
            sx={{
                color: hasPosts ? 'var(--color-primary-main)' : 'rgba(var(--color-primary-main-rgb), 0.45)',
                cursor: hasPosts ? 'pointer' : 'default',
                pointerEvents: hasPosts ? 'auto' : 'none',
                '&:hover': hasPosts ? {
                    backgroundColor: 'rgba(25, 118, 210, 0.12)',
                } : {},
                position: 'relative',
            }}
        />
    );

    return(
    <Box sx={{position: 'relative'}}>
        {hasPosts ? (
            <Tooltip title={tooltipTitle} arrow placement="bottom-end">
                {dayElement}
            </Tooltip>
        ) : (
            dayElement
        )}
    </Box>
    );
};

export default PostCalendarDay;
