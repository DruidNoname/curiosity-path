import { renderHook, act } from '@testing-library/react';
import { useBackNavigation } from './index';

const push = jest.fn();
const back = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push, back }),
}));

type FakeNavigation = EventTarget & { currentEntry: { index: number } | null };

const setNavigation = (navigation: FakeNavigation | undefined) => {
    Object.defineProperty(window, 'navigation', { value: navigation, configurable: true });
};

const createNavigation = (index: number): FakeNavigation =>
    Object.assign(new EventTarget(), { currentEntry: { index } });

const setReferrer = (referrer: string) => {
    Object.defineProperty(document, 'referrer', { value: referrer, configurable: true });
};

describe('useBackNavigation', () => {
    beforeEach(() => {
        push.mockClear();
        back.mockClear();
        setNavigation(undefined);
        setReferrer('');
    });

    it('первая запись сайта в истории — ведёт на главную', () => {
        setNavigation(createNavigation(0));
        const { result } = renderHook(() => useBackNavigation());

        expect(result.current.canGoBack).toBe(false);
        act(() => result.current.goBack());
        expect(push).toHaveBeenCalledWith('/');
        expect(back).not.toHaveBeenCalled();
    });

    it('есть предыдущая запись сайта — возвращает назад', () => {
        setNavigation(createNavigation(2));
        const { result } = renderHook(() => useBackNavigation());

        expect(result.current.canGoBack).toBe(true);
        act(() => result.current.goBack());
        expect(back).toHaveBeenCalled();
        expect(push).not.toHaveBeenCalled();
    });

    it('замечает клиентский переход без перемонтирования', () => {
        const navigation = createNavigation(0);
        setNavigation(navigation);
        const { result } = renderHook(() => useBackNavigation());
        expect(result.current.canGoBack).toBe(false);

        act(() => {
            navigation.currentEntry = { index: 1 };
            navigation.dispatchEvent(new Event('currententrychange'));
        });

        expect(result.current.canGoBack).toBe(true);
    });

    describe('без Navigation API', () => {
        beforeEach(() => {
            window.history.pushState({}, '', '/second');
        });

        it('пришли со своего сайта — назад', () => {
            setReferrer(`${window.location.origin}/tag/les`);
            const { result } = renderHook(() => useBackNavigation());
            expect(result.current.canGoBack).toBe(true);
        });

        it('пришли с чужого сайта — на главную, а не обратно туда', () => {
            setReferrer('https://example.org/search?q=лес');
            const { result } = renderHook(() => useBackNavigation());
            expect(result.current.canGoBack).toBe(false);
        });

        it('открыли по прямой ссылке — на главную', () => {
            const { result } = renderHook(() => useBackNavigation());
            expect(result.current.canGoBack).toBe(false);
        });
    });
});
