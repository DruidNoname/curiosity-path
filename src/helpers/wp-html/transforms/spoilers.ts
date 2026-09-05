import { HtmlTransform } from '../types';
import { isWhitespaceText } from './dom';

/**
 * Спойлер — единственное содержимое родительского `<pre>`?
 *
 * WP отдаёт спойлер внутри `<pre>`, если в редакторе абзац оказался в формате
 * «Форматированный текст». С `white-space: pre` содержимое не переносится и уезжает
 * за границы экрана, поэтому такой `<pre>` разворачивается вместе со спойлером.
 * Если рядом со спойлером в `<pre>` лежит что-то ещё — это настоящий преформат,
 * и трогать его нельзя.
 */
const isLonelySpoilerInPre = (spoilerWrap: Element): boolean => {
    const parent = spoilerWrap.parentElement;

    if (!parent || parent.tagName !== 'PRE') return false;

    return Array.from(parent.childNodes).every(node =>
        node === spoilerWrap || isWhitespaceText(node)
    );
};

/** Разметка плагина спойлеров (`.spoiler-wrap`) → нативный `<details>`. */
export const processSpoilers: HtmlTransform = doc => {
    const spoilers = Array.from(doc.querySelectorAll('.spoiler-wrap'));

    spoilers.forEach(spoilerWrap => {
        const head = spoilerWrap.querySelector('.spoiler-head');
        const body = spoilerWrap.querySelector('.spoiler-body');

        if (!head || !body) return;

        const details = doc.createElement('details');
        details.className = 'wp-spoiler';

        const summary = doc.createElement('summary');
        summary.innerHTML = head.innerHTML;

        details.appendChild(summary);
        details.innerHTML += body.innerHTML;

        const target = isLonelySpoilerInPre(spoilerWrap) ? spoilerWrap.parentElement! : spoilerWrap;

        target.parentNode?.replaceChild(details, target);
    });
};
