/// <reference types="vite/client" />

// SCSS module type declarations
declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.scss' {
  const content: string;
  export default content;
}
