/**
 * Единая точка правды по внешним адресам.
 *
 * Все значения приходят из переменных окружения (`.env.local` в разработке,
 * `.env.production` в сборке; шаблон — `.env.example`). Хардкода доменов здесь нет:
 * чтобы переключить бэкенд, правится env, а не код.
 *
 * Важно: `NEXT_PUBLIC_*` подставляются Next.js статически на этапе сборки, поэтому
 * обращаться к ним можно только полным литералом `process.env.NEXT_PUBLIC_FOO`.
 * Динамический доступ (`process.env[name]`) молча вернёт undefined.
 */

/** Убирает хвостовые слэши, чтобы конкатенация не давала `//wp-json`. */
const trimSlashes = (value: string): string => value.replace(/\/+$/, '');

const required = (name: string, value: string | undefined): string => {
    if (!value) {
        throw new Error(
            `Не задана переменная окружения ${name}. ` +
            `Скопируйте .env.example в .env.local и заполните значения.`
        );
    }
    return trimSlashes(value);
};

const optional = (value: string | undefined, fallback: string): string =>
    value ? trimSlashes(value) : fallback;

// Обязательные: корень WordPress и корень самого сайта.
const WP = required('NEXT_PUBLIC_WORDPRESS_URL', process.env.NEXT_PUBLIC_WORDPRESS_URL);
const SITE = required('NEXT_PUBLIC_BASE_URL', process.env.NEXT_PUBLIC_BASE_URL);

// Необязательные: по умолчанию выводятся из корня WP, задаются явно только если
// у инсталляции нестандартные пути.
const WP_JSON = optional(process.env.NEXT_PUBLIC_WORDPRESS_API_URL, `${WP}/wp-json`);
const WP_API = optional(process.env.NEXT_PUBLIC_WORDPRESS_API_BASE, `${WP_JSON}/wp/v2`);
const WP_ADDON_API = optional(process.env.NEXT_PUBLIC_WORDPRESS_ADDON_API_URL, `${WP_JSON}/custom/v1`);
const WP_GRAPHQL = optional(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL, `${WP}/graphql`);

export const urls = {
    /** Корень самого сайта. */
    base: SITE,
    /** Корень WordPress. */
    wp: WP,
    /** Корень REST API WordPress без пространства имён: `.../wp-json`. */
    wpJson: WP_JSON,
    /** Стандартное пространство имён REST: `.../wp-json/wp/v2`. */
    api: WP_API,
    /** Кастомное пространство имён REST: `.../wp-json/custom/v1`. */
    addonApi: WP_ADDON_API,
    /** Эндпоинт WPGraphQL. */
    graphql: WP_GRAPHQL,
} as const;

export default urls;
