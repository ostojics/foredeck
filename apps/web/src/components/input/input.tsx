import * as React from 'react';
import {Input as BaseInput, InputProps as BaseInputProps} from '@base-ui/react/input';
import clsx from 'clsx';
import styles from './input.module.scss';

export interface InputProps extends Omit<BaseInputProps, 'size' | 'className'> {
  size?: 'sm' | 'md';
  error?: boolean;
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({className, size = 'md', error = false, ...props}, ref) => {
    const sizeClass = styles[`input--size-${size}` as keyof typeof styles];
    const errorClass = error ? styles['input--error'] : undefined;

    return (
      <BaseInput
        ref={ref}
        className={clsx(styles.input, sizeClass, errorClass, className)}
        aria-invalid={error}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export default Input;
