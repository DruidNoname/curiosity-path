<?php

namespace CuriositySearch;

use Wamania\Snowball\Stemmer\Stemmer as SnowballStemmer;
use Wamania\Snowball\StemmerFactory;

/**
 * Слова → основы: «лес», «лесу», «лесом» сводятся к «лес».
 *
 * Стеммер Snowball отрезает окончания по правилам, без словаря: однокоренные
 * слова с разными суффиксами он не склеивает («лесной» → «лесн»). Одни и те же
 * правила работают при индексации и для запроса — поэтому находится ровно то,
 * что проиндексировано.
 */
final class Stemmer
{
    /** Основа длиннее не нужна: таких слов в блоге нет, а колонка в таблице конечна. */
    public const MAX_STEM_LENGTH = 64;

    /**
     * Служебные слова: есть почти в каждой записи. Без этого списка в запросе
     * «по лесу» требовалось бы найти «по».
     */
    private const STOP_WORDS = [
        'а', 'без', 'в', 'во', 'да', 'для', 'до', 'же', 'за', 'и', 'из', 'или', 'к', 'ко',
        'ли', 'на', 'над', 'не', 'ни', 'о', 'об', 'от', 'по', 'под', 'при', 'про', 'с',
        'со', 'то', 'у', 'что', 'это', 'как', 'так', 'бы', 'но',
    ];

    private SnowballStemmer $russian;
    private SnowballStemmer $english;
    /** @var array<string, true> */
    private array $stopWords;
    /** @var array<string, string|null> слово → основа: в одной записи слова повторяются */
    private array $cache = [];

    public function __construct()
    {
        $this->russian = StemmerFactory::create('ru');
        $this->english = StemmerFactory::create('en');
        $this->stopWords = array_fill_keys(self::STOP_WORDS, true);
    }

    /** Без регистра и с «ё» = «е» — так слово сравнивается везде. */
    public static function normalize(string $word): string
    {
        return str_replace('ё', 'е', mb_strtolower($word, 'UTF-8'));
    }

    /**
     * Слова строки: буквы и цифры, всё остальное — разделители.
     *
     * @return list<string>
     */
    public static function tokenize(string $text): array
    {
        preg_match_all('/[\p{L}\p{N}]+/u', $text, $matches);
        return $matches[0];
    }

    /** Основа слова или `null`, если слово служебное. */
    public function stem(string $word): ?string
    {
        $normalized = self::normalize($word);
        if (array_key_exists($normalized, $this->cache)) {
            return $this->cache[$normalized];
        }

        if (isset($this->stopWords[$normalized])) {
            $stem = null;
        } else {
            $stemmer = preg_match('/^[a-z0-9]+$/', $normalized) ? $this->english : $this->russian;
            $stem = mb_substr($stemmer->stem($normalized), 0, self::MAX_STEM_LENGTH, 'UTF-8');
        }

        return $this->cache[$normalized] = $stem;
    }

    /**
     * Сколько раз встречается каждая основа в тексте.
     *
     * @return array<string, int>
     */
    public function countStems(string $text): array
    {
        $counts = [];
        foreach (self::tokenize($text) as $word) {
            $stem = $this->stem($word);
            if ($stem !== null && $stem !== '') {
                $counts[$stem] = ($counts[$stem] ?? 0) + 1;
            }
        }
        return $counts;
    }

    /**
     * Основы запроса без служебных слов и повторов.
     *
     * @return list<string>
     */
    public function queryStems(string $query): array
    {
        return array_keys($this->countStems($query));
    }

    /**
     * Словоформы текста, по которым нашлась запись: слова с основой из запроса.
     * Фронт подсвечивает ровно их — и стеммер в браузер ехать не должен.
     *
     * @param list<string> $stems
     * @return list<string> нормализованные, без повторов
     */
    public function matchedWords(string $text, array $stems): array
    {
        $wanted = array_fill_keys($stems, true);
        $words = [];
        foreach (self::tokenize($text) as $word) {
            $stem = $this->stem($word);
            if ($stem !== null && isset($wanted[$stem])) {
                $words[self::normalize($word)] = true;
            }
        }
        return array_keys($words);
    }
}
