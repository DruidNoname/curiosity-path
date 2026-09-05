import { toPlainText, truncate, toMetaText } from './index';

describe('toPlainText', () => {
    it('снимает теги', () => {
        expect(toPlainText('<p>Привет, <b>мир</b></p>')).toBe('Привет, мир');
    });

    it('не склеивает слова на границах блоков', () => {
        expect(toPlainText('<p>Первый</p><p>Второй</p>')).toBe('Первый Второй');
        expect(toPlainText('Строка<br>Вторая')).toBe('Строка Вторая');
    });

    it('декодирует именованные сущности', () => {
        expect(toPlainText('Быть&nbsp;&laquo;хорошим&raquo;&nbsp;&mdash; сложно'))
            .toBe('Быть «хорошим» — сложно');
    });

    it('декодирует числовые сущности, десятичные и шестнадцатеричные', () => {
        expect(toPlainText('&#1055;&#1088;&#1080;&#1074;&#1077;&#1090;')).toBe('Привет');
        expect(toPlainText('&#x41;&#x42;')).toBe('AB');
    });

    it('не трогает неизвестные сущности', () => {
        expect(toPlainText('&unknownentity; хвост')).toBe('&unknownentity; хвост');
    });

    it('выбрасывает содержимое script и style', () => {
        expect(toPlainText('<style>.a{color:red}</style>Текст<script>alert(1)</script>'))
            .toBe('Текст');
    });

    it('схлопывает пробелы и обрезает края', () => {
        expect(toPlainText('  <p>  много   пробелов  </p> ')).toBe('много пробелов');
    });

    it('пустой ввод даёт пустую строку', () => {
        expect(toPlainText(undefined)).toBe('');
        expect(toPlainText(null)).toBe('');
        expect(toPlainText('')).toBe('');
    });
});

describe('truncate', () => {
    it('короткий текст не трогает', () => {
        expect(truncate('Коротко', 50)).toBe('Коротко');
    });

    it('режет по границе слова', () => {
        expect(truncate('раз два три четыре пять', 12)).toBe('раз два три…');
    });

    it('убирает висящую пунктуацию перед многоточием', () => {
        expect(truncate('раз два, три четыре', 9)).toBe('раз два…');
    });

    it('режет посреди слова, если слово слишком длинное', () => {
        const result = truncate('иммунноэлектрофоретический анализ', 10);
        expect(result).toBe('иммунноэле…');
    });
});

describe('toMetaText', () => {
    it('снимает разметку и обрезает за один вызов', () => {
        const html = '<p>Моя профессия меняется с&nbsp;такой скоростью, что уследить трудно</p>';
        expect(toMetaText(html, 30)).toBe('Моя профессия меняется с…');
    });
});
