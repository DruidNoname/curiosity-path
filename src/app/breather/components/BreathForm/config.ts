import {MAX_COUNT, MAX_RUN, MIN_COUNT, MIN_HOLD, MIN_REPEATS, MIN_REST, MIN_SETS} from "@/features/breath/const";
import type {BreathField, BreathRunField, BreathRunInput, BreathSettingsInput} from "@/features/breath/types";

type FieldConfig<Key> = {
    key: Key;
    label: string;
    ariaLabel: string;
    min: number;
    max: number;
    initial: string;
};

/**
 * Порядок — это порядок в сетке 2×2: вдох и выдох в первой строке, паузы под ними,
 * каждая в своей колонке. Обе паузы подписаны одинаково («Пауза»), что понятно глазами
 * по колонке, но не на слух, — поэтому у них есть уточняющий ariaLabel.
 */
export const FIELDS: ReadonlyArray<FieldConfig<BreathField>> = [
    {key: 'inhale', label: 'Вдох', ariaLabel: 'Вдох, счётов', min: MIN_COUNT, max: MAX_COUNT, initial: '2'},
    {key: 'exhale', label: 'Выдох', ariaLabel: 'Выдох, счётов', min: MIN_COUNT, max: MAX_COUNT, initial: '4'},
    {key: 'holdAfterInhale', label: 'Пауза', ariaLabel: 'Пауза после вдоха, счётов', min: MIN_HOLD, max: MAX_COUNT, initial: '0'},
    {key: 'holdAfterExhale', label: 'Пауза', ariaLabel: 'Пауза после выдоха, счётов', min: MIN_HOLD, max: MAX_COUNT, initial: '0'},
];

/** Повторения видны всегда, подходы и отдых — только когда развёрнут спойлер. */
export const REPEATS_FIELD: FieldConfig<BreathRunField> = {
    key: 'repeats',
    label: 'Повторений',
    ariaLabel: 'Количество повторений рисунка',
    min: MIN_REPEATS,
    max: MAX_RUN,
    initial: '0',
};

export const SETS_FIELDS: ReadonlyArray<FieldConfig<BreathRunField>> = [
    {key: 'sets', label: 'Подходов', ariaLabel: 'Количество подходов', min: MIN_SETS, max: MAX_RUN, initial: '1'},
    {key: 'rest', label: 'Пауза, секунд', ariaLabel: 'Пауза между подходами, секунд', min: MIN_REST, max: MAX_RUN, initial: '0'},
];

export const INITIAL_VALUES = Object.fromEntries(
    FIELDS.map((field) => [field.key, field.initial]),
) as BreathSettingsInput;

export const INITIAL_RUN = Object.fromEntries(
    [REPEATS_FIELD, ...SETS_FIELDS].map((field) => [field.key, field.initial]),
) as BreathRunInput;
