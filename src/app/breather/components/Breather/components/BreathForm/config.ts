import type {BreathField, BreathSettingsInput} from "../../plan";

/** Счёт фазы — целое число секунд; верхняя граница просто отсекает опечатки вроде 600. */
export const MIN_COUNT = 1;
export const MIN_HOLD = 0;
export const MAX_COUNT = 60;

type FieldConfig = {
    key: BreathField;
    label: string;
    ariaLabel: string;
    min: number;
    initial: string;
};

/**
 * Порядок — это порядок в сетке 2×2: вдох и выдох в первой строке, паузы под ними,
 * каждая в своей колонке. Обе паузы подписаны одинаково («Пауза»), что понятно глазами
 * по колонке, но не на слух, — поэтому у них есть уточняющий ariaLabel.
 */
export const FIELDS: ReadonlyArray<FieldConfig> = [
    {key: 'inhale', label: 'Вдох', ariaLabel: 'Вдох, счётов', min: MIN_COUNT, initial: '2'},
    {key: 'exhale', label: 'Выдох', ariaLabel: 'Выдох, счётов', min: MIN_COUNT, initial: '4'},
    {key: 'holdAfterInhale', label: 'Пауза', ariaLabel: 'Пауза после вдоха, счётов', min: MIN_HOLD, initial: '0'},
    {key: 'holdAfterExhale', label: 'Пауза', ariaLabel: 'Пауза после выдоха, счётов', min: MIN_HOLD, initial: '0'},
];

export const INITIAL_VALUES = Object.fromEntries(
    FIELDS.map((field) => [field.key, field.initial]),
) as BreathSettingsInput;
