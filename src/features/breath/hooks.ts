'use client';

import React from "react";
import {createBeeper, getAudioContextCtor, type Beeper} from "./audio";
import {TICK_MS} from "./const";
import type {BreathRun, BreathStep, BreathTick} from "./types";

/**
 * Дыхательный цикл на счёт: сигнал раз в секунду, каждая фаза плана держится
 * столько счётов, сколько в ней задано, дойдя до конца — план начинается заново.
 *
 * Повторения и подходы считаются здесь же: план проигрывается `repeats` раз, это
 * подход; подходов `sets`, между ними `rest` секунд белого шума. При `repeats === 0`
 * цикл бесконечный, и подходы не считаются — первый подход просто не кончается.
 */
export const useBreathCycle = () => {
    const beeperRef = React.useRef<Beeper | null>(null);
    const timerRef = React.useRef<number | null>(null);
    const [tick, setTick] = React.useState<BreathTick | null>(null);
    // Проверка идёт в эффекте, а не в рендере: на сервере window нет, и разметка
    // «звук не поддерживается» разошлась бы с клиентской при гидрации.
    const [isSupported, setIsSupported] = React.useState(true);

    React.useEffect(() => {
        setIsSupported(getAudioContextCtor() !== undefined);
    }, []);

    const stop = React.useCallback(() => {
        if (timerRef.current !== null) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setTick(null);
    }, []);

    const start = React.useCallback((plan: BreathStep[], run: BreathRun) => {
        if (plan.length === 0) return;

        stop();

        // Биппер создаётся по клику: браузеры не дают запустить звук без жеста
        // пользователя, а созданный заранее контекст остался бы в suspended.
        if (!beeperRef.current) {
            beeperRef.current = createBeeper();
        }

        const beeper = beeperRef.current;
        if (!beeper) return;

        beeper.resume();

        // Шаг всегда секунда, меняется только тон и то, сколько счётов держится фаза,
        // поэтому весь прогон — это один setInterval, а всё положение (фаза, повторение,
        // подход, остаток отдыха) живёт в замыкании.
        let stepIndex = 0;
        let count = 0;
        let repeat = 0;
        let set = 1;
        let restLeft = 0;

        const playTick = () => {
            // Отдых между подходами: шум уже запущен одним куском, тики только считают.
            if (restLeft > 0) {
                setTick({phase: 'rest', count: run.rest - restLeft + 1, total: run.rest, repeat, set});
                restLeft -= 1;
                return;
            }

            // Подход закончился: либо дальше, либо конец прогона.
            if (run.repeats > 0 && repeat >= run.repeats) {
                if (set >= run.sets) {
                    stop();
                    return;
                }

                set += 1;
                repeat = 0;

                if (run.rest > 0) {
                    beeper.noise(run.rest);
                    restLeft = run.rest;
                    playTick();
                    return;
                }
            }

            const step = plan[stepIndex];

            count += 1;
            beeper.beep(step.phase);
            setTick({phase: step.phase, count, total: step.count, repeat: repeat + 1, set});

            if (count >= step.count) {
                stepIndex = (stepIndex + 1) % plan.length;
                count = 0;

                // Вернулись к первой фазе — значит рисунок пройден целиком.
                if (stepIndex === 0) repeat += 1;
            }
        };

        playTick();
        timerRef.current = window.setInterval(playTick, TICK_MS);
    }, [stop]);

    React.useEffect(() => () => {
        if (timerRef.current !== null) {
            window.clearInterval(timerRef.current);
        }
        beeperRef.current?.close();
        beeperRef.current = null;
    }, []);

    return {
        isRunning: tick !== null,
        tick,
        isSupported,
        start,
        stop,
    };
};
