import sanitizeHtml from 'sanitize-html';

//CLEAN TYPOGRAPHY
const isEmptyParagraph = (element: Element): boolean => {
    if (!element || element.nodeType !== 1) return false;
    if (element.tagName !== 'P') return false;

    const innerHTML = element.innerHTML || '';
    const textContent = element.textContent || '';

    const tempDiv = element.ownerDocument.createElement('div');
    tempDiv.innerHTML = innerHTML;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';

    const cleanedText = plainText
        .replace(/&nbsp;/gi, '')
        .replace(/\u00A0/g, '')
        .trim();

    return cleanedText === '' && textContent.trim() === '';
};

//BEAUTIFY IMAGES WITHOUT CAPTIONS
const processLonelyImages = (doc: Document, options = {}): void => {
    const defaults = {
        transferToWrapper: [
            'alignright', 'alignleft', 'aligncenter',
            /^align/,
            /^float-/
        ],
        wrapperTag: 'span'
    };
    const config = { ...defaults, ...options };

    const images = Array.from(doc.querySelectorAll('img')).filter(img => !img.closest('figure'));

    images.forEach(img => {
        const parent = img.parentNode;
        if (!parent) return;

        const imgClasses = img.className ? img.className.split(' ').filter(Boolean) : [];

        const classesForWrapper = imgClasses.filter(className =>
            config.transferToWrapper.some(pattern =>
                typeof pattern === 'string' ? className === pattern : pattern.test(className)
            )
        );

        classesForWrapper.push('lonely-image__wrapper');

        const classesForImg = imgClasses.filter(className =>
            !classesForWrapper.includes(className)
        );

        const wrapper = doc.createElement(config.wrapperTag);
        if (classesForWrapper.length > 0) {
            wrapper.className = classesForWrapper.join(' ');
        }

        if (classesForImg.length > 0) {
            img.className = classesForImg.join(' ');
        } else {
            img.removeAttribute('class');
        }

        parent.replaceChild(wrapper, img);
        parent.insertBefore(wrapper, parent.firstChild);
        wrapper.appendChild(img);
    });
};

//BEAUTIFY IMAGES WITH CAPTIONS
const processFigures = (doc: Document): void => {
    const figures = doc.querySelectorAll('figure');

    figures.forEach(figure => {
        const caption = figure.querySelector('figcaption');
        if (!caption) return;

        const img = figure.querySelector('img[class*="wp-image-"]');
        if (!img) return;

        const match = img.className.match(/wp-image-(\d+)/);
        if (!match || !match[1]) return;

        const width = parseInt(match[1], 10);
        if (isNaN(width) || width <= 0) return;

        figure.style.maxWidth = `${width}px`;
        figure.classList.add('wp-image-limited');

        caption.style.maxWidth = '100%';
        caption.style.boxSizing = 'border-box';
        figure.dataset.imageWidth = String(width);
    });
};

// Основная функция, использующая один парсер
const processHTML = (html: string, options = {}): string => {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const body = doc.body;

        const allParagraphs = Array.from(body.getElementsByTagName('p'));
        allParagraphs.forEach(paragraph => {
            if (isEmptyParagraph(paragraph) && paragraph.parentNode) {
                paragraph.parentNode.removeChild(paragraph);
            }
        });

        processLonelyImages(doc, options);
        processFigures(doc);

        return body.innerHTML;

    } catch (error) {
        console.warn('DOMParser error:', error);
        // Фолбэк на случай ошибки парсера
        return html.replace(/<p[^>]*>\s*(&nbsp;|\u00A0|<\/?br\s*\/?>|\s)*<\/p>/gi, '');
    }
};

// Экспорт для использования
export const processAllHTML = processHTML;

export const getCleanEntry = (html: string): string => {
    if (!html || typeof html !== 'string') return '';

    // Сначала санитизация
    let result = sanitizeHtml(html, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', //headers
            'img', 'figure', 'figcaption', 'pre', 'code', //images
            'p', 'del', 'em', 'strong', 'b' //typography
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

    result = processHTML(result);
    // После удаления пустых параграфов, удаляем возможные множественные <br>
    result = result.replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');
    // Удаляем лишние пробелы
    result = result.trim();

    return result;
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
