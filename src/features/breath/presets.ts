import {buildPlan, describePlan, describeRun} from "./plan";
import type {BreathRun, BreathSettings} from "./types";

/**
 * Готовые дыхательные практики: клик по такой подставляет числа в поля, но не запускает
 * цикл — сперва можно поправить под себя.
 *
 * Схема под названием здесь не хранится, её считает `describePreset`, чтобы подпись
 * не разошлась с тем, что кнопка подставляет.
 */
export type BreathPreset = {
    name: string;
    effect: string;
    settings: BreathSettings;
};

export const BREATH_PRESETS: BreathPreset[] = [
    {
        name: 'Дыхание 1:2',
        effect: 'Удлинённый выдох включает парасимпатическую систему: замедляет пульс и снимает острое напряжение.',
        settings: {inhale: 4, holdAfterInhale: 0, exhale: 8, holdAfterExhale: 0},
    },
    {
        name: 'Квадратное дыхание',
        effect: 'Box breathing: им пользуются спасатели и военные, чтобы вернуть контроль над эмоциями в экстремальной обстановке.',
        settings: {inhale: 4, holdAfterInhale: 4, exhale: 4, holdAfterExhale: 4},
    },
    {
        name: 'Техника 4-7-8',
        effect: 'Вдох носом, задержка, плавный выдох ртом. Мощное расслабление — против бессонницы и сильной тревоги.',
        settings: {inhale: 4, holdAfterInhale: 7, exhale: 8, holdAfterExhale: 0},
    },
    {
        name: 'Короткое стабилизирующее',
        effect: 'Вдох на два счёта, выдох на один-два. Быстро выравнивает дыхание, когда оно сбилось.',
        settings: {inhale: 2, holdAfterInhale: 0, exhale: 2, holdAfterExhale: 0},
    },
];

export const describePreset = (preset: BreathPreset): string => describePlan(buildPlan(preset.settings));

/**
 * Сценарий — практика целиком: рисунок плюс повторения с подходами, то есть занятие
 * с началом и концом. Практики выше задают только рисунок и крутятся, пока не остановят.
 */
export type BreathScenario = {
    name: string;
    settings: BreathSettings;
    run: BreathRun;
};

export const BREATH_SCENARIOS: BreathScenario[] = [
    {
        name: 'Упр.1 (с лентой)',
        settings: {inhale: 3, holdAfterInhale: 1, exhale: 3, holdAfterExhale: 1},
        run: {repeats: 13, sets: 6, rest: 10},
    },
    {
        name: 'Упр.2 (на когтеточке)',
        settings: {inhale: 2, holdAfterInhale: 1, exhale: 4, holdAfterExhale: 1},
        run: {repeats: 7, sets: 6, rest: 5},
    },
    {
        name: 'Упр.3 (сгибание ноги)',
        settings: {inhale: 3, holdAfterInhale: 2, exhale: 3, holdAfterExhale: 2},
        run: {repeats: 13, sets: 6, rest: 5},
    },
    {
        name: 'Упр.4 (грушевидная)',
        settings: {inhale: 2, holdAfterInhale: 7, exhale: 3, holdAfterExhale: 8},
        run: {repeats: 5, sets: 2, rest: 5},
    },
    {
        name: 'Упр.5 (минуты и разы)',
        settings: {inhale: 3, holdAfterInhale: 0, exhale: 3, holdAfterExhale: 0},
        run: {repeats: 10, sets: 2, rest: 10},
    }
];

export const describeScenario = (scenario: BreathScenario): string =>
    `${describePlan(buildPlan(scenario.settings))} · ${describeRun(scenario.run)}`;
