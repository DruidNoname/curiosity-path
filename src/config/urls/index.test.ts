describe('config/urls', () => {
    const saved = { ...process.env };

    const clearUrlEnv = () => {
        delete process.env.NEXT_PUBLIC_WORDPRESS_URL;
        delete process.env.NEXT_PUBLIC_BASE_URL;
        delete process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
        delete process.env.NEXT_PUBLIC_WORDPRESS_API_BASE;
        delete process.env.NEXT_PUBLIC_WORDPRESS_ADDON_API_URL;
        delete process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL;
    };

    afterEach(() => { process.env = { ...saved }; jest.resetModules(); });

    it('без переменных окружения падает на дефолты, а не бросает ошибку', () => {
        jest.resetModules();
        clearUrlEnv();
        const { urls } = require('./index');
        expect(urls.wp).toBe('https://suffer.curiosity-path.ru');
        expect(urls.base).toBe('https://curiosity-path.ru');
        expect(urls.api).toBe('https://suffer.curiosity-path.ru/wp-json/wp/v2');
    });

    it('переменные окружения перекрывают дефолты', () => {
        jest.resetModules();
        clearUrlEnv();
        process.env.NEXT_PUBLIC_WORDPRESS_URL = 'https://wp.test';
        process.env.NEXT_PUBLIC_BASE_URL = 'https://site.test';
        const { urls } = require('./index');
        expect(urls.wp).toBe('https://wp.test');
        expect(urls.base).toBe('https://site.test');
    });

    it('выводит производные адреса и срезает хвостовой слэш', () => {
        jest.resetModules();
        clearUrlEnv();
        process.env.NEXT_PUBLIC_WORDPRESS_URL = 'https://wp.test/';
        const { urls } = require('./index');
        expect(urls.api).toBe('https://wp.test/wp-json/wp/v2');
        expect(urls.addonApi).toBe('https://wp.test/wp-json/custom/v1');
        expect(urls.graphql).toBe('https://wp.test/graphql');
    });

    it('явно заданный нестандартный путь перекрывает вывод из корня', () => {
        jest.resetModules();
        clearUrlEnv();
        process.env.NEXT_PUBLIC_WORDPRESS_URL = 'https://wp.test';
        process.env.NEXT_PUBLIC_WORDPRESS_API_BASE = 'https://wp.test/custom-rest/v2/';
        const { urls } = require('./index');
        expect(urls.api).toBe('https://wp.test/custom-rest/v2');
    });
});
