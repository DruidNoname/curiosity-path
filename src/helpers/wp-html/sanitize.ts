import sanitizeHtml from 'sanitize-html';

/**
 * Белый список разметки, которую мы принимаем от WordPress.
 * Единственное место, где решается, что вообще имеет право дойти до страницы.
 */
const OPTIONS: sanitizeHtml.IOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', //headers
        'img', 'figure', 'figcaption', 'pre', 'code', 'div', //images
        'p', 'del', 'em', 'strong', 'b', //typography
        'summary', 'details' //spoiler
    ]),
    allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        'a': ['href', 'target', 'rel', 'title'],
        'img': ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding', 'srcset', 'sizes'],
        '*': ['class', 'id', 'style', 'data-*']
    },
    allowedIframeHostnames: [],
    allowedSchemes: ['http', 'https'],
    allowProtocolRelative: false,
};

export const sanitize = (html: string): string => sanitizeHtml(html, OPTIONS);
