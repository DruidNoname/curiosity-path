export const urls = {
    get base() {
        return process.env.NEXT_PUBLIC_BASE_URL || '';
    },

    get graphql() {
        return process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || '';
    },

    get api() {
        return process.env.NEXT_PUBLIC_WORDPRESS_API_BASE || '';
    },
};
