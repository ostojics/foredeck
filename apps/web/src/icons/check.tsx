import {SVGProps} from 'react';

export const Check = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12" {...props}>
      <path
        stroke={props.fill ?? '#fff'}
        d="M10 3 4.5 8.5 2 6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};
