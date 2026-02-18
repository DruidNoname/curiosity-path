'use client';

import React from "react";
import ErrorBoundary from '../../components/ErrorBoundary';
import {Typography} from "@mui/material";
import {startOfMonth, endOfMonth, addMonths, format} from 'date-fns';
import { usePostsByMonth} from "@/features/posts/hooks";
import PostCalendarDay from "@/modules/PostCalendar/DayWithLink";
import Calendar from "@/ui/Calendar";
import {getPostsByDate} from "@/modules/PostCalendar/utils";
import Loader from "@/ui/Loader";

export const PostCalendar: React.FC = () => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const minDate = new Date(2011, 0, 1);
    const maxDate = addMonths(today, 1);

    const thisMonthInterval = {
        start: monthStart,
        end: monthEnd
    };

    const [selectedMonth, setSelectedMonth] = React.useState(thisMonthInterval);

    const {
        data,
        isLoading,
        isError,
        error
    } = usePostsByMonth(1, 90, selectedMonth);
    const handleMonthChange = (date: Date) => {
        setSelectedMonth({
            start: startOfMonth(date),
            end: endOfMonth(date)
        });
    };
    const handleYearChange = (date: Date) => {
        setSelectedMonth({
            start: startOfMonth(date),
            end: endOfMonth(date)
        });
    };

    const posts = data?.posts || [];

    return (
        <ErrorBoundary componentName={'PostCalendar'}>
            { !isError ?
                <Typography variant={'h5'}>
                    Календарь {isLoading && <Loader isDots={true}/> }
                </Typography>
                :
                <Typography variant={'h6'} sx={{ lineHeight: '1.25em', fontSize: '12px'}}>
                    {error.message}
                </Typography>
            }
            {
                !isError ?
                    <Calendar
                        views={['year', 'month', 'day']}
                        onMonthChange={handleMonthChange}
                        onYearChange={handleYearChange}
                        minDate={minDate}
                        maxDate={maxDate}
                        slots={{
                            day: (props) => {
                                const { day, ...other } = props;
                                const dateKey = format(day, 'yyyy-MM-dd');
                                const postsForDay = getPostsByDate(posts).get(dateKey) || [];
                                const hasPosts = postsForDay.length > 0;

                                return (
                                    <PostCalendarDay
                                        day={day}
                                        hasPosts={hasPosts}
                                        postsByDate={getPostsByDate(posts)}
                                        {...other}
                                    />
                                );
                            }
                        }}
                    /> :
                    <Calendar/>
            }
        </ErrorBoundary>
    );
};