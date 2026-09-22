import {MAX_COUNT, PHASE_LABELS} from "./const";
import type {BreathRun, BreathRunInput, BreathSettings, BreathSettingsInput, BreathStep} from "./types";

/**
 * План дыхательного цикла: плоский список фаз, который крутится по кругу.
 *
 * Пауз две и они независимые (после вдоха и после выдоха могут быть разной
 * длины), поэтому цикл описан списком, а не парой «вдох/выдох»: таймеру остаётся
 * идти по нему подряд.
 */
export const buildPlan = ({inhale, holdAfterInhale, exhale, holdAfterExhale}: BreathSettings): BreathStep[] => {
    // Пауза в ноль счётов — это просто её отсутствие, в план она не попадает.
    return [
        {phase: 'inhale' as const, count: inhale},
        ...(holdAfterInhale > 0 ? [{phase: 'hold' as const, count: holdAfterInhale}] : []),
        {phase: 'exhale' as const, count: exhale},
        ...(holdAfterExhale > 0 ? [{phase: 'hold' as const, count: holdAfterExhale}] : []),
    ];
};

export const describePlan = (plan: BreathStep[]): string =>
    plan.map((step) => `${PHASE_LABELS[step.phase].toLowerCase()} ${step.count}`).join(', ');

export const toSettingsInput = (settings: BreathSettings): BreathSettingsInput => ({
    inhale: String(settings.inhale),
    exhale: String(settings.exhale),
    holdAfterInhale: String(settings.holdAfterInhale),
    holdAfterExhale: String(settings.holdAfterExhale),
});

export const parseCount = (value: string): number => Number(value.trim());

/**
 * Целое в своих границах. Минимум у каждого поля свой (у вдоха с выдохом 1, у пауз 0),
 * максимум по умолчанию общий для счёта фаз, но у повторений и подходов он другой.
 */
export const isValidCount = (value: string, min: number, max: number = MAX_COUNT): boolean => {
    const count = parseCount(value);

    return Number.isInteger(count) && count >= min && count <= max;
};

export const toRunInput = (run: BreathRun): BreathRunInput => ({
    repeats: String(run.repeats),
    sets: String(run.sets),
    rest: String(run.rest),
});

/** Человеческое описание прогона — для подписей практик и строки состояния. */
export const describeRun = (run: BreathRun): string => {
    if (run.repeats === 0) return 'повторений без счёта';

    const repeats = `повторений ${run.repeats}`;

    if (run.sets <= 1) return repeats;

    return run.rest > 0
        ? `${repeats}, подходов ${run.sets}, отдых ${run.rest} c`
        : `${repeats}, подходов ${run.sets}`;
};

export const parseRun = (values: BreathRunInput): BreathRun => ({
    repeats: parseCount(values.repeats),
    sets: parseCount(values.sets),
    rest: parseCount(values.rest),
});

export const parseSettings = (values: BreathSettingsInput): BreathSettings => ({
    inhale: parseCount(values.inhale),
    holdAfterInhale: parseCount(values.holdAfterInhale),
    exhale: parseCount(values.exhale),
    holdAfterExhale: parseCount(values.holdAfterExhale),
});
