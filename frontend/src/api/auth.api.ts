import { validateJoinInfo, validateLoginInfo, validateLoginUserInfo, validateUserId } from '../validator/auth.validator';
import { commonValue } from './common.value';
import { JoinInfo, LoginInfo, LoginUserInfo } from './types/auth.data.type';
import { ErrorResponse, Response } from './types/common.data.type';

const PREFIX_URL = '/user';

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
  validateLoginInfo(loginInfo);
  
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

      if (!res.ok) throw new Error();
      return res.json();
    });

    return callback(LoginResponseAdaptor(result, token));
  } catch {
    callback({ data: null, errorMessage: '로그인 실패', success: false });
  }
}

export async function join(
  joinInfo: JoinInfo,
  callback: (data: Response<number> | ErrorResponse) => void,
) {
  validateJoinInfo(joinInfo);

  try {
    const result = await fetch(`${commonValue.ORIGIN}${PREFIX_URL}/join`, {
      method: 'POST',
      body: JSON.stringify({
        name: joinInfo.name,
        email: joinInfo.email,
        password: joinInfo.password,
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (!res.ok) throw new Error();
      return res.json();
    });

    validateUserId(result);
    return callback({ data: result, success: true });
  } catch {
    callback({ data: null, errorMessage: 'Failed to sign up', success: false });
  }
}

function LoginResponseAdaptor(res: LoginResponse, token: string): Response<LoginUserInfo> {
  const data = {
    token: token,
    id: res.id,
    name: res.name,
    email: res.email,
  };
  validateLoginUserInfo(data);

  return {
    data,
    success: true,
  };
}
