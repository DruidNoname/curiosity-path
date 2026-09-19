import {buildPlan, describePlan} from './plan';

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
