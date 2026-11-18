<?php

namespace CuriositySearch\Tests;

use CuriositySearch\Text;
use PHPUnit\Framework\TestCase;

final class TextTest extends TestCase
{
    public function testTagsBecomeSpacesSoWordsDoNotStick(): void
    {
        self::assertSame('лес поле', Text::toPlain('<p>лес</p><p>поле</p>'));
    }

    public function testDropsGutenbergCommentsScriptsAndStyles(): void
    {
        $html = '<!-- wp:paragraph --><p>Текст</p><!-- /wp:paragraph --><script>alert(1)</script><style>p{}</style>';
        self::assertSame('Текст', Text::toPlain($html));
    }

    public function testDecodesEntitiesAndInvisibleCharacters(): void
    {
        self::assertSame('«Лес» — тишина…', Text::toPlain("&laquo;Лес&raquo;&nbsp;&#8212; ти\u{00AD}шина&#8230;"));
    }
}
