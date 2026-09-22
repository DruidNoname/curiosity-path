import {buildPlan, describePlan, describeRun, isValidCount, parseSettings, toRunInput} from './plan';

describe('buildPlan', () => {
    it('без пауз оставляет только вдох и выдох', () => {
        expect(buildPlan({inhale: 2, holdAfterInhale: 0, exhale: 4, holdAfterExhale: 0})).toEqual([
            {phase: 'inhale', count: 2},
            {phase: 'exhale', count: 4},
        ]);
    });

    it('ставит паузу после вдоха', () => {
        expect(buildPlan({inhale: 2, holdAfterInhale: 3, exhale: 4, holdAfterExhale: 0})).toEqual([
            {phase: 'inhale', count: 2},
            {phase: 'hold', count: 3},
            {phase: 'exhale', count: 4},
        ]);
    });

    it('ставит паузу после выдоха', () => {
        expect(buildPlan({inhale: 2, holdAfterInhale: 0, exhale: 4, holdAfterExhale: 3})).toEqual([
            {phase: 'inhale', count: 2},
            {phase: 'exhale', count: 4},
            {phase: 'hold', count: 3},
        ]);
    });

    it('держит паузы разной длины', () => {
        expect(buildPlan({inhale: 4, holdAfterInhale: 7, exhale: 8, holdAfterExhale: 2})).toEqual([
            {phase: 'inhale', count: 4},
            {phase: 'hold', count: 7},
            {phase: 'exhale', count: 8},
            {phase: 'hold', count: 2},
        ]);
    });
});

describe('describePlan', () => {
    it('перечисляет фазы по порядку', () => {
        const plan = buildPlan({inhale: 2, holdAfterInhale: 3, exhale: 4, holdAfterExhale: 0});

        expect(describePlan(plan)).toBe('вдох 2, пауза 3, выдох 4');
    });
});

describe('isValidCount', () => {
    it('принимает целое в границах', () => {
        expect(isValidCount('4', 1)).toBe(true);
        expect(isValidCount(' 4 ', 1)).toBe(true);
    });

    it('отбивает ноль там, где минимум единица, и наоборот пропускает его у паузы', () => {
        expect(isValidCount('0', 1)).toBe(false);
        expect(isValidCount('0', 0)).toBe(true);
    });

    it('отбивает мусор, дроби и выход за верхнюю границу', () => {
        expect(isValidCount('', 1)).toBe(false);
        expect(isValidCount('абв', 1)).toBe(false);
        expect(isValidCount('2.5', 1)).toBe(false);
        expect(isValidCount('61', 1)).toBe(false);
    });
});

describe('parseSettings', () => {
    it('переводит строки полей в числа', () => {
        expect(parseSettings({inhale: '4', holdAfterInhale: '7', exhale: '8', holdAfterExhale: '0'})).toEqual({
            inhale: 4,
            holdAfterInhale: 7,
            exhale: 8,
            holdAfterExhale: 0,
        });
    });
});

describe('isValidCount с нестандартным максимумом', () => {
    it('пропускает то, что выходит за счёт фаз, но укладывается в свой предел', () => {
        expect(isValidCount('90', 0)).toBe(false);
        expect(isValidCount('90', 0, 99)).toBe(true);
        expect(isValidCount('100', 0, 99)).toBe(false);
    });
});

describe('toRunInput и describeRun', () => {
    it('переводит прогон в строки полей', () => {
        expect(toRunInput({repeats: 13, sets: 6, rest: 10})).toEqual({
            repeats: '13',
            sets: '6',
            rest: '10',
        });
    });

    it('описывает прогон словами, опуская незаданное', () => {
        expect(describeRun({repeats: 0, sets: 1, rest: 0})).toBe('повторений без счёта');
        expect(describeRun({repeats: 5, sets: 1, rest: 0})).toBe('повторений 5');
        expect(describeRun({repeats: 11, sets: 6, rest: 0})).toBe('повторений 11, подходов 6');
        expect(describeRun({repeats: 13, sets: 6, rest: 10})).toBe('повторений 13, подходов 6, отдых 10 c');
    });
});
