/** Фаза дыхательного цикла. */
export type BreathPhase = 'inhale' | 'hold' | 'exhale';

/** Шаг плана: фаза и сколько счётов она держится. */
export type BreathStep = {
    phase: BreathPhase;
    count: number;
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

/**
 * Как запускают рисунок: сколько раз повторить, сколько таких подходов сделать
 * и сколько отдыхать между ними.
 */
export type BreathRun = {
    /** Повторений рисунка в подходе; 0 — пока не остановят руками. */
    repeats: number;
    /** Подходов; считается только при заданных повторениях. */
    sets: number;
    /** Пауза между подходами в секундах; во время неё играет белый шум. */
    rest: number;
};

export type BreathRunField = keyof BreathRun;

/** Те же параметры строками — в таком виде они живут в полях ввода. */
export type BreathRunInput = Record<BreathRunField, string>;

/**
 * Что сейчас звучит: фаза рисунка или отдых между подходами, номер счёта (1-based),
 * длина текущего отрезка и место в прогоне — номер повторения и подхода.
 */
export type BreathTick = {
    phase: BreathPhase | 'rest';
    count: number;
    total: number;
    repeat: number;
    set: number;
};
