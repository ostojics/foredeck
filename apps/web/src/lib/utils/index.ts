const PUBLIC_PAGES = ['/login', '/register', '/onboarding'];

export const isPublicRoute = (path: string) => {
  return PUBLIC_PAGES.some((page) => path.startsWith(page));
};
