import {format, parseISO} from "date-fns";
import {WP_REST_API_Post} from "wp-types";

export const getPostsByDate= (data: WP_REST_API_Post[]) => {
    const map = new Map();
    data.forEach((post: any) => {
        try {
            const date = parseISO(post.date);
            const dateKey = format(date, 'yyyy-MM-dd');

            if (!map.has(dateKey)) {
                map.set(dateKey, []);
            }

            map.get(dateKey).push({
                id: post.id,
                slug: post.slug,
                title: post.title.rendered,
                link: post.link,
                date: post.date
            });
        } catch (e) {
            console.error('Error parsing post date:', e);
        }
    });

    return map;
};