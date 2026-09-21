import type {BreathPhase} from "./types";

/** Шаг метронома: один счёт — одна секунда. */
export const TICK_MS = 1000;

/**
 * Фазы различаются на слух, чтобы не приходилось смотреть на экран: вдох и выдох —
 * чистые тона (выше и ниже), пауза — сухой щелчок из шума. Разная природа звука
 * отличается надёжнее, чем третья высота между двумя первыми.
 *
 * `hz` у щелчка — центр полосы фильтра, а не высота тона.
 */
export type PhaseSound =
    | {kind: 'tone'; hz: number; volume: number}
    | {kind: 'click'; hz: number; volume: number};

export const PHASE_SOUNDS: Record<BreathPhase, PhaseSound> = {
    inhale: {kind: 'tone', hz: 660, volume: 0.25},
    hold: {kind: 'click', hz: 1400, volume: 0.35},
    exhale: {kind: 'tone', hz: 440, volume: 0.25},
};

/**
 * Упреждение планирования. Аудиодвижок считает звук блоками по 128 сэмплов, и событие,
 * поставленное ровно на `currentTime`, попадает в уже рендерящийся блок: источник
 * стартует с опозданием, а огибающая громкости, которая считается по абсолютному
 * времени, успевает уйти вниз — щелчок выходит тише. Эти 20 мс на слух незаметны,
 * зато все события гарантированно в будущем.
 */
export const SCHEDULE_AHEAD_SECONDS = 0.02;

export const BEEP_SECONDS = 0.18;
export const ATTACK_SECONDS = 0.02;
export const CLICK_SECONDS = 0.05;

export const PHASE_LABELS: Record<BreathPhase, string> = {
    inhale: 'Вдох',
    hold: 'Пауза',
    exhale: 'Выдох',
};

/** Счёт фазы — целое число секунд; верхняя граница просто отсекает опечатки вроде 600. */
export const MIN_COUNT = 1;
export const MIN_HOLD = 0;
export const MAX_COUNT = 30;

/**
 * Повторение — один проход рисунка; подход — группа повторений. Ноль повторений
 * означает «сколько получится, пока не остановят», и тогда подходы не считаются:
 * бесконечный подход не кончится, чтобы начался следующий.
 */
export const MIN_REPEATS = 0;
export const MIN_SETS = 1;
export const MIN_REST = 0;
export const MAX_RUN = 99;

/** Подпись отдыха между подходами — не фаза рисунка, поэтому отдельно от PHASE_LABELS. */
export const REST_LABEL = 'Отдых';

/** Белый шум в паузе между подходами: тихий фон с плавными краями. */
export const NOISE_VOLUME = 0.04;
export const NOISE_FADE_SECONDS = 0.15;
/** Секунда шума, которая крутится по кругу, — из неё же берётся щелчок паузы. */
export const NOISE_BUFFER_SECONDS = 1;
