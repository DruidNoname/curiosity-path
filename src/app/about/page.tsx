'use client';

import React from "react";
import styles from './style.module.css';
import { differenceInYears } from 'date-fns';
import {Box, Divider, Link, Typography} from "@mui/material";
import {ImageBordered} from "@/components/Images";
import SingleEntryTitle from "@/components/SingleEntry/SingleEntryTitle";

const About: React.FC = () => {
    const birthDate = new Date('1987-02-20');
    const workDate = new Date('2019-02-13');
    const currentDate = new Date();

    const age = differenceInYears(currentDate, birthDate);
    const experience = differenceInYears(currentDate, workDate);
    return(
        <Box sx={{px: '24px'}}>
            <SingleEntryTitle title={ 'О проекте и об авторе' } variant={"h2"} subtitle={'Coffee. Coding. Capoeira.'}/>
            <Box>
                <p>...а можно&nbsp;ж я&nbsp;напишу вот это вот всё не&nbsp;в&nbsp;косорукой админке headless-системы, а&nbsp;в&nbsp;родной, уютной IDEшечке, да?</p>
                <p> Вот так хорошо. Полный контроль. Спасибо.</p>
            </Box>
            <Divider sx={{ marginTop: '16px', marginBottom: '24px',  }} />
            <Box>
                <ImageBordered src={'/images/ya.jpg'} title={'Фото автора'} classNameWrapper={styles.MyPortret}/>
                <p><i>Привет, меня зовут Оля, мне {age} годиков, я&nbsp;веб-разработчик c&nbsp;{experience}-летним стажем. Заархивированная тётенька в&nbsp;купальнике на&nbsp;фоне моря&nbsp;&mdash; это&nbsp;я. Поговаривают, что тётеньками в&nbsp;купальниках хорошо рекламируется что угодно, даже блог. Вот и&nbsp;попробуем.</i></p>
                <p>Этот микропроект создан, продуман и&nbsp;написан лично мной с&nbsp;помощью <b>React</b> и&nbsp;<b>Next.js</b> на&nbsp;<b>Typescript</b>. Клиентская часть лежит на&nbsp;next-овской&nbsp;же облачной платформе vercel. Серверная - собрана из дипсика и палок на headless-wordpress.</p>
                <p>Кроме <b>постов блога</b> здесь планируется размещение <b>нескольких инструментов разной степени нужности</b> и&nbsp;упоротости. На&nbsp;странице dev-экспериментов можно посмотреть, над чем я&nbsp;работаю в&nbsp;данный момент. Bли не&nbsp;работаю, если выдохлась. Пока собирается справочник рецептов с&nbsp;расчётом граммовки ингредиентов.</p>
                <p>Хотя <b><i>программирование</i></b>&nbsp;&mdash; моя любимая до&nbsp;одержимости профессия, проект этот в&nbsp;первую очередь про тексты. Тексты&nbsp;&mdash; о&nbsp;мире вокруг меня на&nbsp;расстоянии разной длины радиусов. Потому, что жизнь&nbsp;&mdash; любая жизнь, в&nbsp;том числе и&nbsp;моя&nbsp;&mdash; слишком яркая и&nbsp;интересная штука, чтобы её&nbsp;забывать.</p>
                <p>Помимо программирования я&nbsp;увлекаюсь
                    <br/> &mdash;&nbsp;<Link component={'a'} href={'/tag/kapoejira'}><b><i>капоэйрой</i></b></Link> (это такое бразильское боевое искусство с&nbsp;музыкальной составляющей);
                    <br/> &mdash;&nbsp;<Link component={'a'} href={'/tag/tag/istoricheskaya-rekonstrukcziya'}><b><i>исторической реконструкцией</i></b></Link> (это когда делают вид, что живут&nbsp;X веков назад);
                    <br/> &mdash;&nbsp;<Link component={'a'} href={'/tag/gusevskie-marshruty'}><b><i>бегом по&nbsp;пересеченной местности</i></b></Link> или хотя&nbsp;бы по&nbsp;природе&nbsp;&mdash; в&nbsp;небольших дозах;
                    <br/> &mdash;&nbsp;<Link component={'a'} href={'/tag/puteshestviya'}><b><i>путешествиями</i></b></Link> - от классических архитектурных до экстремальных природных.
                </p>
                <p>Обо всём этом я&nbsp;пишу. Также пишу о&nbsp;себе, <Link component={'a'} href={'/tag/subektivno'}><b>своей сиюминутной жизни</b></Link> и&nbsp;двух самых больших любовях&nbsp;&mdash; <b>семье и&nbsp;лесе</b> (как истинно лесная женщина, счастливее всего чувствую себя в&nbsp;лесу в&nbsp;обнимку с&nbsp;плеером и&nbsp;лукошком для грибов или ягод). Ещё&nbsp;&mdash; <Link component={'a'} href={'/tag/lyudishki'}>о&nbsp;людях</Link>, с&nbsp;которыми случается встретиться&nbsp;&mdash; ярких, нарядных и&nbsp;по-разному впечатляющих.</p>
                <p>Пишу уже много лет - посты с 2011го года сейчас в стадии переезда. Иногда&nbsp;&mdash; изящно, порой&nbsp;&mdash; сложно, временами&nbsp;&mdash; сумбурно, захлёбываясь эмоциями, иногда&nbsp;&mdash; глухо и&nbsp;опустошённо. Часто&nbsp;&mdash; иронично и&nbsp;насмешливо, порой&nbsp;&mdash; до&nbsp;горечи. Очень часто&nbsp;&mdash; о&nbsp;себе&nbsp;&mdash; с&nbsp;самоиронией, граничащей с&nbsp;самоуничижением (ничего личного, только посмеяться). Но&nbsp;люди, которые меня читают, привыкли, и&nbsp;им&nbsp;даже нравится.</p>
                <p>По молодости я, конечно, рассчитывала стать минимум лауреатом нобелевки по литературе. Но со временем поняла, что <i>наблюдать</i> и <i>рассказывать</i> интереснее, чем <i>пытаться что-то донести</i>.</p>
               <p>Так что пока потворим здесь. Планируется вполне себе уютненькое болото. Присаживайтесь, располагайтесь... Кофейку?</p>
            </Box>
        </Box>
    );
};

export default About;