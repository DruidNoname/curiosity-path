export interface Ingredient {
    uid: number;
    amount: number;
    unit: string;
    name: string;
    notes: string;
    unit_id: number;
    id: number;
    type: string;
}

export interface IngredientsFull {
    ingredients: Ingredient[];
    name: string; // Название группы ингредиентов (может быть пустым)
}

export interface Instruction {
    uid: number;
    name: string;
    text: string;
    image: number;
    ingredients: number[];
    type: 'instruction';
    image_url: string;
}

export interface InstructionsFull {
    instructions: Instruction[];
    name: string;
}

export interface Recipe {
    id: number;
    name: string; // Название рецепта (дублирует title.rendered)
    summary: string; // Краткое описание в HTML
    servings: string; // Количество порций
    prep_time: string; // Время подготовки (в минутах)
    cook_time: string; // Время приготовления (в минутах)
    total_time: string; // Общее время (в минутах)
    image_url?: string;
    ingredients: IngredientsFull;
    instructions: InstructionsFull[];
    ingredients_flat: Ingredient[];
    instructions_flat: Instruction[];
}


export interface RecipeListItem {
    id: number;
    date: string;
    slug: string;
    status: 'publish' | 'draft' | 'private' | 'pending';
    type: 'wprm_recipe';
    link: string;
    title: {
        rendered: string; // Заголовок рецепта в HTML (может содержать теги)
    };
    content: {
        rendered: string; // Полное описание/контент в HTML
        protected: boolean;
    };
    author: number; // ID автора
    featured_media: number; // ID главного изображения (0 если нет)
    // Таксономии рецепта (категории, кухни и т.д.)
    wprm_course: number[];
    wprm_cuisine: number[];
    wprm_keyword: number[];
    // Основные данные рецепта - САМАЯ ВАЖНАЯ ЧАСТЬ
    recipe: Recipe;
}

// Интерфейс для полного ответа хука useRecipes
export interface RecipesResponse {
    recipes: RecipeListItem[];
    total: number;      // Общее количество рецептов
    totalPages: number; // Всего страниц
    currentPage: number;
    perPage: number;
}

export type RoundingIngredientsConfig = {
    min: number;           // минимальное значение для правила
    max?: number;          // максимальное значение (опционально)
    precision: number;     // точность округления
    toNearest?: number;    // округление до ближайшего (например, 5 для сотен)
    decimals?: number;     // количество знаков после запятой
};