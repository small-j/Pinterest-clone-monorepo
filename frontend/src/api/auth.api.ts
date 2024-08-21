import { commonValue } from './common.value';
import { LoginUserInfo } from './types/auth.data.type';
import { ErrorResponse, Response } from './types/common.data.type';

const PREFIX_URL = '/user';

interface LoginInfo {
  email: string;
  password: string;
}

interface JoinInfo {
  name: string;
  email: string;
  password: string;
}

interface LoginResponse {
  id: number;
  name: string;
  email: string;
}

export async function login(
  loginInfo: LoginInfo,
  callback: (data: Response<LoginUserInfo> | ErrorResponse) => void,
) {
  let token = '';

  try {
    const result = await fetch(`${commonValue.ORIGIN}${PREFIX_URL}/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: loginInfo.email,
        password: loginInfo.password,
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (!res.headers.get(commonValue.TOKEN_HEADER)) throw new Error();
      token = res.headers.get(
        commonValue.TOKEN_HEADER,
      ) as string;

      return res.json();
    });

    return callback(LoginResponseAdaptor(result, token));
  } catch {
    callback({ data: null, errorMessage: '로그인 실패', success: false });
  }
}

function LoginResponseAdaptor(res: LoginResponse, token: string): Response<LoginUserInfo> {
  return {
    data: {
      token: token,
      id: res.id,
      name: res.name,
      email: res.email,
    },
    success: true,
  };
}

export async function join(
  joinInfo: JoinInfo,
  callback: (data: Response<string> | ErrorResponse) => void,
) {
  try {
    const result = await fetch(`${commonValue.ORIGIN}${PREFIX_URL}/join`, {
      method: 'POST',
      body: JSON.stringify({
        name: joinInfo.name,
        email: joinInfo.email,
        password: joinInfo.password,
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json());

    return callback({ data: result, success: true });
  } catch {
    callback({ data: null, errorMessage: 'Failed to sign up', success: false });
  }
}
