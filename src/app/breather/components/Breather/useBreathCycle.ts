'use client';

import React from "react";
import type {BreathPhase, BreathStep} from "./plan";

/**
 * Дыхательный цикл на счёт: сигнал раз в секунду, каждая фаза плана держится
 * столько счётов, сколько в ней задано, дойдя до конца — план начинается заново.
 *
 * Звук синтезируется через Web Audio API, а не берётся из файла: не нужен ассет
 * в бандле, нет сетевого запроса и задержки перед первым сигналом.
 *
 * Фазы разведены по высоте тона, чтобы не приходилось смотреть на экран:
 * вдох выше, выдох ниже, пауза — между ними и вполовину тише, чтобы её
 * не путать ни с тем, ни с другим.
 */
const PHASE_TONES: Record<BreathPhase, { hz: number; volume: number }> = {
    inhale: {hz: 660, volume: 0.25},
    hold: {hz: 520, volume: 0.12},
    exhale: {hz: 440, volume: 0.25},
};

const TICK_MS = 1000;
const BEEP_SECONDS = 0.18;
const ATTACK_SECONDS = 0.02;

/** Что сейчас происходит: фаза, номер счёта в ней (1-based) и её длина. */
export type BreathTick = {
    phase: BreathPhase;
    count: number;
    total: number;
};

type AudioContextCtor = typeof AudioContext;

const getAudioContextCtor = (): AudioContextCtor | undefined => {
    if (typeof window === 'undefined') return undefined;

    return window.AudioContext
        ?? (window as Window & { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;
};

export const useBreathCycle = () => {
    const contextRef = React.useRef<AudioContext | null>(null);
    const timerRef = React.useRef<number | null>(null);
    const [tick, setTick] = React.useState<BreathTick | null>(null);
    // Проверка идёт в эффекте, а не в рендере: на сервере window нет, и разметка
    // «звук не поддерживается» разошлась бы с клиентской при гидрации.
    const [isSupported, setIsSupported] = React.useState(true);

    React.useEffect(() => {
        setIsSupported(getAudioContextCtor() !== undefined);
    }, []);

    const beep = React.useCallback((phase: BreathPhase) => {
        const context = contextRef.current;
        if (!context) return;

        const {hz, volume} = PHASE_TONES[phase];
        const now = context.currentTime;
        const oscillator = context.createOscillator();
        const gain = context.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(hz, now);

        // Плавные нарастание и затухание громкости: включённый «в лоб» осциллятор щёлкает.
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume, now + ATTACK_SECONDS);
        gain.gain.linearRampToValueAtTime(0, now + BEEP_SECONDS);

        oscillator.connect(gain);
        gain.connect(context.destination);

        oscillator.start(now);
        oscillator.stop(now + BEEP_SECONDS);
    }, []);

    const stop = React.useCallback(() => {
        if (timerRef.current !== null) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setTick(null);
    }, []);

    const start = React.useCallback((plan: BreathStep[]) => {
        const AudioContextCtor = getAudioContextCtor();
        if (!AudioContextCtor || plan.length === 0) return;

        stop();

        // Контекст создаётся по клику: браузеры не дают запустить звук без жеста
        // пользователя, а созданный заранее контекст остался бы в suspended.
        if (!contextRef.current) {
            contextRef.current = new AudioContextCtor();
        }
        void contextRef.current.resume();

        // Шаг всегда секунда, меняется только тон и то, сколько счётов держится фаза,
        // поэтому весь цикл — это один setInterval с позицией в плане внутри замыкания.
        let stepIndex = 0;
        let count = 0;

        const playTick = () => {
            const step = plan[stepIndex];

            count += 1;
            beep(step.phase);
            setTick({phase: step.phase, count, total: step.count});

            if (count >= step.count) {
                stepIndex = (stepIndex + 1) % plan.length;
                count = 0;
            }
        };

        playTick();
        timerRef.current = window.setInterval(playTick, TICK_MS);
    }, [beep, stop]);

    React.useEffect(() => () => {
        if (timerRef.current !== null) {
            window.clearInterval(timerRef.current);
        }
        void contextRef.current?.close();
        contextRef.current = null;
    }, []);

    return {
        isRunning: tick !== null,
        tick,
        isSupported,
        start,
        stop,
    };
};
