'use client';

import React from "react";
import {Box, Button, TextField, Typography} from "@mui/material";
import styles from './style.module.css';
import type {BreathField, BreathSettings, BreathSettingsInput} from "../../plan";
import {FIELDS, MAX_COUNT, MIN_HOLD} from "./config";

type Props = {
    values: BreathSettingsInput;
    onChange: (key: BreathField, value: string) => void;
    onStart: (settings: BreathSettings) => void;
    onStop: () => void;
    isRunning: boolean;
    isSoundSupported: boolean;
};

const parseCount = (value: string): number => Number(value.trim());

const isValidCount = (value: string, min: number): boolean => {
    const count = parseCount(value);

    return Number.isInteger(count) && count >= min && count <= MAX_COUNT;
};

const BreathForm: React.FC<Props> = ({values, onChange, onStart, onStop, isRunning, isSoundSupported}) => {
    const isValid = FIELDS.every((field) => isValidCount(values[field.key], field.min));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Кнопка одна на оба состояния, и ветвление живёт здесь, а не в её `type`:
        // React успевает перерисовать кнопку в submit прямо внутри обработки клика,
        // и браузер тут же сабмитил форму — остановка оборачивалась перезапуском.
        if (isRunning) {
            onStop();
            return;
        }

        if (!isValid) return;

        onStart({
            inhale: parseCount(values.inhale),
            holdAfterInhale: parseCount(values.holdAfterInhale),
            exhale: parseCount(values.exhale),
            holdAfterExhale: parseCount(values.holdAfterExhale),
        });
    };

    return (
        <Box component={'form'} onSubmit={handleSubmit} className={styles.Form}>
            <Box className={styles.Frame}>
                <Box className={styles.Fields}>
                    {FIELDS.map((field) => {
                        const value = values[field.key];
                        const isInvalid = value.trim() !== '' && !isValidCount(value, field.min);

                        return (
                            <TextField
                                key={field.key}
                                type={'number'}
                                size={'small'}
                                value={value}
                                onChange={(e) => onChange(field.key, e.target.value)}
                                label={field.label}
                                // Пока цикл играет, счёт не меняется: иначе поля
                                // расходились бы с тем, что звучит.
                                disabled={isRunning}
                                error={isInvalid}
                                // Подсказка появляется только по ошибке: в сетке из четырёх полей
                                // постоянные пояснения под каждым — лишний шум.
                                helperText={isInvalid ? `От ${field.min} до ${MAX_COUNT}` : undefined}
                                slotProps={{
                                    htmlInput: {
                                        min: field.min,
                                        max: MAX_COUNT,
                                        step: 1,
                                        inputMode: 'numeric',
                                        'aria-label': field.ariaLabel,
                                    },
                                }}
                            />
                        );
                    })}
                </Box>

                <Typography variant={'caption'} component={'p'} color={'text.secondary'} sx={{mb: '24px'}}>
                    {MIN_HOLD} — без паузы
                </Typography>

                <Button
                    type={'submit'}
                    variant={'contained'}
                    fullWidth
                    disabled={!isRunning && (!isValid || !isSoundSupported)}
                >
                    {isRunning ? 'Остановить' : 'Запустить'}
                </Button>
            </Box>
        </Box>
    );
};

export default BreathForm;
