import { HtmlTransform } from '../types';
import { isWhitespaceText } from './dom';

/** Сколько подряд идущих `<br>` оставляем от длинной цепочки. */
const MAX_CONSECUTIVE_BREAKS = 2;

const isBreak = (node: Node): boolean =>
    node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'BR';

/**
 * Схлопывает цепочки из трёх и более `<br>` до двух.
 *
 * WP оставляет такие цепочки на месте вручную разбитых абзацев; на странице это
 * превращается в дыру в полэкрана.
 */
export const collapseMultipleBreaks: HtmlTransform = doc => {
    const handled = new Set<Node>();

    Array.from(doc.querySelectorAll('br')).forEach(br => {
        if (handled.has(br)) return;

        // Собираем непрерывную цепочку <br>, пропуская пробельные текстовые узлы между ними.
        const chain: Node[] = [br];
        const spaces: Node[] = [];

        for (let node = br.nextSibling; node; node = node.nextSibling) {
            if (isWhitespaceText(node)) {
                spaces.push(node);
                continue;
            }
            if (!isBreak(node)) break;

            chain.push(node);
            handled.add(node);
        }

        if (chain.length <= MAX_CONSECUTIVE_BREAKS) return;

        chain.slice(MAX_CONSECUTIVE_BREAKS).forEach(extra => (extra as Element).remove());
        spaces.forEach(space => (space as ChildNode).remove());
    });
};
