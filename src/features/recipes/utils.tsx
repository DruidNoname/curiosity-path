import {RoundingIngredientsConfig} from "@/features/recipes/types";
import {ROUNDING_INGREDIENTS_CONFIG} from "@/features/recipes/const";

export const convertFractions = (value: number | string): number => {
    if (typeof value !== 'string') {
        return Number(value);
    }

    const normalized = value.replace('\\', '/').replace(/\s/g, '');
    const parts = normalized.split('/');

    if (parts.length !== 2) {
        return Number(value); // Неправильный формат
    }

    const numerator = parseFloat(parts[0]);
    const denominator = parseFloat(parts[1]);

    // Проверяем, что числа корректны и знаменатель не равен нулю
    if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
        return Number(value);
    }

    // Вычисляем десятичную дробь
    return numerator / denominator;
};

const roundByConfig = (value: number, config: RoundingIngredientsConfig): number => {
    if (config.toNearest) {
        // Округление до ближайшего значения (например, до 5)
        return Math.round(value / config.toNearest) * config.toNearest;
    }

    // Обычное округление с заданной точностью
    const multiplier = Math.pow(10, config.decimals || 0);
    return Math.round(value * multiplier) / multiplier;
};

const formatRoundedValue = (value: number, config: RoundingIngredientsConfig): string => {
    const rounded = roundByConfig(value, config);

    // Проверяем, целое ли число (с учетом погрешности вычислений)
    if (Math.abs(rounded - Math.round(rounded)) < 1e-10) {
        return Math.round(rounded).toString();
    }

    return rounded.toFixed(config.decimals || 0);
};

export const processNumber = (value: number): string => {
    const config = ROUNDING_INGREDIENTS_CONFIG.find(c =>
        value >= c.min && (c.max === undefined || value <= c.max)
    ) || ROUNDING_INGREDIENTS_CONFIG[ROUNDING_INGREDIENTS_CONFIG.length - 1];

    return formatRoundedValue(value, config);
};
