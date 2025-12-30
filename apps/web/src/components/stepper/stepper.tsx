import * as React from 'react';
import clsx from 'clsx';
import styles from './stepper.module.scss';
import {Check} from '@/icons/check';

export interface Step {
  title: string;
  description?: string;
}

export interface StepperProps extends React.ComponentProps<'div'> {
  steps: Step[];
  currentStep: number;
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({className, steps, currentStep, ...props}, ref) => {
    return (
      <div ref={ref} className={clsx(styles.stepper, className)} {...props}>
        {steps.map((step, index) => {
          const activeStepIndex = currentStep - 1;
          const isCompleted = index < activeStepIndex;
          const isActive = index === activeStepIndex;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.title} className={styles['stepper__step']}>
              <div className={styles['stepper__container']}>
                <div
                  className={clsx(
                    styles['stepper__icon'],
                    isActive && styles['stepper__icon--active'],
                    isCompleted && styles['stepper__icon--completed'],
                  )}
                >
                  {isCompleted ? <Check /> : <span>{index + 1}</span>}
                </div>
                <div className={styles['stepper__content']}>
                  <span
                    className={clsx(
                      styles['stepper__title'],
                      isActive && styles['stepper__title--active'],
                      isCompleted && styles['stepper__title--completed'],
                    )}
                  >
                    {step.title}
                  </span>
                  {step.description && <span className={styles['stepper__description']}>{step.description}</span>}
                </div>
              </div>
              {!isLast && (
                <div className={clsx(styles['stepper__line'], isCompleted && styles['stepper__line--completed'])} />
              )}
            </div>
          );
        })}
      </div>
    );
  },
);
