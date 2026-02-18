import { Box } from "@mui/material";
import {PickersDay, PickersDayProps} from "@mui/x-date-pickers";
import React from "react";
import {format} from "date-fns";

interface Props extends PickersDayProps {
    day: Date;
    hasPosts?: boolean;
    postsByDate?: any;
}
const PostCalendarDay: React.FC<Props> = ({day, hasPosts, postsByDate, ...other}) => {
    const handleDateClick = (date: Date) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        const postsForDate = postsByDate.get(dateKey);

        if (postsForDate && postsForDate.length > 0) {
            window.open(postsForDate[0].slug, '_blank');
        }
    };

    return(
    <Box sx={{position: 'relative'}}>
        <PickersDay
            {...other}
            day={day}
            onClick={() => hasPosts && handleDateClick(day)}
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
    </Box>
    );
};

export default PostCalendarDay;