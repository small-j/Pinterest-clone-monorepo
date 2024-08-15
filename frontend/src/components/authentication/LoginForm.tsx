import { FieldValues, useForm } from 'react-hook-form';
import { Label } from '../shadcn/ui/label';
import { Input } from '../shadcn/ui/input';
import { Button } from '../shadcn/ui/button';
import { useNavigate } from 'react-router-dom';
import { ErrorResponse, Response } from '@/src/api/types/common.data.type';
import { login } from '../../api/auth.api';
import { useState } from 'react';

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [isFailed, setIsFailed] = useState(false);

  const requestLogin = (data: FieldValues) => {
    login(
      { email: data.email, password: data.password },
      (res: Response<string> | ErrorResponse) => {
        if (res?.success) navigate('/');
        else setIsFailed(true);
      },
    );
  };

  const toJoinPage = () => {
    navigate('/join');
  };

  return (
    <form
      className="flex flex-col items-center w-full"
      onSubmit={handleSubmit((data) => requestLogin(data))}
    >
      <h1 className='text-2xl'>로그인</h1>
      <div className="control mt-1 w-full">
        <Label>이메일</Label>
        <Input {...register('email', { required: true })} />
        {errors.email && (
          <p>{errors.email.message?.toString() || '이메일은 필수입니다.'}</p>
        )}
      </div>
      <div className="control mt-1 w-full">
        <Label>비밀번호</Label>
        <Input type="password" {...register('password', { required: true })} />
        {errors.password && (
          <p>{errors.password.message?.toString() || '비밀번호는 필수입니다.'}</p>
        )}
      </div>
      {!isFailed ? <p className='mt-2'></p> : <p className='mt-4 text-red-500'>로그인 정보가 잘못 되었습니다.</p>}
      <Button className="mt-2 w-full" type="submit">
        로그인
      </Button>
      <Button className="mt-1 w-full" onClick={toJoinPage}>
        회원가입
      </Button>
    </form>
  );
}
export default LoginForm;