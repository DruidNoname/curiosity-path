import { Box, Tooltip } from "@mui/material";
import {PickerDay, PickerDayProps} from "@mui/x-date-pickers";
import React from "react";
import {format} from "date-fns";

interface Props extends PickerDayProps {
    day: Date;
    hasPosts?: boolean;
    postsByDate?: any;
}

const PostCalendarDay: React.FC<Props> = ({day, hasPosts, postsByDate, ...other}) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const postsForDay = (hasPosts && postsByDate?.get(dateKey)) || [];

    // Если за день есть пост — рендерим ячейку как ссылку (ButtonBase станет <a>).
    // nativeButton={false}: с MUI 9 ButtonBase требует явно сказать, что под ним не <button>.
    const linkProps = hasPosts
        ? {
            component: 'a' as const,
            nativeButton: false,
            href: `/${postsForDay[0].slug}`,
            target: '_blank',
            rel: 'noopener noreferrer',
        }
        : {};

    const tooltipTitle = (
        <>
            {postsForDay.map((post: any) => (
                <div key={post.id}>{post.title}</div>
            ))}
        </>
    );

    const dayElement = (
        <PickerDay
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
