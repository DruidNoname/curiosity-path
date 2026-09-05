import { applyTransforms } from '../pipeline';
import { processSpoilers } from './spoilers';

const spoiler = `
    <div class="spoiler-wrap">
        <div class="spoiler-head folded">Заголовок</div>
        <div class="spoiler-body">Тело спойлера</div>
    </div>
`;

const run = (html: string) => applyTransforms(html, [processSpoilers]);

describe('processSpoilers', () => {
    it('превращает .spoiler-wrap в <details>', () => {
        const result = run(spoiler);
        expect(result).toContain('<details class="wp-spoiler">');
        expect(result).toContain('<summary>Заголовок</summary>');
        expect(result).toContain('Тело спойлера');
        expect(result).not.toContain('spoiler-wrap');
    });

    it('не трогает разметку без головы или тела', () => {
        const result = run('<div class="spoiler-wrap"><div class="spoiler-head">Только голова</div></div>');
        expect(result).not.toContain('<details');
        expect(result).toContain('spoiler-wrap');
    });

    it('разворачивает спойлер из <pre>: иначе white-space: pre ломает перенос строк', () => {
        const result = run(`<pre>${spoiler}</pre>`);
        expect(result).toContain('<details class="wp-spoiler">');
        expect(result).toContain('Тело спойлера');
        expect(result).not.toContain('<pre>');
    });

    it('оставляет <pre> на месте, если в нём есть что-то кроме спойлера', () => {
        const result = run(`<pre>Код рядом${spoiler}</pre>`);
        expect(result).toContain('<pre>');
        expect(result).toContain('Код рядом');
        expect(result).toContain('<details class="wp-spoiler">');
    });
});
