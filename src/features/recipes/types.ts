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
    recipe: {
        id: number;
        name: string; // Название рецепта (дублирует title.rendered)
        summary: string; // Краткое описание в HTML
        servings: string; // Количество порций
        prep_time: string; // Время подготовки (в минутах)
        cook_time: string; // Время приготовления (в минутах)
        total_time: string; // Общее время (в минутах)
        image_url?: string;
        // ИНГРЕДИЕНТЫ - структурированные данные
        ingredients: Array<{
            ingredients: Array<{
                amount: string; // Количество (например, "2")
                unit: string;  // Единица измерения (например, "ст.л.")
                name: string;  // Название ингредиента
                notes: string; // Примечание (например, "мелко нарезанный")
            }>;
            name: string; // Название группы ингредиентов (может быть пустым)
        }>;

        // ИНСТРУКЦИИ - пошаговое приготовление
        instructions: Array<{
            instructions: Array<{
                text: string; // Текст шага в HTML
                image: number; // ID изображения для шага (0 если нет)
            }>;
            name: string; // Название группы инструкций (может быть пустым)
        }>;

        // Плоские версии (удобны для отображения)
        ingredients_flat: Array<{
            amount: string;
            unit: string;
            name: string;
            notes: string;
        }>;

        instructions_flat: Array<{
            text: string;
            image: number;
        }>;
    };
}

// Интерфейс для полного ответа хука useRecipes
export interface RecipesResponse {
    recipes: RecipeListItem[];
    total: number;      // Общее количество рецептов
    totalPages: number; // Всего страниц
    currentPage: number;
    perPage: number;
}