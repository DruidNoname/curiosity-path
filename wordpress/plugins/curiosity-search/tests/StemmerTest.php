<?php

namespace CuriositySearch\Tests;

use CuriositySearch\Stemmer;
use PHPUnit\Framework\TestCase;

final class StemmerTest extends TestCase
{
    private Stemmer $stemmer;

    protected function setUp(): void
    {
        $this->stemmer = new Stemmer();
    }

    public function testWordFormsShareOneStem(): void
    {
        $stems = array_map([$this->stemmer, 'stem'], ['лес', 'лесу', 'лесом', 'Леса']);
        self::assertSame(['лес'], array_values(array_unique($stems)));
    }

    public function testYoIsTheSameAsYe(): void
    {
        self::assertSame($this->stemmer->stem('елочка'), $this->stemmer->stem('Ёлочка'));
    }

    public function testStopWordsHaveNoStem(): void
    {
        self::assertNull($this->stemmer->stem('По'));
    }

    public function testLatinWordsUseEnglishStemmer(): void
    {
        self::assertSame($this->stemmer->stem('hook'), $this->stemmer->stem('Hooks'));
    }

    public function testCountStems(): void
    {
        self::assertSame(['лес' => 3, 'шум' => 1], $this->stemmer->countStems('Лес шумит, в лесу. По лесам!'));
    }

    public function testQueryStemsSkipStopWordsAndDuplicates(): void
    {
        self::assertSame(['лес'], $this->stemmer->queryStems('по лесу, лесом'));
        self::assertSame([], $this->stemmer->queryStems('и в на'));
    }

    public function testMatchedWordsAreWholeWordFormsOnly(): void
    {
        $words = $this->stemmer->matchedWords('Тыгыдыкала по Лесу, а всплески и прелесть — не про лес. Лесу!', ['лес']);
        self::assertSame(['лесу', 'лес'], $words);
    }
}
