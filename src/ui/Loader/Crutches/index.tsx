import React, { useId } from 'react';
import styles from './style.module.css';

type Props = {
  className?: string;
};

// svg встроен в разметку, а не подключён через <img>: так наклон и сдвиг костылей
// задаются css-модулем. Цвет — часть рисунка и остаётся в самом svg
const Crutches: React.FC<Props> = ({ className }) => {
  // На странице может оказаться несколько лоадеров — id у <defs> должен быть уникальным,
  // иначе <use> сошлётся на чужой костыль
  const crutchId = useId();

  return (
      <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="5 -1 68 48"
          fill="none"
          role="img"
          aria-label="Loading"
          className={[styles.Crutches, className].join(' ')}
      >
        <defs>
          <g id={crutchId} stroke="#2d7a9c" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            {/* Верхняя подмышечная опора */}
            <path d="M16.8 5.5H31.2V8.1C31.2 9.1 30.4 9.9 29.4 9.9H18.6C17.6 9.9 16.8 9.1 16.8 8.1V5.5Z"/>
            {/* Основная стойка и нижний наконечник */}
            <path d="M19.1 9.9C19.3 14.3 19.7 18.6 20.2 22.7C20.4 24.5 21.6 26.1 22.4 27.4C22.8 28.1 23 28.7 23 29.4V40.2"/>
            <path d="M28.9 9.9C28.7 14.3 28.3 18.6 27.8 22.7C27.6 24.5 26.4 26.1 25.6 27.4C25.2 28.1 25 28.7 25 29.4V40.2"/>
            <path d="M23 29.4H25"/>
            <path d="M23 40.2H25"/>
            <path fill="#6ca2ba" d="M22.3 41.2C22.6 40.9 23.2 40.7 24 40.7C24.8 40.7 25.4 40.9 25.7 41.2L26 42.5C26.1 42.9 25.9 43.2 25.5 43.4C25 43.6 24.5 43.8 24 43.8C23.5 43.8 23 43.6 22.5 43.4C22.1 43.2 21.9 42.9 22 42.5L22.3 41.2Z"/>
            {/* Центральная рукоятка */}
            <path d="M18.9 14.8H29.1"/>
            <path d="M19.5 14.8V16.2C19.5 16.8 20 17.3 20.6 17.3H27.4C28 17.3 28.5 16.8 28.5 16.2V14.8"/>
          </g>
        </defs>

        <use href={`#${crutchId}`} className={`${styles.Crutch} ${styles.CrutchLeft}`}/>
        <use href={`#${crutchId}`} className={`${styles.Crutch} ${styles.CrutchRight}`}/>
      </svg>
  );
};

export default Crutches;
