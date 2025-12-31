import {authHandlers} from './auth-handlers';
import {onboardingHandlers} from './onboarding-handlers';

export const handlers = [...authHandlers, ...onboardingHandlers];
