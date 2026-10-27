import { LOADER_VARIANTS, pickLoaderVariant } from './variants';

describe('pickLoaderVariant', () => {
  it('делит диапазон random() поровну между вариантами', () => {
    expect(pickLoaderVariant(() => 0)).toBe('atom');
    expect(pickLoaderVariant(() => 0.34)).toBe('bicycle');
    expect(pickLoaderVariant(() => 0.67)).toBe('crutch');
  });

  it('не выходит за границы массива на краю диапазона', () => {
    expect(pickLoaderVariant(() => 0.9999999)).toBe('crutch');
    expect(pickLoaderVariant(() => 1)).toBe('crutch');
  });

  it('по умолчанию берёт Math.random', () => {
    expect(LOADER_VARIANTS).toContain(pickLoaderVariant());
  });
});
