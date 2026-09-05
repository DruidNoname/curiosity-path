import { applyTransforms } from '../pipeline';
import { collapseMultipleBreaks } from './breaks';

const run = (html: string) => applyTransforms(html, [collapseMultipleBreaks]);

describe('collapseMultipleBreaks', () => {
    it('схлопывает цепочку из трёх и более <br> до двух', () => {
        expect(run('<br><br><br><br>')).toBe('<br><br>');
    });

    it('не трогает одиночные и парные <br>', () => {
        expect(run('<br>')).toBe('<br>');
        expect(run('<br><br>')).toBe('<br><br>');
    });

    it('считает цепочкой и те <br>, что разделены пробелами и переносами строк', () => {
        expect(run('<br>\n  <br>\n  <br>')).toBe('<br><br>');
    });

    it('не склеивает цепочки из разных родителей', () => {
        expect(run('<p><br><br></p><p><br><br></p>')).toBe('<p><br><br></p><p><br><br></p>');
    });

    it('обрывает цепочку на любом непробельном содержимом', () => {
        expect(run('<br><br>текст<br><br>')).toBe('<br><br>текст<br><br>');
    });
});
