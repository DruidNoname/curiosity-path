import { renderHook, act } from '@testing-library/react';
import { usePageParam } from './index';

const push = jest.fn();
let currentSearch = '';
let currentPathname = '/';

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push }),
    usePathname: () => currentPathname,
    useSearchParams: () => new URLSearchParams(currentSearch),
}));

describe('usePageParam', () => {
    beforeEach(() => {
        push.mockClear();
        currentSearch = '';
        currentPathname = '/';
        window.scrollTo = jest.fn();
    });

    it('без параметра отдаёт первую страницу', () => {
        const { result } = renderHook(() => usePageParam());
        expect(result.current.page).toBe(1);
    });

    it('читает страницу из адреса', () => {
        currentSearch = 'page=4';
        const { result } = renderHook(() => usePageParam());
        expect(result.current.page).toBe(4);
    });

    it('мусор в параметре не ломает чтение', () => {
        currentSearch = 'page=пять';
        const { result } = renderHook(() => usePageParam());
        expect(result.current.page).toBe(1);
    });

    it('переход на страницу меняет адрес без прыжка прокрутки', () => {
        const { result } = renderHook(() => usePageParam());

        act(() => result.current.setPage(3));

        expect(push).toHaveBeenCalledWith('/?page=3', { scroll: false });
        expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    it('возврат на первую страницу убирает параметр', () => {
        currentSearch = 'page=3';
        const { result } = renderHook(() => usePageParam());

        act(() => result.current.setPage(1));

        expect(push).toHaveBeenCalledWith('/', { scroll: false });
    });

    it('на странице поиска сохраняет запрос', () => {
        currentPathname = '/search';
        currentSearch = 'q=%D0%BB%D0%B5%D1%81';
        const { result } = renderHook(() => usePageParam());

        act(() => result.current.setPage(2));

        expect(push).toHaveBeenCalledWith('/search?q=%D0%BB%D0%B5%D1%81&page=2', { scroll: false });
    });
});
