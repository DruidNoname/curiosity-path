'use client';

import React from "react";
import styles from "./style.module.css";
import {Accordion, AccordionDetails, AccordionSummary, Box, Typography} from "@mui/material";
import Title from "@/components/Title";
import {useCapoeiraSongsPosts} from "@/features/posts/hooks";
import Loader from "@/ui/Loader";
import {TransformedPost} from "@/features/posts/types";
import WpHtml from "@/ui/WpHtml";
import {toPlainText} from "@/helpers/wp-text";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Image from "next/image";
import capoeiraMusicSvg from "@/assets/images/capoeira/capoeira-music.svg";

const CapoeiraSongs: React.FC = () => {
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const {
        data,
        isLoading,
        isError,
        error
    } = useCapoeiraSongsPosts();

    const {
        songs = [],
    } = data || {};

    // Заголовки раскодируем для всего списка разом и мемоизируем по songs: хук нельзя
    // вызывать внутри .map. Анонс и текст песни чистит WpHtml, у каждого свой кеш.
    const preparedSongs = React.useMemo(
        () => songs.map((song: TransformedPost) => ({
            song,
            title: toPlainText(song?.title?.rendered) || 'Без названия',
            excerpt: song?.excerpt?.rendered,
            content: song?.content?.rendered,
        })),
        [songs]
    );

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    if (isError) {
        return <div>Ошибка: {error?.message || 'Не удалось загрузить песни'}</div>;
    }

    return(
        <Box className={styles.Song}>
            <Title title={ 'Песни капоэйры' } variant={"h2"} subtitle={'Учить и не думать. А подумать потом.'}/>
            <Box sx={{ mb: {xs: '32px', md: '48px'}, display: {md: 'flex'}}}>
                <Box sx={{textAlign: 'center', minWidth: 210}}>
                    <Image src={capoeiraMusicSvg} alt={'berimbau'} width={100}/>
                </Box>
                <Box sx={{ mt: {xs: '32px', md: 0},  ml: {xs: 0, md: '16px'}}}>
                    <p>
                        Песни капоэйры, в основном или выученные, или заинтересовавшие, или зацепившие. Ну или те, которые часто играются в роде и которые стыдно не знать. </p>
                    <p>Ни перевода, ни транскрипции - только тексты.
                    </p>
                    <p>
                        Их мало, но они в тельняшках.
                    </p>
                </Box>
            </Box>
            { isLoading ?
                // Над списком — заголовок и вступление: по центру окна лоадер наезжал бы на них.
                <Loader inFlow /> :
                <Box>
                    {
                        preparedSongs.map(({ song, title, excerpt, content }) => {
                            return(
                                <Accordion
                                    key={`song_${song?.id}`}
                                    expanded={expanded === `panel${song?.id}`}
                                    onChange={handleChange(`panel${song?.id}`)}
                                    className={styles.SongBlock}
                                >
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} className={styles.SongSummary}>
                                        <Box>
                                            <Typography
                                                variant={'h5'}
                                                component="h2"
                                                className={styles.SongTitle}
                                            >
                                                { title }
                                            </Typography>
                                            <WpHtml
                                                html={excerpt}
                                                variant="caption"
                                                component="h5"
                                                className={styles.SongSubtitle}
                                            />
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <WpHtml html={content} variant="body1" />
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })
                    }
                </Box>
            }
        </Box>
    );
};

export default CapoeiraSongs;