import sanitizeHtml from 'sanitize-html';

interface HeightDifference {
    imgHeight: number;
    textHeight: number;
    difference: number;
    absoluteDifference: number;
    paragraphsCount: number;
    elementsCount: number;
}

interface HeightDifferenceOptions {
    startSelector?: string; // Селектор элемента начала отсчёта
    stopSelector?: string; // Селектор элемента, на котором останавливаемся
    includeStopElement?: boolean; // Включать ли стоп-элемент в подсчёт
}

//это надо убрать, добавить функцию, где в случае, если после
// картинки выровненной идёт другая картинка, забрать теги между ними
// и обернуть в разметку с float
export const getHeightDifference = (
    html: string,
    options: HeightDifferenceOptions = {}
): HeightDifference => {
    if (!html || typeof html !== 'string') {
        return {
            imgHeight: 0,
            textHeight: 0,
            difference: 0,
            absoluteDifference: 0,
            paragraphsCount: 0,
            elementsCount: 0
        };
    }

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const body = doc.body;

        // Находим элемент начала отсчёта по селектору
        let startElement: Element | null = null;

        if (options.startSelector) {
            startElement = body.querySelector(options.startSelector);
        } else {
            // По умолчанию ищем первое изображение
            startElement = body.querySelector('figure:has(img), img');
        }

        if (!startElement) {
            return {
                imgHeight: 0,
                textHeight: 0,
                difference: 0,
                absoluteDifference: 0,
                paragraphsCount: 0,
                elementsCount: 0
            };
        }

        // Получаем высоту изображения
        let imgHeight = 0;
        let imgWidth = 500;

        const img = startElement.tagName === 'IMG'
            ? startElement as HTMLImageElement
            : startElement.querySelector('img');

        if (img) {
            imgHeight = parseInt(img.getAttribute('height') || '0');
            imgWidth = parseInt(img.getAttribute('width') || '500');

            // Если высота не указана, пробуем вычислить
            if (!imgHeight && (img as any).naturalHeight) {
                imgHeight = (img as any).naturalHeight;
            }
        }

        // Собираем все элементы после элемента начала
        const collectedElements: Element[] = [];
        let paragraphsCount = 0;

        let currentElement = startElement.nextElementSibling;
        let stopElementFound = false;

        while (currentElement && !stopElementFound) {
            // Проверяем, не достигли ли мы стоп-элемента
            if (options.stopSelector && currentElement.matches(options.stopSelector)) {
                if (options.includeStopElement) {
                    collectedElements.push(currentElement);
                }
                stopElementFound = true;
                break;
            }

            collectedElements.push(currentElement);

            // Считаем абзацы
            if (currentElement.tagName === 'P') {
                paragraphsCount++;
            }

            currentElement = currentElement.nextElementSibling;
        }

        // Создаем временный контейнер для измерения высоты текста
        const tempContainer = doc.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.visibility = 'hidden';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        tempContainer.style.width = `${imgWidth}px`;
        tempContainer.style.fontFamily = 'Arial, sans-serif';
        tempContainer.style.fontSize = '16px';
        tempContainer.style.lineHeight = '1.5';

        // Копируем элементы во временный контейнер
        collectedElements.forEach(element => {
            const elementClone = element.cloneNode(true) as Element;
            tempContainer.appendChild(elementClone);
        });

        // Добавляем в документ для измерения
        body.appendChild(tempContainer);
        const textHeight = tempContainer.offsetHeight;
        body.removeChild(tempContainer);

        // Вычисляем разницу
        const difference = imgHeight - textHeight;
        const absoluteDifference = Math.abs(difference);

        return {
            imgHeight,
            textHeight,
            difference,
            absoluteDifference,
            paragraphsCount,
            elementsCount: collectedElements.length
        };

    } catch (error) {
        console.error('Error calculating height difference:', error);
        return {
            imgHeight: 0,
            textHeight: 0,
            difference: 0,
            absoluteDifference: 0,
            paragraphsCount: 0,
            elementsCount: 0
        };
    }
};

export const getCleanEntry = (html: string): string => {
    if (!html || typeof html !== 'string') return '';

    // Сначала санитизация
    let result = sanitizeHtml(html, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'img', 'figure', 'figcaption', 'pre', 'code', 'p'
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

    // Используем DOMParser для удаления всех пустых параграфов
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

        result = body.innerHTML;

    } catch (error) {
        console.warn('DOMParser error:', error);
        // Если DOMParser не сработал, используем регулярные выражения
        // Удаляем все пустые параграфы (включая с атрибутами)
        result = result.replace(/<p[^>]*>\s*(&nbsp;|\u00A0|<\/?br\s*\/?>|\s)*<\/p>/gi, '');
    }

    // После удаления пустых параграфов, удаляем возможные множественные <br>
    result = result.replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');

    // Удаляем лишние пробелы
    result = result.trim();

    // console.log(getHeightDifference(
    //     result,
    //     {
    //         startSelector: '.alignright', // Элемент начала отсчёта (картинка/фигура)
    //         stopSelector: '.aligncenter', // Класс элемента, на котором останавливаемся
    //     }
    // ));

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