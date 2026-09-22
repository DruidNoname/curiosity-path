'use client';

import React from "react";
import {Box, Tooltip, Typography} from "@mui/material";
import styles from './style.module.css';
import TextButton from "@/ui/Buttons/TextButton";
import Spoiler from "@/ui/Spoiler";
import {toRunInput, toSettingsInput} from "@/features/breath/plan";
import {
    BREATH_PRESETS,
    BREATH_SCENARIOS,
    describePreset,
    describeScenario,
    type BreathPreset,
    type BreathScenario,
} from "@/features/breath/presets";
import type {BreathRun, BreathRunInput, BreathSettings, BreathSettingsInput} from "@/features/breath/types";

type Props = {
    /** Текущее содержимое полей — по нему подсвечивается практика, которая сейчас набрана. */
    values: BreathSettingsInput;
    /** Повторения и подходы из полей — сценарий задаёт и их тоже. */
    run: BreathRunInput;
    onApply: (settings: BreathSettings) => void;
    onApplyScenario: (settings: BreathSettings, run: BreathRun) => void;
    /** Пока цикл играет, практики тоже недоступны — подставлять им некуда. */
    disabled?: boolean;
};

const isSameInput = <T extends Record<string, string>>(preset: T, current: T): boolean =>
    (Object.keys(preset) as Array<keyof T>).every((key) => preset[key] === current[key]);

const isPresetActive = (preset: BreathPreset, values: BreathSettingsInput): boolean =>
    isSameInput(toSettingsInput(preset.settings), values);

const isScenarioActive = (
    scenario: BreathScenario,
    values: BreathSettingsInput,
    run: BreathRunInput,
): boolean =>
    isSameInput(toSettingsInput(scenario.settings), values) && isSameInput(toRunInput(scenario.run), run);

const BreathPresets: React.FC<Props> = ({values, run, onApply, onApplyScenario, disabled}) => {
    return (
        <Box className={styles.Presets}>
            <Typography variant={'body2'} color={'text.secondary'}>
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

            {/* Сценарии задают ещё и повторения с подходами, поэтому стоят отдельно. */}
            <Spoiler summary={'Нужно сейчас'} className={styles.Spoiler}>
                <Box className={styles.Scenarios}>
                    {BREATH_SCENARIOS.map((scenario) => (
                        <TextButton
                            key={scenario.name}
                            hint={describeScenario(scenario)}
                            selected={isScenarioActive(scenario, values, run)}
                            disabled={disabled}
                            onClick={() => onApplyScenario(scenario.settings, scenario.run)}
                        >
                            {scenario.name}
                        </TextButton>
                    ))}
                </Box>
            </Spoiler>
        </Box>
    );
};

export default BreathPresets;
