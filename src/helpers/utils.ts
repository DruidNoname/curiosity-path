import sanitizeHtml from 'sanitize-html';

//CLEAN TYPOGRAPHY
const deleteEmptyParagraphs = (result: string): string => {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(result, 'text/html');
        const body = doc.body;

        // Функция для проверки, является ли параграф пустым
        const isEmptyParagraph = (element: Element): boolean => {
            if (!element || element.nodeType !== 1) return false;

            // Проверяем только элементы <p>
            if (element.tagName !== 'P') return false;

            // Получаем содержимое
            const innerHTML = element.innerHTML || '';
            const textContent = element.textContent || '';

            // Очищаем содержимое от всех HTML тегов
            const tempDiv = doc.createElement('div');
            tempDiv.innerHTML = innerHTML;
            const plainText = tempDiv.textContent || tempDiv.innerText || '';

            // Удаляем все неразрывные пробелы и обычные пробелы
            const cleanedText = plainText
                .replace(/&nbsp;/gi, '')
                .replace(/\u00A0/g, '')
                .trim();

            // Параграф считается пустым если:
            // 1. plainText после очистки пустой
            // 2. textContent после трима пустой
            // 3. Внутри только пробелы/неразрывные пробелы
            return cleanedText === '' && textContent.trim() === '';
        };

        // Находим ВСЕ параграфы в документе
        const allParagraphs = Array.from(body.getElementsByTagName('p'));

        // Удаляем все пустые параграфы
        allParagraphs.forEach(paragraph => {
            if (isEmptyParagraph(paragraph) && paragraph.parentNode) {
                paragraph.parentNode.removeChild(paragraph);
            }
        });

        return body.innerHTML;

    } catch (error) {
        console.warn('DOMParser error:', error);
        // Если DOMParser не сработал, используем регулярные выражения
        // Удаляем все пустые параграфы (включая с атрибутами)
        return result.replace(/<p[^>]*>\s*(&nbsp;|\u00A0|<\/?br\s*\/?>|\s)*<\/p>/gi, '');
    }
};


//MODIFY IMAGES

const lonelyImageWrap = (rawText: string, options = {}) => {
    const defaults = {
        transferToWrapper: [
            'alignright', 'alignleft', 'aligncenter',
            /^align/,
            /^float-/
        ],
        wrapperTag: 'figure'
    };
    const config = { ...defaults, ...options };

    const parser = new DOMParser();
    const doc = parser.parseFromString(rawText, 'text/html');

    const images = Array.from(doc.querySelectorAll('img')).filter(img => !img.closest('caption'));

    images.forEach(img => {
        // Получаем родителя и следующего sibling для безопасной вставки
        const parent = img.parentNode;
        if (!parent) return;

        // Получаем классы изображения
        const imgClasses = img.className ? img.className.split(' ').filter(Boolean) : [];

        // Фильтруем классы для переноса
        const classesForWrapper = imgClasses.filter(className =>
            config.transferToWrapper.some(pattern =>
                typeof pattern === 'string' ? className === pattern : pattern.test(className)
            )
        );

        classesForWrapper.push('lonely-image__wrapper');

        const classesForImg = imgClasses.filter(className =>
            !classesForWrapper.includes(className)
        );

        // Создаем обертку
        const wrapper = doc.createElement(config.wrapperTag);
        if (classesForWrapper.length > 0) {
            wrapper.className = classesForWrapper.join(' ');
        }

        // Обновляем классы изображения
        if (classesForImg.length > 0) {
            img.className = classesForImg.join(' ');
        } else {
            img.removeAttribute('class');
        }

        parent.replaceChild(wrapper, img);
        wrapper.appendChild(img);
    });

    return doc.body.innerHTML;
};

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

    result = deleteEmptyParagraphs(result);
    // После удаления пустых параграфов, удаляем возможные множественные <br>
    result = result.replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');
    // Удаляем лишние пробелы
    result = result.trim();

    result = lonelyImageWrap(result);

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
