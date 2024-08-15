import { commonValue } from "./common.value";
import { ErrorResponse, Response } from "./types/common.data.type";

const PREFIX_URL = "/user"

interface LoginInfo {
    email: string;
    password: string;
}

export async function login(loginInfo: LoginInfo, callback: (data: Response<string> | ErrorResponse) => void) {
    try {
        const result = await fetch(`${commonValue.ORIGIN}${PREFIX_URL}/login`, {
            method: 'POST',
            body: JSON.stringify({
                email: loginInfo.email,
                password: loginInfo.password,
            }),
            headers: { 'Content-Type': 'application/json' }
        }).then(res =>{
            if (!res.headers.get(commonValue.TOKEN_HEADER)) throw new Error();
            commonValue.ACCESS_TOKEN = res.headers.get(commonValue.TOKEN_HEADER) as string;

            return res.json();
        });

        return callback({ data: result,  success: true });
    } catch {
        callback({ data: null, errorMessage: "로그인 실패", success: false });
    }
}