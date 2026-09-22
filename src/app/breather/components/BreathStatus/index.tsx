'use client';

import React from "react";
import {Typography} from "@mui/material";

type Props = {
    isSoundSupported: boolean;
    /** Прогон жив — идёт или стоит на паузе. Тогда счёт показывает окно поверх формы. */
    isActive: boolean;
};

/**
 * Строка под формой — только для состояния покоя: пока прогон идёт, форму всё равно
 * закрывает окно со счётом, и дублировать его здесь незачем.
 */
const BreathStatus: React.FC<Props> = ({isSoundSupported, isActive}) => {
    if (!isSoundSupported) {
        return (
            <Typography variant={'body2'} color={'error'}>
                Браузер не умеет Web Audio — сигнал здесь не заиграет.
            </Typography>
        );
    }

    if (isActive) return null;

    return (
        <Typography variant={'body2'} color={'text.secondary'}>
            Тишина. Задайте счёт и нажмите «Запустить». Во время занятия вкладку лучше
            не сворачивать — в фоне браузер тормозит таймеры.
        </Typography>
    );
};

export default BreathStatus;
