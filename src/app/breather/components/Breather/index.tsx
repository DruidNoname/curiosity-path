'use client';

import React from "react";
import {Box, Typography} from "@mui/material";
import styles from './style.module.css';
import {useBreathCycle} from "./useBreathCycle";
import {
    buildPlan,
    describePlan,
    PHASE_LABELS,
    toSettingsInput,
    type BreathField,
    type BreathSettings,
    type BreathSettingsInput,
    type BreathStep,
} from "./plan";
import BreathForm from "./components/BreathForm";
import {INITIAL_VALUES} from "./components/BreathForm/config";
import BreathPresets from "./components/BreathPresets";

const Breather: React.FC = () => {
    // Значения полей живут здесь, а не в форме: их подставляют ещё и готовые практики
    // из соседней колонки.
    const [values, setValues] = React.useState<BreathSettingsInput>(INITIAL_VALUES);
    const [running, setRunning] = React.useState<BreathStep[] | null>(null);
    const {isRunning, tick, isSupported, start, stop} = useBreathCycle();

    const handleChange = (key: BreathField, value: string) => {
        setValues((prev) => ({...prev, [key]: value}));
    };

    // Практика только подставляет числа: запускать за пользователя рано, вдруг он
    // хочет поправить счёт под себя.
    const handleApplyPreset = (settings: BreathSettings) => setValues(toSettingsInput(settings));

    const handleStart = (settings: BreathSettings) => {
        const plan = buildPlan(settings);

        // Повторный «Запустить» на ходу — это смена плана: start сам гасит предыдущий цикл.
        start(plan);
        setRunning(plan);
    };

    const handleStop = () => {
        stop();
        setRunning(null);
    };

    return (
        <Box>
            <Box className={styles.Layout}>
                {/* Состояние цикла живёт в колонке формы: справа стоят практики, и под
                    общим блоком строка «Тишина…» повисала бы уже под ними. */}
                <Box className={styles.FormColumn}>
                    <BreathForm
                        values={values}
                        onChange={handleChange}
                        onStart={handleStart}
                        onStop={handleStop}
                        isRunning={isRunning}
                        isSoundSupported={isSupported}
                    />

                    {!isSupported ? (
                        <Typography variant={'body2'} color={'error'} sx={{mt: '16px'}}>
                            Браузер не умеет Web Audio — сигнал здесь не заиграет.
                        </Typography>
                    ) : (
                        <Box sx={{mt: '16px'}}>
                            {tick ? (
                                <Typography variant={'body1'} sx={{mb: '4px'}} aria-live={'polite'}>
                                    {PHASE_LABELS[tick.phase]} {tick.count} / {tick.total}
                                </Typography>
                            ) : null}
                            <Typography variant={'body2'} color={'text.secondary'}>
                                {isRunning && running
                                    ? `Играет: сигнал раз в секунду — ${describePlan(running)}. Вкладку лучше не сворачивать — в фоне браузер тормозит таймеры.`
                                    : 'Тишина. Задайте счёт и нажмите «Запустить».'}
                            </Typography>
                        </Box>
                    )}
                </Box>

                <BreathPresets values={values} onApply={handleApplyPreset} disabled={isRunning} />
            </Box>
        </Box>
    );
};

export default Breather;
