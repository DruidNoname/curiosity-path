import sanitizeHtml from 'sanitize-html';

export const getCleanEntry = (html: string): string => {
    if (!html || typeof html !== 'string') return '';

    return sanitizeHtml(html, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'img', 'figure', 'figcaption', 'pre', 'code'
        ]),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            'a': ['href', 'target', 'rel', 'title'],
            'img': ['src', 'alt', 'title', 'width', 'height'],
            '*': ['class', 'id']
        },
        allowedIframeHostnames: [],
        allowedSchemes: ['http', 'https'],
        allowProtocolRelative: false,
    });
};

export const createExcerpt = (html: string, maxLength: number = 1200): string => {
    const clean = getCleanEntry(html);

    if (clean.length <= maxLength) return clean;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = clean;
    const textContent = tempDiv.textContent || '';

    if (textContent.length <= maxLength) return clean;

    const truncatedText = textContent.substring(0, maxLength - 3) + '...';
    return `<p>${truncatedText}</p>`;
};