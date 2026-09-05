import { HtmlTransform } from '../types';

/**
 * Классы выравнивания переезжают с картинки на обёртку: по ним стилизуется именно
 * обёртка (см. `.lonely-image__wrapper` в `styles/index.css`).
 */
const ALIGN_CLASS_PATTERNS: (string | RegExp)[] = [
    'alignright', 'alignleft', 'aligncenter',
    /^align/,
    /^float-/
];

const WRAPPER_TAG = 'span';
const WRAPPER_CLASS = 'lonely-image__wrapper';

/**
 * Классы, по которым обёртка реально плавает (см. `.alignleft`/`.alignright` в
 * `styles/index.css`). Плавающий элемент обтекается только текстом, который идёт за ним,
 * поэтому такую обёртку нужно поднять в начало родителя — иначе текст до картинки
 * не обтекает её, а висит сверху.
 */
const FLOATING_ALIGN_CLASSES = ['alignleft', 'alignright'];

const matchesAlignPattern = (className: string): boolean =>
    ALIGN_CLASS_PATTERNS.some(pattern =>
        typeof pattern === 'string' ? className === pattern : pattern.test(className)
    );

/** Картинки без подписи (то есть вне `<figure>`) оборачиваются, чтобы получить рамку. */
export const wrapLonelyImages: HtmlTransform = doc => {
    const images = Array.from(doc.querySelectorAll('img')).filter(img => !img.closest('figure'));

    images.forEach(img => {
        const parent = img.parentNode;
        if (!parent) return;

        const imgClasses = img.className ? img.className.split(' ').filter(Boolean) : [];

        const classesForWrapper = imgClasses.filter(matchesAlignPattern);
        classesForWrapper.push(WRAPPER_CLASS);

        const classesForImg = imgClasses.filter(className => !classesForWrapper.includes(className));

        const wrapper = doc.createElement(WRAPPER_TAG);
        wrapper.className = classesForWrapper.join(' ');

        if (classesForImg.length > 0) {
            img.className = classesForImg.join(' ');
        } else {
            img.removeAttribute('class');
        }

        // По умолчанию обёртка встаёт ровно на место картинки и остаётся в потоке текста.
        // Поднимаем в начало родителя только плавающие — ради корректного обтекания.
        parent.replaceChild(wrapper, img);

        if (classesForWrapper.some(className => FLOATING_ALIGN_CLASSES.includes(className))) {
            parent.insertBefore(wrapper, parent.firstChild);
        }

        wrapper.appendChild(img);
    });
};
