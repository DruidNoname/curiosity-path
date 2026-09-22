'use client';

import React from "react";
import {Box, Button, TextField, Typography} from "@mui/material";
import styles from './style.module.css';
import Spoiler from "@/ui/Spoiler";
import {MIN_HOLD} from "@/features/breath/const";
import {isValidCount, parseRun, parseSettings} from "@/features/breath/plan";
import type {
    BreathField,
    BreathRun,
    BreathRunField,
    BreathRunInput,
    BreathSettings,
    BreathSettingsInput,
} from "@/features/breath/types";
import {FIELDS, REPEATS_FIELD, SETS_FIELDS} from "./config";

type Props = {
    values: BreathSettingsInput;
    run: BreathRunInput;
    onChange: (key: BreathField, value: string) => void;
    onRunChange: (key: BreathRunField, value: string) => void;
    onStart: (settings: BreathSettings, run: BreathRun) => void;
    onStop: () => void;
    onPause: () => void;
    onResume: () => void;
    isRunning: boolean;
    isPaused: boolean;
    isSoundSupported: boolean;
};

const BreathForm: React.FC<Props> = ({
    values,
    run,
    onChange,
    onRunChange,
    onStart,
    onStop,
    onPause,
    onResume,
    isRunning,
    isPaused,
    isSoundSupported,
}) => {
    // Пока прогон жив — идёт он или стоит на паузе — счёт не трогаем: позиция
    // уже отсчитана от этих чисел.
    const isActive = isRunning || isPaused;
    const isValid = FIELDS.every((field) => isValidCount(values[field.key], field.min, field.max))
        && [REPEATS_FIELD, ...SETS_FIELDS].every((field) => isValidCount(run[field.key], field.min, field.max));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Кнопка одна на оба состояния, и ветвление живёт здесь, а не в её `type`:
        // React успевает перерисовать кнопку в submit прямо внутри обработки клика,
        // и браузер тут же сабмитил форму — остановка оборачивалась перезапуском.
        if (isActive) {
            onStop();
            return;
        }

        if (!isValid) return;

        onStart(parseSettings(values), parseRun(run));
    };

    const renderField = (
        field: {label: string; ariaLabel: string; min: number; max: number},
        value: string,
        onFieldChange: (next: string) => void,
    ) => {
        const isInvalid = value.trim() !== '' && !isValidCount(value, field.min, field.max);

        return (
            <TextField
                type={'number'}
                size={'small'}
                value={value}
                onChange={(e) => onFieldChange(e.target.value)}
                label={field.label}
                // Пока цикл живёт, счёт не меняется: иначе поля расходились бы с тем,
                // что звучит.
                disabled={isActive}
                error={isInvalid}
                // Подсказка появляется только по ошибке: постоянные пояснения под
                // каждым полем — лишний шум.
                helperText={isInvalid ? `От ${field.min} до ${field.max}` : undefined}
                slotProps={{
                    htmlInput: {
                        min: field.min,
                        max: field.max,
                        step: 1,
                        inputMode: 'numeric',
                        'aria-label': field.ariaLabel,
                    },
                }}
            />
        );
    };

    return (
        <Box component={'form'} onSubmit={handleSubmit} className={styles.Form}>
            <Box className={styles.Frame}>
                <Box className={styles.Groups}>
                <Box component={'fieldset'} className={styles.Group}>
                    <Box component={'legend'} className={styles.Legend}>
                        Дыхательный рисунок
                    </Box>

                    <Box className={styles.Fields}>
                        {FIELDS.map((field) => (
                            <React.Fragment key={field.key}>
                                {renderField(field, values[field.key], (next) => onChange(field.key, next))}
                            </React.Fragment>
                        ))}
                    </Box>

                    <Typography variant={'caption'} component={'span'} color={'text.secondary'} className={styles.Hint}>
                        {MIN_HOLD} — без паузы
                    </Typography>
                </Box>

                <Box component={'fieldset'} className={styles.Group}>
                    <Box component={'legend'} className={styles.Legend}>
                        Кол-во повторений
                    </Box>

                    <Box className={styles.Fields}>
                        {renderField(REPEATS_FIELD, run.repeats, (next) => onRunChange('repeats', next))}
                    </Box>

                    <Typography variant={'caption'} component={'span'} color={'text.secondary'} className={styles.Hint}>
                        0 — кол-во повторений не задано
                    </Typography>

                    {/* Подходы нужны не всем — прячем их за спойлер. */}
                    <Spoiler summary={'Задать количество подходов'} className={styles.Spoiler}>
                        <Box className={styles.Fields} sx={{mt: '16px'}}>
                            {SETS_FIELDS.map((field) => (
                                <React.Fragment key={field.key}>
                                    {renderField(field, run[field.key], (next) => onRunChange(field.key, next))}
                                </React.Fragment>
                            ))}
                        </Box>

                        <Typography
                            variant={'caption'}
                            component={'p'}
                            color={'text.secondary'}
                            className={styles.Hint}
                            sx={{mt: '8px'}}
                        >
                            В паузе между подходами играет белый шум
                        </Typography>
                    </Spoiler>
                </Box>
                </Box>

                <Box className={styles.Actions}>
                    <Button
                        type={'button'}
                        variant={'outlined'}
                        size={'small'}
                        onClick={isPaused ? onResume : onPause}
                        disabled={!isActive}
                    >
                        {isPaused ? 'Продолжить' : 'Пауза'}
                    </Button>
                    <Button
                        type={'submit'}
                        variant={'contained'}
                        size={'small'}
                        disabled={!isActive && (!isValid || !isSoundSupported)}
                    >
                        {isActive ? 'Остановить' : 'Запустить'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default BreathForm;
