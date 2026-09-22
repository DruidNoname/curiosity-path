import {
    ATTACK_SECONDS,
    BEEP_SECONDS,
    CLICK_SECONDS,
    NOISE_BUFFER_SECONDS,
    NOISE_FADE_SECONDS,
    NOISE_VOLUME,
    SOUNDS,
    SCHEDULE_AHEAD_SECONDS,
} from "./const";
import type {BreathSoundName} from "./types";

/**
 * Синтез сигнала через Web Audio — без React, как `api.ts` в остальных срезах.
 *
 * Звук считается на месте, а не берётся из файла: не нужен ассет в бандле, нет
 * сетевого запроса и задержки перед первым сигналом.
 */
type AudioContextCtor = typeof AudioContext;

export const getAudioContextCtor = (): AudioContextCtor | undefined => {
    if (typeof window === 'undefined') return undefined;

    return window.AudioContext
        ?? (window as Window & { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;
};

export type Beeper = {
    beep: (sound: BreathSoundName) => void;
    /** Ровный белый шум на заданное число секунд — отдых между подходами. */
    noise: (seconds: number) => void;
    /** Оборвать шум раньше времени: пауза и остановка посреди отдыха. */
    stopNoise: () => void;
    /** Браузер держит контекст в suspended, пока не было жеста пользователя. */
    resume: () => void;
    close: () => void;
};

/** Белый шум: заготовка и для щелчка, и для отдыха; считается один раз на биппер. */
const createNoiseBuffer = (context: AudioContext, seconds: number): AudioBuffer => {
    const frameCount = Math.ceil(context.sampleRate * seconds);
    const buffer = context.createBuffer(1, frameCount, context.sampleRate);
    const channel = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i += 1) {
        channel[i] = Math.random() * 2 - 1;
    }

    return buffer;
};

export const createBeeper = (): Beeper | null => {
    const AudioContextCtor = getAudioContextCtor();
    if (!AudioContextCtor) return null;

    const context = new AudioContextCtor();
    const noiseBuffer = createNoiseBuffer(context, NOISE_BUFFER_SECONDS);

    /** Чистый тон: осциллятор + огибающая громкости. */
    const playTone = (hz: number, volume: number) => {
        const now = context.currentTime + SCHEDULE_AHEAD_SECONDS;
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
    };

    /**
     * Щелчок: короткий кусок шума через полосовой фильтр и резкое затухание.
     * Шум против тона — именно то, что делает паузу неспутываемой с вдохом и выдохом:
     * у неё нет высоты, только «тк».
     */
    const playClick = (hz: number, volume: number) => {
        const now = context.currentTime + SCHEDULE_AHEAD_SECONDS;
        const source = context.createBufferSource();
        const filter = context.createBiquadFilter();
        const gain = context.createGain();

        source.buffer = noiseBuffer;

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(hz, now);
        filter.Q.setValueAtTime(1.2, now);

        // Экспоненциальное затухание к нулю невозможно, поэтому уходим в почти-ноль
        // и обрубаем: на слух это и есть щелчок.
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + CLICK_SECONDS);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(context.destination);

        source.start(now);
        source.stop(now + CLICK_SECONDS);
    };

    /**
     * Отдых между подходами: та же секунда шума, пущенная по кругу, с плавными
     * краями — резко включённый шум бьёт по ушам сильнее тона.
     */
    // Шум живёт дольше одного тика, поэтому его узлы приходится помнить: иначе
    // паузу посреди отдыха нечем оборвать.
    let activeNoise: { source: AudioBufferSourceNode; gain: GainNode } | null = null;

    const stopNoise = () => {
        if (!activeNoise) return;

        const {source, gain} = activeNoise;
        const now = context.currentTime;
        const fade = NOISE_FADE_SECONDS / 2;

        activeNoise = null;

        // Обрывать шум «в лоб» нельзя — получится щелчок, поэтому короткое затухание.
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0, now + fade);
        source.stop(now + fade);
    };

    const playNoise = (seconds: number) => {
        if (seconds <= 0) return;

        stopNoise();

        const now = context.currentTime + SCHEDULE_AHEAD_SECONDS;
        const source = context.createBufferSource();
        const gain = context.createGain();
        const fade = Math.min(NOISE_FADE_SECONDS, seconds / 2);

        source.buffer = noiseBuffer;
        source.loop = true;

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(NOISE_VOLUME, now + fade);
        gain.gain.setValueAtTime(NOISE_VOLUME, now + seconds - fade);
        gain.gain.linearRampToValueAtTime(0, now + seconds);

        source.connect(gain);
        gain.connect(context.destination);

        source.start(now);
        source.stop(now + seconds);

        activeNoise = {source, gain};
        source.onended = () => {
            if (activeNoise?.source === source) activeNoise = null;
        };
    };

    return {
        beep: (name) => {
            const sound = SOUNDS[name];

            if (sound.kind === 'click') {
                playClick(sound.hz, sound.volume);
                return;
            }

            playTone(sound.hz, sound.volume);
        },
        noise: playNoise,
        stopNoise,
        resume: () => void context.resume(),
        close: () => void context.close(),
    };
};
