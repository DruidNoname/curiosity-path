import React from "react";
import styles from './style.module.css';

export type HighlightPart = { text: string; match: boolean };

type Props = {
    /** Строка, заранее порезанная на куски «совпадение / не совпадение». */
    parts: HighlightPart[];
};

/**
 * Текст с подсвеченными кусками. Только текстовые узлы и `<mark>` —
 * без `dangerouslySetInnerHTML`, поэтому санитизация не нужна.
 */
const Highlight: React.FC<Props> = ({parts}) => (
    <>
        {parts.map((part, index) =>
            part.match
                ? <mark key={index} className={styles.Mark}>{part.text}</mark>
                : <React.Fragment key={index}>{part.text}</React.Fragment>
        )}
    </>
);

export default Highlight;
