<?php

namespace CuriositySearch;

/**
 * HTML записи → простой текст для индекса.
 *
 * Без функций WordPress, чтобы проверяться тестами без WP. Теги заменяются
 * пробелом, а не удаляются: иначе `<p>лес</p><p>поле</p>` слиплось бы в «леспол».
 */
final class Text
{
    public static function toPlain(string $html): string
    {
        // содержимое script/style в текст попасть не должно
        $text = preg_replace('#<(script|style)\b[^>]*>.*?</\1>#is', ' ', $html) ?? '';
        // комментарии блоков Gutenberg (<!-- wp:paragraph -->) и обычные теги
        $text = preg_replace('#<!--.*?-->|<[^>]+>#s', ' ', $text) ?? '';
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        // неразрывный пробел, мягкий перенос и нулевая ширина
        $text = str_replace(["\u{00A0}", "\u{00AD}", "\u{200B}", "\u{FEFF}"], [' ', '', '', ''], $text);

        return trim(preg_replace('/\s+/u', ' ', $text) ?? '');
    }
}
