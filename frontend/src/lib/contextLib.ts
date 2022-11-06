import { useContext, createContext } from 'react';

interface AppContextValue {
  isAuthenticated: boolean;
  userHasAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext() {
  return useContext(AppContext)!;
}
