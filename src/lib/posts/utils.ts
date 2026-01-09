import sanitizeHtml from 'sanitize-html';

export const createSimpleCleaner = () => {
    const getCleanEntry = (html: string): string => {
        if (!html || typeof html !== 'string') return '';

        // 1. Безопасная очистка
        const safeHtml = sanitizeHtml(html, {
            allowedTags: ['p', 'img', 'a', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3'],
            allowedAttributes: {
                img: ['src', 'alt', 'width', 'height'],
                a: ['href', 'target', 'rel']
            }
        });

        // 2. Удаляем лишние обёртки вокруг img
        let result = safeHtml
            // Убираем <strong> вокруг <img>
            .replace(/<strong[^>]*>(\s*)<img([^>]+)>(\s*)<\/strong>/gi, '<img$2>')
            // Убираем <div> вокруг <img>
            .replace(/<div[^>]*>(\s*)<img([^>]+)>(\s*)<\/div>/gi, '<img$2>')
            // Убираем <span> вокруг <img>
            .replace(/<span[^>]*>(\s*)<img([^>]+)>(\s*)<\/span>/gi, '<img$2>')
            // Убираем <p> вокруг <img>
            .replace(/<p[^>]*>(\s*)<img([^>]+)>(\s*)<\/p>/gi, '<img$2>')
            // Убираем вложенные <strong> в <strong>
            .replace(/<strong[^>]*>(\s*)<strong[^>]*>([^<]+)<\/strong>(\s*)<\/strong>/gi, '<strong>$2</strong>');

        // 3. Убираем пустые параграфы
        result = result.replace(/<p[^>]*>\s*<\/p>/gi, '');

        return result;
    };

    return getCleanEntry;
};

export const getCleanEntry = createSimpleCleaner();
export const createExcerpt = (html: string, maxLength: number = 500): string => {
    const clean = getCleanEntry(html);

    if (clean.length <= maxLength) return clean;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = clean;
    const textContent = tempDiv.textContent || '';

    if (textContent.length <= maxLength) return clean;

    const truncatedText = textContent.substring(0, maxLength - 3) + '...';
    return `<p>${truncatedText}</p>`;
};