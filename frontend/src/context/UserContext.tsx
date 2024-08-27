import { createContext, ReactNode, useContext, useState } from 'react';
import { commonValue } from '../common.value';
import { LoginUserInfo } from '../api/types/auth.data.type';

interface Props {
  children: ReactNode;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserContextValue {
  user: User | null;
  login: (userData: LoginUserInfo) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: LoginUserInfo) => {
    setUser({ id: userData.id, name: userData.name, email: userData.email });
    commonValue.ACCESS_TOKEN = userData.token;
  };
  const logout = () => {
    setUser(null);
    commonValue.ACCESS_TOKEN = '';
    window.location.reload();
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function checkContextValidate(): boolean {
    const context = useContext(UserContext);
    if (!context || !context.user) { 
        // todo 로그인하라는 알림 띄우기
        throw new Error();
    }
    return true;
}
