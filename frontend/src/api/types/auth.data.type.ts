import { User } from '../../context/UserContext';

export interface LoginInfo {
  email: string;
  password: string;
}

export interface JoinInfo {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserInfo extends User {
  token: string;
}
