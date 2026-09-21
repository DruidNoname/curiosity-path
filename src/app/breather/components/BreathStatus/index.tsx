'use client';

import React from "react";
import {Box, Typography} from "@mui/material";
import {PHASE_LABELS, REST_LABEL} from "@/features/breath/const";
import {describePlan} from "@/features/breath/plan";
import type {BreathRun, BreathStep, BreathTick} from "@/features/breath/types";

type Props = {
    isSoundSupported: boolean;
    /** Текущий счёт; null — цикл не идёт. */
    tick: BreathTick | null;
    /** План, с которым цикл запущен, — для строки «Играет: …». */
    plan: BreathStep[] | null;
    /** Повторения и подходы, с которыми цикл запущен. */
    run: BreathRun | null;
};

const describeRun = (run: BreathRun): string => {
    if (run.repeats === 0) return 'повторений без счёта';

    const repeats = `повторений ${run.repeats}`;

    if (run.sets <= 1) return repeats;

    return run.rest > 0
        ? `${repeats}, подходов ${run.sets}, отдых ${run.rest} c`
        : `${repeats}, подходов ${run.sets}`;
};

const BreathStatus: React.FC<Props> = ({isSoundSupported, tick, plan, run}) => {
    if (!isSoundSupported) {
        return (
            <Typography variant={'body2'} color={'error'}>
                Браузер не умеет Web Audio — сигнал здесь не заиграет.
            </Typography>
        );
    }

    return (
        <Box>
            {tick ? (
                <Typography variant={'body1'} sx={{mb: '4px'}} aria-live={'polite'}>
                    {tick.phase === 'rest' ? REST_LABEL : PHASE_LABELS[tick.phase]} {tick.count} / {tick.total}
                    {run && run.repeats > 0
                        ? ` · повторение ${tick.repeat} / ${run.repeats}${run.sets > 1 ? `, подход ${tick.set} / ${run.sets}` : ''}`
                        : null}
                </Typography>
            ) : null}
            <Typography variant={'body2'} color={'text.secondary'}>
                {tick && plan && run
                    ? `Играет: сигнал раз в секунду — ${describePlan(plan)}; ${describeRun(run)}. Вкладку лучше не сворачивать — в фоне браузер тормозит таймеры.`
                    : 'Тишина. Задайте счёт и нажмите «Запустить».'}
            </Typography>
        </Box>
    );
};

export default BreathStatus;
