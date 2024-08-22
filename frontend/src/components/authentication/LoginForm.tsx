import { FieldValues, useForm } from 'react-hook-form';
import { Label } from '../shadcn/ui/label';
import { Input } from '../shadcn/ui/input';
import { Button } from '../shadcn/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { ErrorResponse, Response } from '../../api/types/common.data.type';
import { login } from '../../api/auth.api';
import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { LoginUserInfo } from '../../api/types/auth.data.type';
import { Card, CardContent, CardFooter, CardHeader } from '../shadcn/ui/card';
import { getValidStateLoginInfo } from '../../validator/auth.validator';

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const navigate = useNavigate();
  const [isFailed, setIsFailed] = useState(false);
  const context = useContext(UserContext);
  const location = useLocation();

  const validateWithAjv = (data: FieldValues) => {
    const [validate, valid] = getValidStateLoginInfo({ email: data.email, password: data.password });

    if (!valid) {
      validate.errors?.forEach((error) => {
        if (error.instancePath === '/email') {
          setError('email', {
            type: 'manual',
            message: '잘못된 이메일 주소입니다.',
          });
        }
        else {
          setIsFailed(true);
        }
      });
      return false;
    }
    return true;
  };

  const getRedirectPath = () => {
    let arr = location.search.split('&');
    arr = arr.filter((param) => param.includes('redirect'));
    if (arr.length === 0) return '/';
    return arr[0].split('=')[1];
  };

  const requestLogin = (data: FieldValues) => {
    if (!validateWithAjv(data)) return;

    login(
      { email: data.email, password: data.password },
      (res: Response<LoginUserInfo> | ErrorResponse) => {
        if (res?.success && res.data && context) {
          context.login(res.data);
          navigate(getRedirectPath());
        } else setIsFailed(true);
      },
    );
  };

  const toJoinPage = () => {
    navigate('/join');
  };

  return (
    <Card className='w-full'>
      <form
        className="flex flex-col items-center w-full"
        onSubmit={handleSubmit((data) => requestLogin(data))}
      >
        <CardHeader>
          <h1 className="text-2xl">로그인</h1>
        </CardHeader>
        <CardContent className='w-full'>
          <div className="control mt-1 w-full">
            <Label>이메일</Label>
            <Input {...register('email', { required: true })} />
            {errors.email && (
              <p>
                {errors.email.message?.toString() || '이메일은 필수입니다.'}
              </p>
            )}
          </div>
          <div className="control mt-1 w-full">
            <Label>비밀번호</Label>
            <Input
              type="password"
              {...register('password', { required: true })}
            />
            {errors.password && (
              <p>
                {errors.password.message?.toString() ||
                  '비밀번호는 필수입니다.'}
              </p>
            )}
          </div>
          {!isFailed ? (
            <p className="mt-2"></p>
          ) : (
            <p className="mt-4 text-red-500">로그인 정보가 잘못 되었습니다.</p>
          )}
        </CardContent>
        <CardFooter className='flex flex-col w-full'>
          <Button className="mt-2 w-full" type="submit">
            로그인
          </Button>
          <Button className="mt-1 w-full" onClick={toJoinPage}>
            회원가입
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
export default LoginForm;
