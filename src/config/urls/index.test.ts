describe('config/urls', () => {
    const saved = { ...process.env };
    afterEach(() => { process.env = { ...saved }; jest.resetModules(); });

    it('бросает понятную ошибку, если не задан NEXT_PUBLIC_WORDPRESS_URL', () => {
        jest.resetModules();
        delete process.env.NEXT_PUBLIC_WORDPRESS_URL;
        expect(() => require('./index')).toThrow(/NEXT_PUBLIC_WORDPRESS_URL/);
    });

    it('выводит производные адреса и срезает хвостовой слэш', () => {
        jest.resetModules();
        process.env.NEXT_PUBLIC_WORDPRESS_URL = 'https://wp.test/';
        process.env.NEXT_PUBLIC_BASE_URL = 'https://site.test';
        delete process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
        delete process.env.NEXT_PUBLIC_WORDPRESS_API_BASE;
        delete process.env.NEXT_PUBLIC_WORDPRESS_ADDON_API_URL;
        delete process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL;
        const { urls } = require('./index');
        expect(urls.api).toBe('https://wp.test/wp-json/wp/v2');
        expect(urls.addonApi).toBe('https://wp.test/wp-json/custom/v1');
        expect(urls.graphql).toBe('https://wp.test/graphql');
    });
});
