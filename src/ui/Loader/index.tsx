import React, { useState, useSyncExternalStore } from 'react';
import styles from './style.module.css';
import Backdrop from '@mui/material/Backdrop';
import LinearProgress from '@mui/material/LinearProgress';
import { OverridableStringUnion } from '@mui/types';
import { LoaderVariant, pickLoaderVariant } from './variants';
import Atom from './Atom';
import Bicycle from './Bicycle';
import Crutches from './Crutches';

type Props = {
  className?: string;
  style?: React.CSSProperties;
  size?: number | string;
  display?: 'inline';
  margin?: string;
  isLinear?: boolean;
  isDots?: boolean;
  smallSize?: number;
  backdropMode?: boolean;
  color?: OverridableStringUnion<'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit'>;
};

// Все три — inline-svg: картинка приходит вместе с разметкой, без отдельного запроса.
// Анимацию каждый задаёт своим css-модулем
const VARIANTS: Record<LoaderVariant, () => React.ReactNode> = {
  atom: () => <Atom className={styles.Image}/>,
  bicycle: () => <Bicycle className={styles.Image}/>,
  crutch: () => <Crutches className={styles.Image}/>,
};

const subscribeNever = () => () => {};

const LoaderImage: React.FC = () => {
  // Math.random() дал бы на сервере и на клиенте разные картинки и ошибку гидратации.
  // useSyncExternalStore на гидратации отдаёт серверный снимок (false) — рисуем заглушку,
  // а при клиентском переходе сразу клиентский (true), так что пустого кадра нет
  const isClient = useSyncExternalStore(subscribeNever, () => true, () => false);
  const [variant] = useState<LoaderVariant>(() => pickLoaderVariant());

  if (!isClient) {
    return <span className={styles.Placeholder}/>;
  }

  return VARIANTS[variant]();
};

const Loader: React.FC<Props> = ({className, size = 40, display, isLinear, backdropMode, color, margin, style, smallSize, isDots}) => {

  const classes = [
    styles.Loader,
    smallSize ? styles.LoaderSmall : '',
    className,
  ];

  const getLoader = () => {
    switch (true) {
      case backdropMode:
        return (
            <Backdrop open={backdropMode} className={styles.Backdrop}>
              <div className={classes.join(' ')} style={{display, ...style}}>
                <LoaderImage/>
              </div>
            </Backdrop>
        );

      case isDots:
        return <span className={styles.Dotsloader}>
          <span className={styles.Dot}>.</span>
          <span className={styles.Dot}>.</span>
          <span className={styles.Dot}>.</span>
        </span>;

      case isLinear:
        return <LinearProgress color={color}/>;

      default:
        return (
            <div className={classes.join(' ')} style={{
              display,
              margin: smallSize ? margin || '0' : margin,
              ...style
            }}>
              <LoaderImage/>
            </div>
        );
    }
  };


  return (
      getLoader()
  );
};

export default Loader;
