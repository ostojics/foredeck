export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000') as string;
export const MSW_ENABLED = Boolean(import.meta.env.VITE_ENABLE_MSW);
