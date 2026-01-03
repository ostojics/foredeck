import {createContext, ReactNode} from 'react';
import {useGetMe} from './hooks/use-get-me';
import type {MeResponseDTO} from '@acme/contracts';

export interface AuthContextType {
  user: MeResponseDTO | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({children}: AuthProviderProps) {
  const {data: user, isLoading, isError} = useGetMe();

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !isError,
    isLoading,
    isError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
