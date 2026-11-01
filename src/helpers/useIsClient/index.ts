'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * `false` на сервере и при гидрации, `true` сразу после неё.
 *
 * Нужен там, где разметка зависит от того, что есть только в браузере: `window`,
 * сегодняшняя дата, выбранная тема. Прочитай такое прямо в рендере — и серверный
 * HTML разойдётся с клиентским при гидрации.
 *
 * Раньше это делали через `useState(false)` + `useEffect(() => set(true))`; линтер
 * (`react-hooks/set-state-in-effect`) такой `setState` в эффекте запрещает.
 * `useSyncExternalStore` с серверным снимком даёт тот же второй проход рендера
 * штатным для React способом.
 */
export const useIsClient = (): boolean =>
    useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
