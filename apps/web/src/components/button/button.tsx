import * as React from 'react';
import {Button as BaseButton, ButtonProps as BaseButtonProps} from '@base-ui/react/button';
import clsx from 'clsx';
import styles from './button.module.scss';

export interface ButtonProps extends Omit<BaseButtonProps, 'className'> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'secondary-color'
    | 'tertiary'
    | 'tertiary-color'
    | 'primary-error'
    | 'secondary-error'
    | 'tertiary-error'
    | 'link-color'
    | 'link-gray';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant = 'primary', size = 'md', disabled, children, ...props}, ref) => {
    return (
      <BaseButton
        ref={ref}
        className={clsx(
          styles.button,
          styles[`button--variant-${variant}` as keyof typeof styles],
          styles[`button--size-${size}` as keyof typeof styles],
          className,
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </BaseButton>
    );
  },
);

Button.displayName = 'Button';

export default Button;
