import {createStemMatcher, getQueryStems, stemWord} from './stem';

const marked = (text: string, query: string) =>
    (createStemMatcher(query)?.(text) ?? []).map(([start, end]) => text.slice(start, end));

describe('stemWord', () => {
    it('сводит формы слова к одной основе, ё = е', () => {
        expect(new Set(['лес', 'лесу', 'лесом', 'Леса'].map(stemWord))).toEqual(new Set(['лес']));
        expect(stemWord('ёлочка')).toBe(stemWord('елочка'));
    });

    it('служебные слова отбрасывает', () => {
        expect(stemWord('По')).toBeNull();
    });

    it('латиницу стеммит английским', () => {
        expect(stemWord('Hooks')).toBe(stemWord('hook'));
    });
});

describe('getQueryStems', () => {
    it('основы запроса без служебных слов и знаков', () => {
        expect(getQueryStems('по лесу, лесом!')).toEqual(new Set(['лес']));
    });
});

describe('createStemMatcher', () => {
    it('находит формы слова целиком, но не подстроку в чужом слове', () => {
        expect(marked('Тыгыдыкала по Лесу, а всплески и прелесть не про лес.', 'лес'))
            .toEqual(['Лесу', 'лес']);
    });

    it('запрос из одних служебных слов — нечего искать', () => {
        expect(createStemMatcher('и в на')).toBeNull();
    });
});
