import {buildPlan, describePlan} from "./plan";
import type {BreathSettings} from "./types";

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
