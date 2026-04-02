import '@testing-library/jest-dom';
import { getCleanEntry, createExcerpt, processAllHTML } from './utils';

describe('utils', () => {
    describe('getCleanEntry', () => {
        it('should return empty string for empty input', () => {
            expect(getCleanEntry('')).toBe('');
            expect(getCleanEntry(null as any)).toBe('');
            expect(getCleanEntry(undefined as any)).toBe('');
        });

        it('should sanitize HTML and remove dangerous tags', () => {
            const html = '<p>Hello <script>alert("xss")</script> World</p>';
            const result = getCleanEntry(html);
            expect(result).not.toContain('<script>');
            expect(result).toContain('Hello');
            expect(result).toContain('World');
        });

        it('should keep allowed tags', () => {
            const html = `
                <h1>Title</h1>
                <p>Paragraph with <strong>bold</strong> and <em>italic</em></p>
                <img src="test.jpg" alt="test" />
                <figure><img src="img.jpg" /><figcaption>Caption</figcaption></figure>
            `;
            const result = getCleanEntry(html);
            expect(result).toContain('<h1>');
            expect(result).toContain('<strong>');
            expect(result).toContain('<em>');
            expect(result).toContain('<img');
            expect(result).toContain('<figure>');
            expect(result).toContain('<figcaption>');
        });

        it('should remove empty paragraphs', () => {
            const html = '<p>Valid</p><p>&nbsp;</p><p>   </p><p>Also valid</p>';
            const result = getCleanEntry(html);
            expect(result).toContain('Valid');
            expect(result).toContain('Also valid');
            expect(result).not.toMatch(/<p>\s*<\/p>/);
        });

        it('should wrap lonely images', () => {
            const html = '<p>Text <img src="test.jpg" class="aligncenter" /> more text</p>';
            const result = getCleanEntry(html);
            expect(result).toContain('lonely-image__wrapper');
        });

        it('should wrap lonely images with alignnone class', () => {
            const html = `<p><img loading="lazy" decoding="async" class="wp-image-683 size-large alignnone" src="https://suffer.curiosity-path.ru/wp-content/uploads/2026/04/achivement-2-576x1024.png" alt="" width="576" height="1024" srcset="https://suffer.curiosity-path.ru/wp-content/uploads/2026/04/achivement-2-576x1024.png 576w, https://suffer.curiosity-path.ru/wp-content/uploads/2026/04/achivement-2-169x300.png 169w, https://suffer.curiosity-path.ru/wp-content/uploads/2026/04/achivement-2.png 720w" sizes="auto, (max-width: 576px) 100vw, 576px" /></p>`;
            const result = getCleanEntry(html);
            console.log('Result for alignnone image:', result);
            expect(result).toContain('lonely-image__wrapper');
            expect(result).toContain('alignnone');
        });

        it('should process figures with captions', () => {
            const html = `
                <figure class="wp-caption">
                    <img src="test.jpg" class="wp-image-500" width="500" />
                    <figcaption>Caption text</figcaption>
                </figure>
            `;
            const result = getCleanEntry(html);
            expect(result).toContain('wp-image-limited');
            expect(result).toContain('max-width: 500px');
        });

        it('should keep allowed attributes', () => {
            const html = '<a href="https://example.com" target="_blank" rel="noopener">Link</a>';
            const result = getCleanEntry(html);
            expect(result).toContain('href="https://example.com"');
            expect(result).toContain('target="_blank"');
            expect(result).toContain('rel="noopener"');
        });

        it('should remove disallowed attributes', () => {
            const html = '<img src="test.jpg" onclick="alert(1)" onerror="alert(2)" />';
            const result = getCleanEntry(html);
            expect(result).not.toContain('onclick');
            expect(result).not.toContain('onerror');
        });

        it('should collapse multiple br tags', () => {
            const html = '<p>Text</p><br><br><br><br><p>More</p>';
            const result = getCleanEntry(html);
            const brCount = (result.match(/<br>/g) || []).length;
            expect(brCount).toBeLessThanOrEqual(2);
        });

        it('should handle the blog post excerpt from April 2025', () => {
            const html = `
                <h3>Апрель 2025</h3>
                <p>Для начала Лёвочка научился залезать к нам на кровать. Это произошло потому, что мы стали ссаживать ребёнка на пол при приёме нами внутрь завтрака (завтрак у нас обычно в постели). Бедный голодный ребёнок (который по факту завтракал пятнадцать минут назад) начал залезать на кровать, чтобы добраться до родительского творога и по возможности сделать кофе в постель в самом прямом смысле этого слова. Вот что значит правильно подобранный стимул.</p>
                <p>Потихоньку учится ходить: может сделать несколько шагов без опоры и поддержки.</p>
                <p>Машет «пока-пока» папе, когда он уходит на работу (в основном почему-то через минуту после отбытия первого).</p>
                <p>Знает слово «мама» и умильно произносит его.</p>
                <p>Помогает папе собрать плавающие в ванной игрушки.</p>
                <p>Знает, как оперативно достать еду из бюстгальтера (план «Б» на случай, если операция «кофе в постели» провалилась).</p>
                <p>Начинает пользоваться ложкой, правда, пока требует, чтобы еду туда набирал кормящий. Ложку хватает близко к черпаку и во время кормления перемазывается до бровей.</p>
                <p>Уверенно строит башню из деревянных кубиков и нанизывает колечки на палочку, однако в мяч по-прежнему не хочет со мной играть. Любимая игрушка — Юра.</p>
            `;
            const result = getCleanEntry(html);
            expect(result).toContain('<h3>Апрель 2025</h3>');
            expect(result).toContain('Лёвочка научился залезать к нам на кровать');
            expect(result).toContain('Любимая игрушка — Юра');
            expect(result).not.toContain('<script>');
        });

        it('should handle the blog post excerpt from May 2025', () => {
            const html = `
                <p><strong>Май 2025</strong></p>
                <p>Демонстрирует проблески разума — при сборе в ванной рыбок, отодвигает градусник в виде ёжика потому, что он — не рыбка. Отодвигает от себя стакан с водой, если не хочет пить, и показывает, что стакан нужно поставить на стол.</p>
                <p>Практически бегает по коридорам — делает много шажочков прежде чем плюхнуться на попу, разворачивается, выходит из комнаты, правда, совершенно не обращает внимания на то, что валяется на полу перед ним (может наступить и подскользнуться).</p>
                <p>Открывает ящики, залезает в полочки — от него совершенно невозможно спастись.</p>
                <p>Говорит «мама», «да» и «надо», но последнее, кажется неосмысленно.</p>
                <p>Слова «нельзя» и «фу-фу-фу» вызывают радостный смех и побуждают и дальше продолжать данное занятие.</p>
            `;
            const result = getCleanEntry(html);
            expect(result).toContain('<strong>Май 2025</strong>');
            expect(result).toContain('Демонстрирует проблески разума');
            expect(result).toContain('отодвигает градусник в виде ёжика');
        });

        it('should handle the blog post excerpt from June 2025', () => {
            const html = `
                <h3>Июнь 2025</h3>
                <p>Площадку мы освоили — и качели, и мячик покатать на ней стало более-менее беспроблемно. Правда, Лёвочка быстро устаёт и начинает реветь: несите царя на руках или везите в коляске. Если не ревёт — пытается съесть все камни и палки, которые находит.</p>
                <p>Научился самостоятельно залезать на башню помощника, которая стоит рядом с подоконником, и в качестве помощи пытается съесть землю из горшка с базиликом. Научился с неё слезать.</p>
                <p>Управляет машинкой с пульта, правда, наугад.</p>
                <p>Играет с сестрицей в догонялки и прятки: находит её за дверью или за кроватью.</p>
                <figure class="aentry-post__figure aentry-post__figure--text-width" data-figure-type="image" data-image-type="standart">
                    <div class="aentry-post__img--text-width ng-scope">
                        <div class="image-comment__wrapper">
                            <p><img loading="lazy" decoding="async" class="aligncenter wp-image-682 size-full" src="https://suffer.curiosity-path.ru/wp-content/uploads/2026/04/achivement-1.png" alt="" width="415" height="584" srcset="https://suffer.curiosity-path.ru/wp-content/uploads/2026/04/achivement-1.png 415w, https://suffer.curiosity-path.ru/wp-content/uploads/2026/04/achivement-1-213x300.png 213w" sizes="auto, (max-width: 415px) 100vw, 415px" /></p>
                        </div>
                    </div>
                </figure>
                <p>Начали осваивать горшок, правда, довольно бездарно.</p>
            `;
            const result = getCleanEntry(html);
            expect(result).toContain('<h3>Июнь 2025</h3>');
            expect(result).toContain('Площадку мы освоили');
            expect(result).toContain('Лёвочка быстро устаёт');
            expect(result).toContain('Начали осваивать горшок');
            expect(result).toContain('aentry-post__figure');
            expect(result).toContain('<img');
        });

        it('should handle the blog post excerpt from July 2025', () => {
            const html = `
                <h3><strong>Июль 2025</strong></h3>
                <p>Очень проникся лесной земляникой.</p>
                <p>Устраивает дичайшие истерики, если ему что-то не нравится. Пытается вылезти из маленькой ванночки.</p>
                <p>Научился обниматься. Нина привезла ему из поездки в Питер автобусик, бабушка сказала: «Это тебе привезла сестрица Нина,» он подошёл и обнял её за коленки. Ещё научился тянуть и дёргать меня за платье.</p>
                <p>Ещё иногда прячет руки за спину, пока ходит. Думаем, что это от ленты для застёжки подгузников на спине.</p>
                <p>Всё время утаскивает мышь с моего рабочего стола. Вообще приборы с красными огоньками имеют для него максимальную привлекательность.</p>
            `;
            const result = getCleanEntry(html);
            expect(result).toContain('<h3>');
            expect(result).toContain('Июль 2025');
            expect(result).toContain('лесной земляникой');
            expect(result).toContain('Научился обниматься');
        });

        it('should handle the blog post excerpt from August 2025', () => {
            const html = `
                <h3>Август 2025</h3>
                <p>Очень хорошо соображает, «мама» и «баба» определённо привязаны к конкретным личностям.</p>
                <p>Выучил жест «дай» — протягивает руку к предмету и начинает вращать кистью, будто выкручивает лампочку.</p>
                <p>Требует фрукт после еды протяжным «АААААААААААААААААААААААа».</p>
                <p>Открывает шкафы, выдвигает ящики, сдёргивает кастрюли с полок — ведёт себя как типичный полтергейст.</p>
                <p>Иногда можно уговорить его положить что-нибудь на место. Как правило — редко, поскольку всё добытое — трофей (съедобный или условно-съедобный).</p>
            `;
            const result = getCleanEntry(html);
            expect(result).toContain('<h3>Август 2025</h3>');
            expect(result).toContain('жест «дай»');
            expect(result).toContain('выкручивает лампочку');
            expect(result).toContain('типичный полтергейст');
        });

        it('should handle the blog post excerpt from September 2025', () => {
            const html = `
                <h3>Сентябрь 2025</h3>
                <p>Любовь к машинам продолжается. Гуляем на стилобате — радостно топает к каждой первой приехавшей машине, оттащить не всегда получается. Весело тащит за собой грузовик на верёвочке. Дома просит меня запускать инерционные машинки и весело за ними бегает.</p>
                <p><img loading="lazy" decoding="async" class="alignnone wp-image-684 size-large" src="https://suffer.curiosity-path.ru/wp-content/uploads/2026/04/achivement-3-768x1024.png" alt="" width="768" height="1024" srcset="https://suffer.curiosity-path.ru/wp-content/uploads/2026/04/achivement-3-768x1024.png 768w, https://suffer.curiosity-path.ru/wp-content/uploads/2026/04/achivement-3-225x300.png 225w, https://suffer.curiosity-path.ru/wp-content/uploads/2026/04/achivement-3.png 960w" sizes="auto, (max-width: 768px) 100vw, 768px" /></p>
                <p>Нормальное состояние стиральной машины — закрытое. Нормальное состояние холодильника — закрытое. Если в холодильнике торчит мама — это проблемы мамы, Лёвочка будет закрывать дверцу!</p>
                <p>Может страшно, до истерики кричать, если я ухожу из комнаты или папа уходит на работу. Видимо, за время нашей отлучки он запомнил, что предки могут пропасть долгосрочно.</p>
            `;
            const result = getCleanEntry(html);
            expect(result).toContain('<h3>Сентябрь 2025</h3>');
            expect(result).toContain('Любовь к машинам продолжается');
            expect(result).toContain('Лёвочка будет закрывать дверцу');
        });

        it('should handle the blog post excerpt from October 2025', () => {
            const html = `
                <h3>Октябрь 2025</h3>
                <p>Научился соединять детальки мягкого конструктора, однако предпочитает, чтобы это сделал кто-то за него.</p>
                <p>Тщательно выедает мякоть яблока из кожуры, кожуру отдаёт мне, чтобы я её выбросила. Прочувствовал помидоры (летом не нравились), когда режу салат — требует: поднимает ручку, разворачивает ладошку вверх и жамкает ей, как Шансунг из киношного мортал-комбата.</p>
                <p><img loading="lazy" decoding="async" class="alignnone wp-image-685 size-large" src="https://suffer.curiosity-path.ru/wp-content/uploads/2026/04/achivement-4-768x1024.png" alt="" width="768" height="1024" srcset="https://suffer.curiosity-path.ru/wp-content/uploads/2026/04/achivement-4-768x1024.png 768w, https://suffer.curiosity-path.ru/wp-content/uploads/2026/04/achivement-4-225x300.png 225w, https://suffer.curiosity-path.ru/wp-content/uploads/2026/04/achivement-4.png 960w" sizes="auto, (max-width: 768px) 100vw, 768px" /></p>
                <p>Лексика: «ЭЭЭЭЭЭЭ!» — привлечение внимания (с возможным показыванием на предмет). «АЙЯЙАЙААААААААААААААА!» — требование дать еду побыстрее. «БУБУЭЭЭЭ» — что-то плохое/неприятное. Ещё есть МАМА-НЯ и БАБАБА. А вот с папой пока не очень.</p>
            `;
            const result = getCleanEntry(html);
            expect(result).toContain('<h3>Октябрь 2025</h3>');
            expect(result).toContain('мягкого конструктора');
            expect(result).toContain('как Шансунг из киношного мортал-комбата');
        });

        it('should handle the blog post excerpt from November 2025', () => {
            const html = `
                <h3>Ноябрь 2025</h3>
                <p>Стадия подражательная. Помогает убирать: несёт совок и метёлку. Запихивает вещи в стиральную машину, закрывает её (с моими руками внутри), открывает лоток, чтобы я налила туда средство для стирки.</p>
                <p><img loading="lazy" decoding="async" class="alignnone wp-image-687 size-large" src="https://suffer.curiosity-path.ru/wp-content/uploads/2026/04/achivement-6-768x1024.png" alt="" width="768" height="1024" srcset="https://suffer.curiosity-path.ru/wp-content/uploads/2026/04/achivement-6-768x1024.png 768w, https://suffer.curiosity-path.ru/wp-content/uploads/2026/04/achivement-6-225x300.png 225w, https://suffer.curiosity-path.ru/wp-content/uploads/2026/04/achivement-6.png 960w" sizes="auto, (max-width: 768px) 100vw, 768px" /></p>
                <p>В остальное время разносит вообще всё. Открывает дверцы кухонного шкафчика, вытряхивает оттуда посуду. Лезет на столы, стаскивает посуду, сушащуюся у раковины. Берёт губку, начинает мыть столешницу, потом стул, потом пол. На попытку поменять ему губку на половую тряпку разорался.</p>
                <p>Пытается выпасть в окно: залезает на подоконник и хватается за ручку в попытках открыть её. Требуется орать, чтобы он слез. Теперь нужно не только класть стулья в положение «лёжа», но и снимать оконную ручку.</p>
            `;
            const result = getCleanEntry(html);
            expect(result).toContain('<h3>Ноябрь 2025</h3>');
            expect(result).toContain('Стадия подражательная');
            expect(result).toContain('несёт совок и метёлку');
        });

        it('should handle the blog post excerpt from December 2025', () => {
            const html = `
                <h3>Декабрь — 2025</h3>
                <p>Живём в осадном положении. Нормальное состояние стульев — лежат напротив дверец кухонных шкафов, все электронные приборы залочены, стиральная машинка выдернута из розетки.</p>
                <p>Наконец-то в лексиконе появился ПА-ПАТЬ. И НЯ-НА (Нина, стало быть). Ещё бабушка научила говорить, как мычит корова — Му-му-му, а Нина — ко-ко-ко,</p>
                <p>Любимая книга — Заюшкина избушка. Мы с бабушкой уже не можем на неё смотреть, поэтому прячем.</p>
                <p>Теперь у меня появилось новое погоняло — МИ-МИ (звук средний между «и» и «ы»).</p>
                <p>Но продолжает звать МАМА-НЯ ночью, неугасимо.</p>
            `;
            const result = getCleanEntry(html);
            expect(result).toContain('<h3>Декабрь — 2025</h3>');
            expect(result).toContain('Живём в осадном положении');
            expect(result).toContain('ПА-ПАТЬ');
            expect(result).toContain('Заюшкина избушка');
        });

        it('should handle the blog post excerpt from January 2026', () => {
            const html = `
                <h3>Январь 2026</h3>
                <p>В сынце всё больше проявляется вредность и упрямство. Если ему что-то не хочется &#8212; орёт, сучит ногами, повисает на руках, вырывается из объятий.</p>
                <p>С большой радостью ходит гулять, даже в лютые морозы.</p>
                <p>Иногда ходит гулять по коридору в подъезде. Бегает туда-сюда, а я, как правило, иду следом и играю на пандейру.</p>
                <p>Горшок непреодолим: при попытке усадить &#8212; Лёвочка начинает орать.</p>
                <p>Без тапок (домашних) уже старается не ходить. Старые порвались &#8212; купили новые, ходит в них, жутко шаркая ногами.</p>
            `;
            const result = getCleanEntry(html);
            expect(result).toContain('<h3>Январь 2026</h3>');
            expect(result).toContain('вредность и упрямство');
            expect(result).toContain('играю на пандейру');
        });

        it('should handle the blog post excerpt from February 2026', () => {
            const html = `
                <h3>Февраль 2026</h3>
                <p>Смотрит на папу и теперь знает, что чтобы маму разбудить, когда она спит &#8212; надо поцеловать её в губы.</p>
                <p>Разломал пополам блокиратор у ящика, где лежат его игрушки: паззлы и карточки со звуками, частым дёрганьем.</p>
                <p>Повинуясь порыву, решила показать ему видео с пожарной машиной и её звучанием, потому что машины продолжают быть ван лав. В результате четыре с половиной минуты смотрела на разные пожарные машины, потому что попытка выключить видео вела к скандалу.</p>
                <p>Утром принёс в комнату кухонный таймер в виде баклажана, включил его и ушёл заниматься своими делами. А я слушала противное тиканье и гадала, когда устройство заорёт, потому что кошка не позволяла дотянуться до него.</p>
            `;
            const result = getCleanEntry(html);
            expect(result).toContain('<h3>Февраль 2026</h3>');
            expect(result).toContain('поцеловать её в губы');
            expect(result).toContain('блокиратор у ящика');
            expect(result).toContain('кухонный таймер в виде баклажана');
        });

        it('should handle the blog post excerpt from March 2026', () => {
            const html = `
                <h3>Март 2026</h3>
                <p>Стал на редкость плаксивым и истеричным, но остался таким же любимым.</p>
                <p>Бьёт посуду в огромных количествах.</p>
                <p>С радостью выполняет команду &#171;Позови Нину ужинать&#187; &#8212; шествует за сестрицей и притаскивает её за руку на кухню.</p>
                <p>Лексикон расширяется дальше, в основном на транспортные средства. КАТЮК &#8212; каток, КАНН &#8212; подъёмный кран, БУДЮМ &#8212; бульдозер.</p>
                <p>Помногу и с охотой  пытается повторять слова за нами.</p>
                <p>Любит гулять с бабушкой по стилобату. Может пройти ногами довольно далеко.</p>
                <p>Прошёл до памятника Чкалову и обратно &#8212; а это, на минуточку, два с половиной километра.</p>
            `;
            const result = getCleanEntry(html);
            expect(result).toContain('<h3>Март 2026</h3>');
            expect(result).toContain('плаксивым и истеричным');
            expect(result).toContain('КАТЮК');
            expect(result).toContain('КАНН');
            expect(result).toContain('БУДЮМ');
            expect(result).toContain('памятника Чкалову');
        });
    });

    describe('createExcerpt', () => {
        it('should return full content if within maxLength', () => {
            const html = '<p>Short text</p>';
            const result = createExcerpt(html, 1200);
            expect(result).toBe('<p>Short text</p>');
        });

        it('should truncate content if exceeds maxLength', () => {
            const longText = '<p>' + 'a'.repeat(1500) + '</p>';
            const result = createExcerpt(longText, 1200);
            expect(result.length).toBeLessThanOrEqual(1200 + 7); // +7 for <p>...</p>
            expect(result).toContain('...');
            expect(result).toMatch(/^<p>/);
        });

        it('should handle HTML tags when truncating', () => {
            const html = '<h1>Title</h1><p>' + 'b'.repeat(1500) + '</p>';
            const result = createExcerpt(html, 1200);
            expect(result).toContain('...');
        });

        it('should use default maxLength of 1200', () => {
            const longText = '<p>' + 'c'.repeat(1500) + '</p>';
            const result = createExcerpt(longText);
            expect(result.length).toBeLessThanOrEqual(1207);
        });

        it('should handle empty input', () => {
            expect(createExcerpt('', 100)).toBe('');
        });
    });

    describe('processAllHTML', () => {
        it('should remove empty paragraphs', () => {
            const html = '<p>Valid</p><p>&nbsp;</p><p>   </p>';
            const result = processAllHTML(html);
            expect(result).toContain('Valid');
            expect(result).not.toMatch(/<p>\s*<\/p>/);
        });

        it('should wrap lonely images', () => {
            const html = '<img src="test.jpg" class="aligncenter" />';
            const result = processAllHTML(html);
            expect(result).toContain('lonely-image__wrapper');
        });

        it('should not process images inside figures', () => {
            const html = '<figure><img src="test.jpg" /></figure>';
            const result = processAllHTML(html);
            expect(result).not.toContain('lonely-image__wrapper');
        });

        it('should handle server-side rendering gracefully', () => {
            const originalDOMParser = global.DOMParser;
            // @ts-expect-error - testing server-side scenario
            global.DOMParser = undefined;

            const html = '<p>Test</p>';
            const result = processAllHTML(html);
            expect(result).toBe('<p>Test</p>');

            global.DOMParser = originalDOMParser;
        });
    });
});
