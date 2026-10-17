import ErrorBoundary from "@/components/ErrorBoundary";
import {Box, Paper, Tooltip, Typography} from "@mui/material";
import Loader from "@/ui/Loader";
import React from "react";
import {usePostsByToday} from "@/features/posts/hooks";
import {WP_REST_API_Post} from "wp-types";
import {Link} from "@/ui/Link";
import {toPlainText} from "@/helpers/wp-text";

const HistoryWidget: React.FC = ( ) => {
    // Главная страница статическая: HTML собирается один раз при деплое. Сегодняшняя дата,
    // посчитанная в рендере, застывала бы на дату сборки (и в часовом поясе сервера) и
    // расходилась с браузером при гидрации. Поэтому дату узнаём только на клиенте.
    const [today, setToday] = React.useState<Date | null>(null);

    React.useEffect(() => {
        // Второй проход рендера намеренный: «сегодня» существует только в браузере.
        setToday(new Date());
    }, []);

    // isPending, а не isLoading: пока даты нет, запрос не запущен, и isLoading был бы false —
    // виджет на мгновение показал бы «ничего не произошло» вместо загрузки.
    const {
        data,
        isPending,
        error,
        isError
    } = usePostsByToday(today);

    const {
        posts = [],
    } = data || {};


    return(
        <ErrorBoundary componentName={'HistoryWidget'}>
            <Box  sx={{marginBottom: '4px'}}>
                <Typography variant={'h5'} sx={{marginBottom: '8px'}}>
                    Окно в историю
                </Typography>
                <Typography variant={'body2'}>
                    Что было в&nbsp;фокусе в&nbsp;этот&nbsp;день{today && <>, <strong>{today.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long'
                })}</strong></>}:
                </Typography>
            </Box>
            <Paper
                variant={'iced'}
                sx={{padding: '16px', marginBottom: '20px', minHeight: '130px', marginRight: '-3px', marginLeft: '-3px',}}
            >
                { isError
                    ?
                    <Typography variant={'body2'} sx={{ lineHeight: '1.25em', fontSize: '12px'}}>
                        {error?.message}
                    </Typography>
                    : isPending
                    ?
                    <Loader isDots={true}/>
                    : posts.length > 0
                    ?
                    <Box sx={{display: 'flex', flexWrap: 'wrap', columnGap: '16px', rowGap: '4px'}}>
                    {posts.map((post: WP_REST_API_Post) => {
                    const postDate = new Date(post.date);
                    const postYear = postDate.getFullYear();

                    return (
                        <Tooltip
                            key={post.id}
                            title={toPlainText(post.title.rendered)}
                            arrow
                            placement="bottom-end"
                        >
                            <Link href={`/${post.slug}`}>
                                { `${postYear}`}
                            </Link>
                        </Tooltip>
                    );
                })}
                    </Box>
                :
                    <Typography variant={'body2'}>
                        ...ничего не произошло.
                    </Typography>
                }
            </Paper>
        </ErrorBoundary>
    );
};

export default HistoryWidget;