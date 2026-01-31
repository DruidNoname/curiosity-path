const IS_DEV = process.env.NODE_ENV === 'development';

export const urls = {
    // В разработке
    dev: {
        site: 'http://localhost:3000',
        wp: 'https://suffer.curiosity-path.ru',
        wpApi: 'https://suffer.curiosity-path.ru/wp-json/wp/v2',
        wpGraphql: 'https://suffer.curiosity-path.ru/graphql',
    },

    // В продакшене
    prod: {
        site: 'https://curiosity-path.ru',
        wp: 'https://suffer.curiosity-path.ru',
        wpApi: 'https://suffer.curiosity-path.ru/wp-json/wp/v2',
        wpGraphql: 'https://suffer.curiosity-path.ru/graphql',
    },

    // Автоматически выбираем правильные URL
    get current() {
        return IS_DEV ? this.dev : this.prod;
    },

    // Короткие геттеры
    get base() { return this.current.site; },
    get wp() { return this.current.wp; },
    get api() { return this.current.wpApi; },
    get graphql() { return this.current.wpGraphql; },

    // // Готовые API endpoints
    // get posts() { return `${this.api}/posts`; },
    // get pages() { return `${this.api}/pages`; },
    // get media() { return `${this.api}/media`; },
    // get categories() { return `${this.api}/categories`; },
    //
    // // С параметрами
    // postsPaginated: (page = 1, perPage = 10) =>
    //     `${this.api}/posts?page=${page}&per_page=${perPage}`,
};
