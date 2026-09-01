/**
 * Единая точка правды по внешним адресам.
 *
 * Значения берутся из переменных окружения (`.env.local` в разработке,
 * `.env.production` в сборке; шаблон — `.env.example`). Если переменная не задана,
 * используется дефолт из `DEFAULTS` — чтобы сборка не ломалась там, где окружение
 * ещё не настроено: preview-деплой, свежий клон, CI. Env всегда перекрывает дефолт.
 *
 * Важно: `NEXT_PUBLIC_*` подставляются Next.js статически на этапе сборки, поэтому
 * обращаться к ним можно только полным литералом `process.env.NEXT_PUBLIC_FOO`.
 * Динамический доступ (`process.env[name]`) молча вернёт undefined.
 */

/**
 * Дефолтные адреса продакшена. Единственное место, где домены записаны в коде;
 * при переезде бэкенда правится либо окружение, либо эти две строки.
 */
const DEFAULTS = {
    wordpress: 'https://suffer.curiosity-path.ru',
    site: 'https://curiosity-path.ru',
} as const;

/** Убирает хвостовые слэши, чтобы конкатенация не давала `//wp-json`. */
const trimSlashes = (value: string): string => value.replace(/\/+$/, '');

const withFallback = (value: string | undefined, fallback: string): string =>
    value ? trimSlashes(value) : fallback;

// Корень WordPress и корень самого сайта.
const WP = withFallback(process.env.NEXT_PUBLIC_WORDPRESS_URL, DEFAULTS.wordpress);
const SITE = withFallback(process.env.NEXT_PUBLIC_BASE_URL, DEFAULTS.site);

// Остальные адреса выводятся из корня WP; переменные нужны только тем инсталляциям,
// у которых нестандартные пути.
const WP_JSON = withFallback(process.env.NEXT_PUBLIC_WORDPRESS_API_URL, `${WP}/wp-json`);
const WP_API = withFallback(process.env.NEXT_PUBLIC_WORDPRESS_API_BASE, `${WP_JSON}/wp/v2`);
const WP_ADDON_API = withFallback(process.env.NEXT_PUBLIC_WORDPRESS_ADDON_API_URL, `${WP_JSON}/custom/v1`);
const WP_GRAPHQL = withFallback(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL, `${WP}/graphql`);

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
