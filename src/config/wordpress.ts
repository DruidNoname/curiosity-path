// frontend/src/config/wordpress.ts
export interface WordPressConfig {
    apiBase: string;
    graphqlEndpoint: string;
    endpoints: {
        posts: string;
        pages: string;
        media: string;
        categories: string;
        tags: string;
        users: string;
        comments: string;
        search: string;
        settings: string;
        // Кастомные endpoints
        custom: (endpoint: string) => string;
    };
    defaultParams: {
        perPage: number;
        embed: boolean;
    };
}

const WORDPRESS_CONFIG: WordPressConfig = {
    apiBase: process.env.NEXT_PUBLIC_WORDPRESS_API_BASE || 'http://localhost:8000/wp-json',
    graphqlEndpoint: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || 'http://localhost:8000/graphql',

    endpoints: {
        posts: '/wp/v2/posts',
        pages: '/wp/v2/pages',
        media: '/wp/v2/media',
        categories: '/wp/v2/categories',
        tags: '/wp/v2/tags',
        users: '/wp/v2/users',
        comments: '/wp/v2/comments',
        search: '/wp/v2/search',
        settings: '/wp/v2/settings',

        // Функция для кастомных endpoints
        custom: (endpoint: string) => `/wp/v2/${endpoint}`,
    },

    defaultParams: {
        perPage: 10,
        embed: true, // Включать связанные ресурсы
    },
};

// Утилиты для построения URL
export const buildApiUrl = (
    endpoint: keyof WordPressConfig['endpoints'] | string,
    params?: Record<string, string | number | boolean>
): string => {
    let url: string;

    if (endpoint in WORDPRESS_CONFIG.endpoints) {
        const key = endpoint as keyof WordPressConfig['endpoints'];
        url = typeof WORDPRESS_CONFIG.endpoints[key] === 'function'
            ? (WORDPRESS_CONFIG.endpoints[key] as Function)(params)
            : WORDPRESS_CONFIG.endpoints[key] as string;
    } else {
        url = WORDPRESS_CONFIG.endpoints.custom(endpoint);
    }

    const fullUrl = `${WORDPRESS_CONFIG.apiBase}${url}`;

    if (params) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            queryParams.append(key, String(value));
        });

        // Добавляем дефолтные параметры
        if (!params.hasOwnProperty('per_page')) {
            queryParams.append('per_page', String(WORDPRESS_CONFIG.defaultParams.perPage));
        }
        if (!params.hasOwnProperty('_embed') && WORDPRESS_CONFIG.defaultParams.embed) {
            queryParams.append('_embed', 'true');
        }

        return `${fullUrl}?${queryParams.toString()}`;
    }

    return fullUrl;
};

export default WORDPRESS_CONFIG;