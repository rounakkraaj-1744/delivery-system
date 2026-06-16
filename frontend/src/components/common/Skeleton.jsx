import React from 'react';
import { cn } from './Button';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-neutral-300/50', className)}
      {...props}
    />
  );
};
