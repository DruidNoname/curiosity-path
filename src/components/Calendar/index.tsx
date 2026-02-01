'use client';

import React from "react";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ErrorBoundary from '../ErrorBoundary';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {Locale, ru} from 'date-fns/locale';
import {Box, Typography} from "@mui/material";
import {startOfMonth, endOfMonth, addMonths, format, parseISO} from 'date-fns';
import { usePostsByMonth} from "@/features/posts/hooks";
import {PickersDay} from "@mui/x-date-pickers";
import Loader from "@/ui/Loader";

const russianLocale: Locale  = {
    ...ru,
    options: {
        ...ru.options,
        weekStartsOn: 1, // 0 - воскресенье, 1 - понедельник[citation:2]
    },
};

export const Calendar: React.FC = () => {
    const today = new Date();
    const monthStart = startOfMonth(today); // Первый день месяца, 00:00:00
    const monthEnd = endOfMonth(today);     // Последний день месяца, 23:59:59.999
    const minDate = new Date(2011, 0, 1); // 1 января 2011
    const maxDate = addMonths(today, 1); // Следующий месяц от текущего

// Интервал текущего месяца
    const thisMonthInterval = {
        start: monthStart,
        end: monthEnd
    };

    const [selectedMonth, setSelectedMonth] = React.useState(thisMonthInterval);

    const {
        data: currentMonthData,
        isLoading,
        isError,
        error
    } = usePostsByMonth(1, 90, selectedMonth);

    const [queryHistory, setQueryHistory] = React.useState<Record<string, any>>({});

    // Мемоизируем историю с обновлением
    const memoizedHistory = React.useMemo(() => {
        if (currentMonthData) {
            const monthKey = format(selectedMonth.start, 'yyyy-MM');
            return {
                ...queryHistory,
                [monthKey]: {
                    data: currentMonthData,
                    timestamp: Date.now()
                }
            };
        }
        return queryHistory;
    }, [currentMonthData, selectedMonth]);

    // Получаем данные из истории или текущие
    const displayData = React.useMemo(() => {
        const monthKey = format(selectedMonth.start, 'yyyy-MM');

        // Проверяем кэш
        if (memoizedHistory[monthKey]?.data) {
            return memoizedHistory[monthKey].data;
        }

        // Проверяем свежие данные
        if (currentMonthData) {
            return currentMonthData;
        }

        return null;
    }, [memoizedHistory, selectedMonth, currentMonthData]);

    const postsByDate = React.useMemo(() => {
        const map = new Map();
        displayData?.posts?.forEach((post: any) => {
            try {
                const date = parseISO(post.date);
                const dateKey = format(date, 'yyyy-MM-dd');

                if (!map.has(dateKey)) {
                    map.set(dateKey, []);
                }

                map.get(dateKey).push({
                    id: post.id,
                    slug: post.slug,
                    title: post.title.rendered,
                    link: post.link,
                    date: post.date
                });
            } catch (e) {
                console.error('Error parsing post date:', e);
            }
        });

        return map;
    }, [displayData]);

    const handleDateClick = (date: Date) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        const postsForDate = postsByDate.get(dateKey);

        if (postsForDate && postsForDate.length > 0) {
            // Открываем первый пост (или показываем список)
            window.open(postsForDate[0].slug, '_blank');
        }
    };


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

    //тут надо описать интерфейс для поста!!!
    //подумать, почему кнопка назад не работает при переходе с календаря
    // (по ходу, потому, что пост в новом окне, как убрать или изменить логику?)
    // и разобраться с кешированием нормально, а то ощущения, что я кеширую кеш
    return (
        <ErrorBoundary componentName={'Calendar'}>
            { !isError ?
                <Typography variant={'h5'}>
                    Календарь
                </Typography>
                :
                <Typography variant={'h6'} sx={{ lineHeight: '1.25em', fontSize: '12px'}}>
                    `Это календарь, он просто красивый. А ещё ${error.message}.`
                </Typography>
            }
            <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={russianLocale}
            > { isLoading ?
                <Loader/>
                :
                !isError ?
                    <DateCalendar
                        views={['year', 'month', 'day']}
                        onMonthChange={handleMonthChange}
                        onYearChange={handleYearChange}
                        minDate={minDate}
                        maxDate={maxDate}
                        slots={{
                            day: (props) => {
                                const { day, ...other } = props;
                                const dateKey = format(day, 'yyyy-MM-dd');
                                const postsForDay = postsByDate.get(dateKey) || [];
                                const hasPosts = postsForDay.length > 0;

                                return (
                                    <Box sx={{ position: 'relative' }}>
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

                                        {/*{hasPosts && (*/}
                                        {/*    <>*/}
                                        {/*        /!* Точечка-индикатор *!/*/}
                                        {/*        <Box*/}
                                        {/*            sx={{*/}
                                        {/*                position: 'absolute',*/}
                                        {/*                bottom: 4,*/}
                                        {/*                left: '50%',*/}
                                        {/*                transform: 'translateX(-50%)',*/}
                                        {/*                width: 6,*/}
                                        {/*                height: 6,*/}
                                        {/*                backgroundColor: 'primary.main',*/}
                                        {/*                borderRadius: '50%',*/}
                                        {/*            }}*/}
                                        {/*        />*/}

                                        {/*        /!* Всплывающая подсказка при наведении *!/*/}
                                        {/*        <Box*/}
                                        {/*            sx={{*/}
                                        {/*                position: 'absolute',*/}
                                        {/*                top: '100%',*/}
                                        {/*                left: '50%',*/}
                                        {/*                transform: 'translateX(-50%)',*/}
                                        {/*                mt: 1,*/}
                                        {/*                p: 1,*/}
                                        {/*                bgcolor: 'background.paper',*/}
                                        {/*                boxShadow: 2,*/}
                                        {/*                borderRadius: 1,*/}
                                        {/*                zIndex: 10,*/}
                                        {/*                display: 'none',*/}
                                        {/*                minWidth: 200,*/}
                                        {/*                '&:hover': {*/}
                                        {/*                    display: 'block',*/}
                                        {/*                },*/}
                                        {/*            }}*/}
                                        {/*        >*/}
                                        {/*            <Typography variant="caption" fontWeight="bold">*/}
                                        {/*                {postsForDay.length} {postsForDay.length === 1 ? 'пост' : 'поста'}*/}
                                        {/*            </Typography>*/}
                                        {/*            <Stack spacing={0.5} mt={0.5}>*/}
                                        {/*                {postsForDay.map((post: any) => (*/}
                                        {/*                    <Chip*/}
                                        {/*                        key={post.id}*/}
                                        {/*                        label={post.title}*/}
                                        {/*                        size="small"*/}
                                        {/*                        onClick={() => window.open(post.link, '_blank')}*/}
                                        {/*                        sx={{*/}
                                        {/*                            cursor: 'pointer',*/}
                                        {/*                            '&:hover': {*/}
                                        {/*                                backgroundColor: 'action.hover',*/}
                                        {/*                            },*/}
                                        {/*                        }}*/}
                                        {/*                    />*/}
                                        {/*                ))}*/}
                                        {/*            </Stack>*/}
                                        {/*        </Box>*/}
                                        {/*    </>*/}
                                        {/*)}*/}
                                    </Box>
                                );
                            }
                        }}
                    /> :
                    <DateCalendar/>
            }
            </LocalizationProvider>
        </ErrorBoundary>
    );
};