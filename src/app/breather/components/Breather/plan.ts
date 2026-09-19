/**
 * План дыхательного цикла: плоский список фаз, который крутится по кругу.
 *
 * Пауз две и они независимые (после вдоха и после выдоха могут быть разной
 * длины), поэтому цикл описан списком, а не парой «вдох/выдох»: хуку остаётся
 * идти по нему подряд.
 */
export type BreathPhase = 'inhale' | 'hold' | 'exhale';

export type BreathStep = {
    phase: BreathPhase;
    count: number;
};

export const PHASE_LABELS: Record<BreathPhase, string> = {
    inhale: 'Вдох',
    hold: 'Пауза',
    exhale: 'Выдох',
};

/** Настройки цикла — то, что лежит в полях формы и в готовых практиках. */
export type BreathSettings = {
    inhale: number;
    holdAfterInhale: number;
    exhale: number;
    holdAfterExhale: number;
};

export type BreathField = keyof BreathSettings;

/**
 * Те же настройки строками — в таком виде они живут в полях ввода: пользователь
 * успевает подержать поле пустым или с мусором, числом это станет только при запуске.
 */
export type BreathSettingsInput = Record<BreathField, string>;

export const toSettingsInput = (settings: BreathSettings): BreathSettingsInput => ({
    inhale: String(settings.inhale),
    exhale: String(settings.exhale),
    holdAfterInhale: String(settings.holdAfterInhale),
    holdAfterExhale: String(settings.holdAfterExhale),
});

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
