import * as React from 'react';
import clsx from 'clsx';
import styles from './form-control.module.scss';

export interface FormControlProps extends React.ComponentProps<'div'> {
  error?: boolean;
}

export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({className, error, children, ...props}, ref) => {
    return (
      <div ref={ref} className={clsx(styles.root, error && styles['root--error'], className)} {...props}>
        {children}
      </div>
    );
  },
);
