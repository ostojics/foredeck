const PUBLIC_PAGES = ['/login', '/onboarding'];

export const isPublicRoute = (path: string) => {
  return PUBLIC_PAGES.some((page) => path.startsWith(page));
};
