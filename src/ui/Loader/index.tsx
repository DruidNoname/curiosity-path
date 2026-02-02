import React from 'react';
import styles from './style.module.css';
import Backdrop from '@mui/material/Backdrop';
import Image from 'next/image';
import loaderImage from '@/assets/images/loader.svg';
import LinearProgress from '@mui/material/LinearProgress';
import { OverridableStringUnion } from '@mui/types';

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
                <Image
                    src={loaderImage}
                    alt="Loading"
                    className={'RadialLoader'}
                />
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
                  <Image
                      src={loaderImage}
                      alt="Loading"
                      className={'RadialLoader'}
                  />
            </div>
        );
    }
  };


  return (
      getLoader()
  );
};

export default Loader;
