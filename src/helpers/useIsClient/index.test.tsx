import { renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import React from 'react';

import { useIsClient } from './index';

describe('useIsClient', () => {
    it('на клиенте после монтирования возвращает true', () => {
        const { result } = renderHook(() => useIsClient());
        expect(result.current).toBe(true);
    });

    it('при серверном рендере возвращает false', () => {
        const Probe = () => <>{String(useIsClient())}</>;
        expect(renderToString(<Probe />)).toBe('false');
    });
});
