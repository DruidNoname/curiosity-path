import { createTips } from './tips';

describe('createTips', () => {
    it('возвращает пустую строку на пустом входе', () => {
        expect(createTips('')).toBe('');
        expect(createTips(null as unknown as string)).toBe('');
    });

    it('собирает подсказки в список и оставляет остальной HTML', () => {
        const result = createTips('[wprm-tip]Первый[/wprm-tip]<p>Остальное</p>[wprm-tip]Второй[/wprm-tip]');
        expect(result).toContain('<li>Первый</li>');
        expect(result).toContain('<li>Второй</li>');
        expect(result).toContain('Остальное');
        expect(result).not.toContain('wprm-tip');
    });

    it('понимает шорткод с атрибутом icon', () => {
        expect(createTips('[wprm-tip icon="bulb"]Совет[/wprm-tip]')).toContain('<li>Совет</li>');
    });

    it('санитизирует содержимое подсказок: оно уходит в dangerouslySetInnerHTML', () => {
        const result = createTips('[wprm-tip]<script>alert(1)</script><img src="x" onerror="alert(1)">Совет[/wprm-tip]');
        expect(result).not.toContain('<script>');
        expect(result).not.toContain('onerror');
        expect(result).toContain('Совет');
    });

    it('не оставляет пустых обёрток от вырезанных шорткодов', () => {
        expect(createTips('<p>[wprm-tip]Совет[/wprm-tip]</p>')).toBe('<ul><li>Совет</li></ul>');
    });
});
