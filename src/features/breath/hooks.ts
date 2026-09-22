'use client';

import React from "react";
import {createBeeper, getAudioContextCtor, type Beeper} from "./audio";
import {COUNTDOWN_SECONDS, TICK_MS} from "./const";
import type {BreathRun, BreathStep, BreathTick} from "./types";

/** Где именно стоит прогон. Живёт в рефе, чтобы паузу можно было снять с того же места. */
type CyclePosition = {
    stepIndex: number;
    count: number;
    repeat: number;
    set: number;
    restLeft: number;
    countdownLeft: number;
};

type CycleStatus = 'idle' | 'running' | 'paused';

const initialPosition = (): CyclePosition => ({
    stepIndex: 0,
    count: 0,
    repeat: 0,
    set: 1,
    restLeft: 0,
    countdownLeft: COUNTDOWN_SECONDS,
});

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
    const planRef = React.useRef<BreathStep[]>([]);
    const runRef = React.useRef<BreathRun>({repeats: 0, sets: 1, rest: 0});
    const positionRef = React.useRef<CyclePosition>(initialPosition());
    const [tick, setTick] = React.useState<BreathTick | null>(null);
    const [status, setStatus] = React.useState<CycleStatus>('idle');
    // Проверка идёт в эффекте, а не в рендере: на сервере window нет, и разметка
    // «звук не поддерживается» разошлась бы с клиентской при гидрации.
    const [isSupported, setIsSupported] = React.useState(true);

    React.useEffect(() => {
        setIsSupported(getAudioContextCtor() !== undefined);
    }, []);

    const clearTimer = React.useCallback(() => {
        if (timerRef.current !== null) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const stop = React.useCallback(() => {
        clearTimer();
        beeperRef.current?.stopNoise();
        positionRef.current = initialPosition();
        setTick(null);
        setStatus('idle');
    }, [clearTimer]);

    const playTick = React.useCallback(() => {
        const beeper = beeperRef.current;
        if (!beeper) return;

        const plan = planRef.current;
        const run = runRef.current;
        const position = positionRef.current;

        const countRest = () => {
            setTick({
                phase: 'rest',
                count: run.rest - position.restLeft + 1,
                total: run.rest,
                repeat: position.repeat,
                set: position.set,
            });
            position.restLeft -= 1;
        };

        // Обратный отсчёт перед стартом: пять щелчков, чтобы успеть сесть и выдохнуть.
        if (position.countdownLeft > 0) {
            beeper.beep('countdown');
            setTick({
                phase: 'countdown',
                count: position.countdownLeft,
                total: COUNTDOWN_SECONDS,
                repeat: position.repeat,
                set: position.set,
            });
            position.countdownLeft -= 1;
            return;
        }

        // Отдых между подходами: шум уже запущен одним куском, тики только считают.
        if (position.restLeft > 0) {
            countRest();
            return;
        }

        // Подход закончился: либо дальше, либо конец прогона.
        if (run.repeats > 0 && position.repeat >= run.repeats) {
            if (position.set >= run.sets) {
                stop();
                return;
            }

            position.set += 1;
            position.repeat = 0;

            if (run.rest > 0) {
                beeper.noise(run.rest);
                position.restLeft = run.rest;
                countRest();
                return;
            }
        }

        const step = plan[position.stepIndex];

        position.count += 1;
        beeper.beep(step.phase);
        setTick({
            phase: step.phase,
            count: position.count,
            total: step.count,
            repeat: position.repeat + 1,
            set: position.set,
        });

        if (position.count >= step.count) {
            position.stepIndex = (position.stepIndex + 1) % plan.length;
            position.count = 0;

            // Вернулись к первой фазе — значит рисунок пройден целиком.
            if (position.stepIndex === 0) position.repeat += 1;
        }
    }, [stop]);

    /** Первый счёт звучит сразу, дальше — раз в секунду. */
    const runTimer = React.useCallback(() => {
        clearTimer();
        playTick();
        timerRef.current = window.setInterval(playTick, TICK_MS);
    }, [clearTimer, playTick]);

    const start = React.useCallback((plan: BreathStep[], run: BreathRun) => {
        if (plan.length === 0) return;

        clearTimer();
        beeperRef.current?.stopNoise();

        // Биппер создаётся по клику: браузеры не дают запустить звук без жеста
        // пользователя, а созданный заранее контекст остался бы в suspended.
        if (!beeperRef.current) {
            beeperRef.current = createBeeper();
        }

        const beeper = beeperRef.current;
        if (!beeper) return;

        beeper.resume();

        planRef.current = plan;
        runRef.current = run;
        positionRef.current = initialPosition();

        setStatus('running');
        runTimer();
    }, [clearTimer, runTimer]);

    /** Пауза не трогает положение — в отличие от `stop`, продолжить можно с того же места. */
    const pause = React.useCallback(() => {
        clearTimer();
        beeperRef.current?.stopNoise();
        setStatus('paused');
    }, [clearTimer]);

    const resume = React.useCallback(() => {
        const beeper = beeperRef.current;
        if (!beeper) return;

        beeper.resume();

        // Стояли посреди отдыха — доигрываем шум на оставшиеся секунды.
        if (positionRef.current.restLeft > 0) {
            beeper.noise(positionRef.current.restLeft);
        }

        setStatus('running');
        runTimer();
    }, [runTimer]);

    React.useEffect(() => () => {
        if (timerRef.current !== null) {
            window.clearInterval(timerRef.current);
        }
        beeperRef.current?.close();
        beeperRef.current = null;
    }, []);

    return {
        isRunning: status === 'running',
        isPaused: status === 'paused',
        tick,
        isSupported,
        start,
        pause,
        resume,
        stop,
    };
};
