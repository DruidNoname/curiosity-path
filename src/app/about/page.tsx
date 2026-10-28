'use client';

import React, {useEffect, useState} from "react";
import styles from './style.module.css';
import { differenceInYears } from 'date-fns';
import {Box, Divider, Link} from "@mui/material";
import {ImageBordered} from "@/components/Images";
import Title from "@/components/Title";
import {yearsWord} from "./utils";

const BIRTH_DATE = new Date('1987-02-20');
const WORK_START_DATE = new Date('2019-02-13');

const About: React.FC = () => {
    // Страница статическая: HTML собирается один раз при деплое. Посчитанные в рендере возраст
    // и стаж застывали бы на дату сборки и расходились с пересчётом в браузере — рассинхрон
    // гидрации после каждого дня рождения. Поэтому считаем только на клиенте, после гидрации.
    const [years, setYears] = useState<{ age: number; experience: number } | null>(null);

    useEffect(() => {
        const now = new Date();
        // Второй проход рендера намеренный: значение зависит от «сейчас» в браузере и на сервере
        // существовать не может. Лишний рендер один, при монтировании.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setYears({
            age: differenceInYears(now, BIRTH_DATE),
            experience: differenceInYears(now, WORK_START_DATE),
        });
    }, []);

    return(
        <Box sx={{px: '24px'}}>
            <Title title={ 'О проекте и об авторе' } variant={"h2"} subtitle={'Coffee. Coding. Capoeira.'}/>
            <Box>
                <p>...а можно&nbsp;ж я&nbsp;напишу вот это вот всё не&nbsp;в&nbsp;косорукой админке headless-системы, а&nbsp;в&nbsp;родной, уютной IDEшечке, да?</p>
                <p> Вот так хорошо. Полный контроль. Спасибо.</p>
            </Box>
            <Divider sx={{ marginTop: '16px', marginBottom: '24px',  }} />
            <Box>
                <ImageBordered src={'https://suffer.curiosity-path.ru/wp-content/uploads/2026/02/photo_2026-02-26_23-04-36.jpg'} title={'Фото автора'} classNameWrapper={styles.MyPortret}/>
                <p><i>Привет, меня зовут Оля, {years && <>мне {years.age} {yearsWord(years.age)},{' '}</>}я&nbsp;веб-разработчик{years && <> с&nbsp;{years.experience}-летним стажем</>}. Заархивированная тётенька в&nbsp;купальнике на&nbsp;фоне моря&nbsp;&mdash; это&nbsp;я. Поговаривают, что тётеньками в&nbsp;купальниках хорошо рекламируется что угодно, даже блог. Вот и&nbsp;попробуем.</i></p>
                <p>Этот микропроект создан, продуман и&nbsp;написан лично мной на&nbsp;<b>React&nbsp;19</b> и&nbsp;<b>Next.js&nbsp;16</b> на&nbsp;<b>TypeScript</b>. Интерфейс&nbsp;&mdash; на&nbsp;<b>MUI</b>, данные ходят через <b>TanStack Query</b> из&nbsp;REST API WordPress (и&nbsp;чуть-чуть через GraphQL), а&nbsp;всё, что приходит из&nbsp;WordPress, проходит через собственную санитизацию. Есть тесты на&nbsp;<b>Jest</b> и&nbsp;<b>Testing Library</b>, а&nbsp;звук в&nbsp;<Link href={'/breather'}>«Бризере»</Link> синтезируется прямо в&nbsp;браузере через <b>Web Audio API</b>. Клиентская часть лежит на&nbsp;next-овской&nbsp;же облачной платформе <b>Vercel</b>. Серверная&nbsp;&mdash; собрана из&nbsp;дипсика и&nbsp;палок на&nbsp;headless-WordPress.</p>
                <p>Кроме <b>постов блога</b> здесь живут <b>несколько инструментов разной степени нужности</b> и&nbsp;упоротости: <Link href={'/recipes'}>справочник рецептов</Link> с&nbsp;расчётом граммовки ингредиентов и&nbsp;<Link href={'/capoeira-songs'}>песенник капоэйры</Link>. На&nbsp;<Link href={'/test-subject'}>странице dev-экспериментов</Link> можно посмотреть, над чем я&nbsp;работаю в&nbsp;данный момент. Или не&nbsp;работаю, если выдохлась. Сейчас там <Link href={'/breather'}>«Бризер»</Link>&nbsp;&mdash; дыхательный метроном (созданный, вообще-то, для упражнений ЛФК).</p>
                <p>Хотя <b><i>программирование</i></b>&nbsp;&mdash; моя любимая до&nbsp;одержимости профессия, проект этот в&nbsp;первую очередь про тексты. Тексты&nbsp;&mdash; о&nbsp;мире вокруг меня на&nbsp;расстоянии разной длины радиусов. Потому что жизнь&nbsp;&mdash; любая жизнь, в&nbsp;том числе и&nbsp;моя&nbsp;&mdash; слишком яркая и&nbsp;интересная штука, чтобы её&nbsp;забывать.</p>
                <p>Помимо программирования я&nbsp;увлекаюсь:
                    <br/> &mdash;&nbsp;<Link href={'/tag/kapoejira'}><b><i>капоэйрой</i></b></Link> (это такое бразильское боевое искусство с&nbsp;музыкальной составляющей);
                    <br/> &mdash;&nbsp;<Link href={'/tag/istoricheskaya-rekonstrukcziya'}><b><i>исторической реконструкцией</i></b></Link> (это когда делают вид, что живут&nbsp;X веков назад);
                    <br/> &mdash;&nbsp;<Link href={'/tag/gusevskie-marshruty'}><b><i>бегом по&nbsp;пересечённой местности</i></b></Link> или хотя&nbsp;бы по&nbsp;природе&nbsp;&mdash; в&nbsp;небольших дозах;
                    <br/> &mdash;&nbsp;<Link href={'/tag/puteshestviya'}><b><i>путешествиями</i></b></Link>&nbsp;&mdash; от&nbsp;классических архитектурных до экстремальных природных.
                </p>
                <p>Обо всём этом я&nbsp;пишу. Также пишу о&nbsp;себе, <Link href={'/tag/subektivno'}><b>своей сиюминутной жизни</b></Link> и&nbsp;двух самых больших любовях&nbsp;&mdash; <b>семье и&nbsp;лесе</b> (как истинно лесная женщина, счастливее всего чувствую себя в&nbsp;лесу в&nbsp;обнимку с&nbsp;плеером и&nbsp;лукошком для грибов или ягод). Ещё&nbsp;&mdash; <Link href={'/tag/lyudishki'}>о&nbsp;людях</Link>, с&nbsp;которыми случается встретиться&nbsp;&mdash; ярких, нарядных и&nbsp;по-разному впечатляющих.</p>
                <p>Пишу уже много лет&nbsp;&mdash; посты с&nbsp;2011-го года сейчас в&nbsp;стадии переезда. Иногда&nbsp;&mdash; изящно, порой&nbsp;&mdash; сложно, временами&nbsp;&mdash; сумбурно, захлёбываясь эмоциями, иногда&nbsp;&mdash; глухо и&nbsp;опустошённо. Часто&nbsp;&mdash; иронично и&nbsp;насмешливо, порой&nbsp;&mdash; до&nbsp;горечи. Очень часто&nbsp;&mdash; о&nbsp;себе&nbsp;&mdash; с&nbsp;самоиронией, граничащей с&nbsp;самоуничижением (ничего личного, только посмеяться). Но&nbsp;люди, которые меня читают, привыкли, и&nbsp;им&nbsp;даже нравится.</p>
                <p>По молодости я, конечно, рассчитывала стать минимум лауреатом нобелевки по литературе. Но со временем поняла, что <i>наблюдать</i> и <i>рассказывать</i> интереснее, чем <i>пытаться что-то донести</i>.</p>
               <p>Так что пока потворим здесь. Планируется вполне себе уютненькое болото. Присаживайтесь, располагайтесь... Кофейку?</p>
               <p>PS: Бонус: <Link href={'/loaders-demo'}>все три лоадера на&nbsp;одной странице</Link>.</p>
            </Box>
        </Box>
    );
};

export default About;