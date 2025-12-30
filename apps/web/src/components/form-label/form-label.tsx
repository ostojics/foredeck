import * as React from 'react';
import clsx from 'clsx';
import styles from './form-label.module.scss';

export interface FormLabelProps extends React.ComponentProps<'label'> {
  required?: boolean;
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({className, required, children, ...props}, ref) => {
    return (
      <label ref={ref} className={clsx(styles.label, className)} {...props}>
        {children}
        {required && <span className={styles['label__asterisk']}>*</span>}
      </label>
    );
  },
);
