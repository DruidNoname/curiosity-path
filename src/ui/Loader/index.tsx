import React from 'react';
import styles from './style.module.css';
import Backdrop from '@mui/material/Backdrop';
import Image from 'next/image';
import loaderImage from '@/assets/images/loader.svg'
import LinearProgress from '@mui/material/LinearProgress';
import { OverridableStringUnion } from '@mui/types';

type Props = {
  className?: string;
  style?: React.CSSProperties;
  size?: number | string;
  display?: 'inline';
  margin?: string;
  isLinear?: boolean;
  smallSize?: number;
  backdropMode?: boolean;
  color?: OverridableStringUnion<'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit'>;
};

const Loader: React.FC<Props> = ({className, size = 40, display, isLinear, backdropMode, color, margin, style, smallSize}) => {

  const classes = [
    styles.Loader,
    smallSize ? styles.LoaderSmall : '',
    className,
  ];

  return (
    <>
      {backdropMode ? (
        <Backdrop open={backdropMode} className={styles.Backdrop}>
          <div className={classes.join(' ')} style={{display, ...style}}>
            <Image
                src={loaderImage}
                alt="Loading"
                className={'RadialLoader'}
            />
          </div>
        </Backdrop>
      ) : (
        <div className={classes.join(' ')} style={{display, margin: smallSize ? margin || '0' : margin, ...style}}>
          {isLinear ? (
            <LinearProgress color={color}/>
          ) : (
              <Image
                  src={loaderImage}
                  alt="Loading"
                  className={'RadialLoader'}
              />
          )}
        </div>
      )}
    </>
  );
};

export default Loader;
