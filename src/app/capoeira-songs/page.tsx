'use client';

import React from "react";
import styles from "./style.module.css";
import {Accordion, AccordionDetails, AccordionSummary, Box, Typography} from "@mui/material";
import Title from "@/components/Title";
import {useCapoeiraSongsPosts} from "@/features/posts/hooks";
import Loader from "@/ui/Loader";
import {TransformedPost} from "@/features/posts/types";
import {getCleanEntry} from "@/helpers/utils";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CapoeiraSongs: React.FC = () => {
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const {
        data,
        isLoading,
        isError,
        error
    } = useCapoeiraSongsPosts();

    if (isError) {
        console.log(error);
    }

    const {
        songs = [],
        total = 0,
    } = data || {};

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return(
        <Box className={styles.Song}>
            <Title title={ 'Песни капоэйры' } variant={"h2"} subtitle={'Учить и не думать. А подумать потом.'}/>
            { isLoading ?
                <Loader /> :
                <Box>
                    {
                        songs?.map((song: TransformedPost) => {
                            const title = getCleanEntry(song?.title?.rendered || 'Без названия');
                            const excerpt = getCleanEntry(song?.excerpt?.rendered || '');
                            const content = getCleanEntry(song?.content.rendered || '');

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
                                                dangerouslySetInnerHTML={{__html: title}}
                                            />
                                            <Typography
                                                variant="caption"
                                                component="h5"
                                                className={styles.SongSubtitle}
                                                dangerouslySetInnerHTML={{__html: excerpt}}
                                            />
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography
                                            variant="body1"
                                            component="div"
                                            dangerouslySetInnerHTML={{__html: content}}
                                        />
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