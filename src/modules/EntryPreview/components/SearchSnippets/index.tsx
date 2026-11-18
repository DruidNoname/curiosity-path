import React from "react";
import {Typography} from "@mui/material";
import Highlight from "@/ui/Highlight";
import {SnippetsResult} from "@/helpers/search-snippets";
import styles from './style.module.css';

type Props = SnippetsResult;

const RU_PLURAL = new Intl.PluralRules('ru');
// Считаются предложения с совпадениями, а не сами совпадения — отсюда «места».
const PLACE_WORDS: Record<string, string> = {one: 'место', few: 'места', many: 'мест', other: 'места'};

/** Фрагменты записи с найденными словами, через многоточие — как в выдаче поисковика. */
export const SearchSnippets: React.FC<Props> = ({snippets, rest}) => (
    <Typography variant="body1" component="p" className={styles.Snippets}>
        {snippets.map((snippet, index) => (
            <React.Fragment key={index}>
                {/* Обрезанное предложение уже начинается с «…» — второе многоточие не нужно. */}
                {index > 0 && (snippet[0]?.text.startsWith('…')
                    ? ' '
                    : <span className={styles.Separator}> … </span>)}
                <Highlight parts={snippet} />
            </React.Fragment>
        ))}
        {rest > 0 && <span className={styles.Rest}> … и ещё {rest} {PLACE_WORDS[RU_PLURAL.select(rest)]} в записи</span>}
    </Typography>
);
