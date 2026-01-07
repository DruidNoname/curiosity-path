import React from 'react';
import SkeletonLib, {SkeletonProps} from "@mui/material/Skeleton";

type Props = SkeletonProps;

const Skeleton: React.FC<Props> = (props) => {
  const {...skeletonProps} = props;

  return (
    <SkeletonLib
      {...skeletonProps}
    />
  );
};

export default Skeleton;
