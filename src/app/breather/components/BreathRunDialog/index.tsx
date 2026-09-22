'use client';

import React from "react";
import {Box, Button, Dialog, Typography} from "@mui/material";
import styles from './style.module.css';
import {COUNTDOWN_LABEL, PHASE_LABELS, REST_LABEL} from "@/features/breath/const";
import type {BreathRun, BreathTick} from "@/features/breath/types";

type Props = {
    /** Пока счёт есть — прогон жив, и окно висит поверх формы. */
    tick: BreathTick | null;
    run: BreathRun | null;
    isPaused: boolean;
    onPause: () => void;
    onResume: () => void;
    onStop: () => void;
};

/** «Вдох (3)», «Отдых (10)» — в скобках длина отрезка, чтобы знать, сколько ещё считать. */
const describeTick = (tick: BreathTick): string => {
    if (tick.phase === 'countdown') return COUNTDOWN_LABEL;

    const label = tick.phase === 'rest' ? REST_LABEL : PHASE_LABELS[tick.phase];

    return `${label} (${tick.total})`;
};

const describeProgress = (tick: BreathTick, run: BreathRun | null): string | null => {
    if (!run || run.repeats === 0) return null;

    const sets = run.sets > 1 ? `подход ${tick.set} / ${run.sets}` : null;

    // На отсчёте повторений ещё не было, так что там уместен только номер подхода.
    if (tick.phase === 'countdown') return sets;

    return [`повторение ${tick.repeat} / ${run.repeats}`, sets].filter(Boolean).join(' · ');
};

const BreathRunDialog: React.FC<Props> = ({tick, run, isPaused, onPause, onResume, onStop}) => {
    const progress = tick ? describeProgress(tick, run) : null;

    return (
        <Dialog
            open={Boolean(tick)}
            // Esc и клик по фону не бросают прогон, а ставят его на паузу: потерять
            // сосчитанное случайным нажатием обиднее, чем лишний раз нажать «Продолжить».
            onClose={onPause}
            // В MUI 6.1 у Dialog в slotProps ещё нет paper — только root и backdrop.
            PaperProps={{className: styles.Paper}}
        >
            {tick ? (
                <Box className={styles.Content}>
                    <Typography variant={'body1'} color={'text.secondary'} aria-live={'polite'}>
                        {describeTick(tick)}
                    </Typography>

                    <Typography component={'p'} className={styles.Digit}>
                        {tick.count}
                    </Typography>

                    <Box className={styles.Actions}>
                        <Button variant={'contained'} onClick={isPaused ? onResume : onPause}>
                            {isPaused ? 'Продолжить' : 'Пауза'}
                        </Button>
                        <Button variant={'text'} size={'small'} onClick={onStop}>
                            Остановить
                        </Button>
                    </Box>

                    {progress ? (
                        <Typography
                            variant={'caption'}
                            component={'p'}
                            color={'text.secondary'}
                            className={styles.Progress}
                        >
                            {progress}
                        </Typography>
                    ) : null}
                </Box>
            ) : null}
        </Dialog>
    );
};

export default BreathRunDialog;
