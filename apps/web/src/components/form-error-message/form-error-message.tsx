import * as React from 'react';
import clsx from 'clsx';
import styles from './form-error-message.module.scss';

export const FormErrorMessage = React.forwardRef<HTMLParagraphElement, React.ComponentProps<'p'>>(
  ({className, ...props}, ref) => {
    return <p ref={ref} className={clsx(styles.errorMessage, className)} {...props} />;
  },
);
