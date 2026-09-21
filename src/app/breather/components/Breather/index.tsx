'use client';

import React from "react";
import {Box} from "@mui/material";
import styles from './style.module.css';
import {useBreathCycle} from "@/features/breath/hooks";
import {buildPlan, toSettingsInput} from "@/features/breath/plan";
import type {
    BreathField,
    BreathRun,
    BreathRunField,
    BreathRunInput,
    BreathSettings,
    BreathSettingsInput,
    BreathStep,
} from "@/features/breath/types";
import BreathForm from "../BreathForm";
import {INITIAL_RUN, INITIAL_VALUES} from "../BreathForm/config";
import BreathPresets from "../BreathPresets";
import BreathStatus from "../BreathStatus";

const Breather: React.FC = () => {
    // Значения полей живут здесь, а не в форме: рисунок подставляют ещё и готовые
    // практики из соседней колонки.
    const [values, setValues] = React.useState<BreathSettingsInput>(INITIAL_VALUES);
    const [run, setRun] = React.useState<BreathRunInput>(INITIAL_RUN);
    const [runningPlan, setRunningPlan] = React.useState<BreathStep[] | null>(null);
    const [runningRun, setRunningRun] = React.useState<BreathRun | null>(null);
    const {isRunning, tick, isSupported, start, stop} = useBreathCycle();

    const handleChange = (key: BreathField, value: string) => {
        setValues((prev) => ({...prev, [key]: value}));
    };

    const handleRunChange = (key: BreathRunField, value: string) => {
        setRun((prev) => ({...prev, [key]: value}));
    };

    // Практика только подставляет числа: запускать за пользователя рано, вдруг он
    // хочет поправить счёт под себя.
    const handleApplyPreset = (settings: BreathSettings) => setValues(toSettingsInput(settings));

    const handleStart = (settings: BreathSettings, nextRun: BreathRun) => {
        const plan = buildPlan(settings);

        start(plan, nextRun);
        setRunningPlan(plan);
        setRunningRun(nextRun);
    };

    const handleStop = () => {
        stop();
        setRunningPlan(null);
        setRunningRun(null);
    };

    return (
        <Box className={styles.Layout}>
            {/* Состояние цикла живёт в колонке формы: справа стоят практики, и под
                общим блоком строка «Тишина…» повисала бы уже под ними. */}
            <Box className={styles.FormColumn}>
                <BreathForm
                    values={values}
                    run={run}
                    onChange={handleChange}
                    onRunChange={handleRunChange}
                    onStart={handleStart}
                    onStop={handleStop}
                    isRunning={isRunning}
                    isSoundSupported={isSupported}
                />

                <Box sx={{mt: '16px'}}>
                    <BreathStatus
                        isSoundSupported={isSupported}
                        tick={tick}
                        plan={runningPlan}
                        run={runningRun}
                    />
                </Box>
            </Box>

            <BreathPresets values={values} onApply={handleApplyPreset} disabled={isRunning} />
        </Box>
    );
};

export default Breather;
