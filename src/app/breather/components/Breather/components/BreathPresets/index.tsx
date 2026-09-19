'use client';

import React from "react";
import {Box, Tooltip, Typography} from "@mui/material";
import styles from './style.module.css';
import TextButton from "@/ui/Buttons/TextButton";
import {buildPlan, describePlan, toSettingsInput, type BreathSettings, type BreathSettingsInput} from "../../plan";
import {BREATH_PRESETS, type BreathPreset} from "./config";

type Props = {
    /** Текущее содержимое полей — по нему подсвечивается практика, которая сейчас набрана. */
    values: BreathSettingsInput;
    onApply: (settings: BreathSettings) => void;
    /** Пока цикл играет, практики тоже недоступны — подставлять им некуда. */
    disabled?: boolean;
};

const describePreset = (preset: BreathPreset): string => describePlan(buildPlan(preset.settings));

const isPresetActive = (preset: BreathPreset, values: BreathSettingsInput): boolean => {
    const presetValues = toSettingsInput(preset.settings);

    return (Object.keys(presetValues) as Array<keyof BreathSettingsInput>)
        .every((key) => presetValues[key] === values[key]);
};

const BreathPresets: React.FC<Props> = ({values, onApply, disabled}) => {
    return (
        <Box className={styles.Presets}>
            <Typography variant={'body1'}>
                Готовые практики
            </Typography>
            {BREATH_PRESETS.map((preset) => (
                <Tooltip key={preset.name} title={preset.effect} placement={'top'}>
                    <TextButton
                        hint={describePreset(preset)}
                        selected={isPresetActive(preset, values)}
                        disabled={disabled}
                        onClick={() => onApply(preset.settings)}
                    >
                        {preset.name}
                    </TextButton>
                </Tooltip>
            ))}
        </Box>
    );
};

export default BreathPresets;
