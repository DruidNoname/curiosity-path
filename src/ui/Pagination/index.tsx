import React from 'react';
import PaginationMUI, {PaginationProps} from "@mui/material/Pagination";
import styles from './style.module.css';

type Props = PaginationProps & {

};

const Pagination: React.FC<Props> = (props) => {
  const {className, ...paginationProps} = props;

  const cls = [
    styles.Pagination,
    className,
  ];

  return (
    <PaginationMUI
      shape={'rounded'}
      color={'primary'}
      {...paginationProps}
      className={cls.join(' ')}
    />
  );
};

export default Pagination;
