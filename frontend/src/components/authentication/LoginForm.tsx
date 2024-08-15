import { FieldValues, useForm } from 'react-hook-form';
import { Label } from '../shadcn/ui/label';
import { Input } from '../shadcn/ui/input';
import { Button } from '../shadcn/ui/button';
import { useNavigate } from 'react-router-dom';
import { ErrorResponse, Response } from '@/src/api/types/common.data.type';
import { login } from '../../api/auth.api';

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const requestLogin = (data: FieldValues) => {
    login(
      { email: data.email, password: data.password },
      (res: Response<string> | ErrorResponse) => {
        if (res?.success) navigate('/');
      },
    );
  };

  const toJoinPage = () => {
    navigate('/join');
  }

  return (
    <form
      className="flex flex-col items-center w-full"
      onSubmit={handleSubmit((data) => requestLogin(data))}
    >
      <h2>Login</h2>
      <div className="control mt-1 w-full">
        <Label>Email</Label>
        <Input {...register('email', { required: true })} />
        {errors.email && <p>Email is required.</p>}
      </div>
      <div className="control mt-1 w-full">
        <Label>Password</Label>
        <Input type="password" {...register('password', { required: true })} />
        {errors.password && <p>Password is required.</p>}
      </div>
      <Button className='mt-4 w-full' type="submit">로그인</Button>
      <Button className='mt-1 w-full' onClick={toJoinPage}>회원가입</Button>
    </form>
  );
}
export default LoginForm;
