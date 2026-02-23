import {urls} from "@/config/urls";
import {RoundingIngredientsConfig} from "@/features/recipes/types";

export const RECIPES_URL = `${urls.api}/wprm_recipe`;
export const COURSES_URL = `${urls.api}/wprm_course`;

export const UNIT_MAP: Record<string, string> = {
    g: 'гр.',
    ml: 'мл.',
    tsp: 'ч.л.',
    cup: 'стак.',
    cups: 'стак.',
};

export const ROUNDING_INGREDIENTS_CONFIG: RoundingIngredientsConfig[] = [
    { min: 100, toNearest: 5, precision: 0 },      // сотни: до 5
    { min: 10, max: 99, precision: 0 },             // десятки: до целых
    { min: 1, max: 9.99, decimals: 1, precision: 1 } // единицы: до десятых
];
