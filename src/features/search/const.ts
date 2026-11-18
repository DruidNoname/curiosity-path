import {urls} from '@/config/urls';

/** Поиск по словоформам — плагин Curiosity Search в WP (`wordpress/plugins/curiosity-search`). */
export const SEARCH_URL = `${urls.addonApi}/search`;

export const SEARCH_STALE_TIME = 1000 * 60 * 5;
