'use client';

import React from "react";
import {Box} from "@mui/material";
import styles from './style.module.css';
import {useBreathCycle} from "@/features/breath/hooks";
import {buildPlan, toRunInput, toSettingsInput} from "@/features/breath/plan";
import type {
    BreathField,
    BreathRun,
    BreathRunField,
    BreathRunInput,
    BreathSettings,
    BreathSettingsInput,
} from "@/features/breath/types";
import BreathForm from "../BreathForm";
import {INITIAL_RUN, INITIAL_VALUES} from "../BreathForm/config";
import BreathPresets from "../BreathPresets";
import BreathRunDialog from "../BreathRunDialog";
import BreathStatus from "../BreathStatus";

const Breather: React.FC = () => {
    // Значения полей живут здесь, а не в форме: рисунок подставляют ещё и готовые
    // практики из соседней колонки.
    const [values, setValues] = React.useState<BreathSettingsInput>(INITIAL_VALUES);
    const [run, setRun] = React.useState<BreathRunInput>(INITIAL_RUN);
    const [runningRun, setRunningRun] = React.useState<BreathRun | null>(null);
    const {isRunning, isPaused, tick, isSupported, start, pause, resume, stop} = useBreathCycle();

    const handleChange = (key: BreathField, value: string) => {
        setValues((prev) => ({...prev, [key]: value}));
    };

    const handleRunChange = (key: BreathRunField, value: string) => {
        setRun((prev) => ({...prev, [key]: value}));
    };

    // Практика только подставляет числа: запускать за пользователя рано, вдруг он
    // хочет поправить счёт под себя.
    const handleApplyPreset = (settings: BreathSettings) => setValues(toSettingsInput(settings));

    // Сценарий — это практика целиком, вместе с повторениями и подходами.
    const handleApplyScenario = (settings: BreathSettings, nextRun: BreathRun) => {
        setValues(toSettingsInput(settings));
        setRun(toRunInput(nextRun));
    };

    const handleStart = (settings: BreathSettings, nextRun: BreathRun) => {
        start(buildPlan(settings), nextRun);
        setRunningRun(nextRun);
    };

    const handleStop = () => {
        stop();
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
                    isPaused={isPaused}
                    isSoundSupported={isSupported}
                />

                <Box sx={{mt: '16px'}}>
                    <BreathStatus isSoundSupported={isSupported} isActive={isRunning || isPaused} />
                </Box>
            </Box>

            <BreathPresets
                values={values}
                run={run}
                onApply={handleApplyPreset}
                onApplyScenario={handleApplyScenario}
                disabled={isRunning || isPaused}
            />

            {/* Пока прогон идёт, смотреть на форму незачем — счёт показывается поверх неё. */}
            <BreathRunDialog
                tick={tick}
                run={runningRun}
                isPaused={isPaused}
                onPause={pause}
                onResume={resume}
                onStop={handleStop}
            />
        </Box>
    );
};

export default Breather;
