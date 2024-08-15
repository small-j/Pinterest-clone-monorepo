import { FieldValues, useForm } from 'react-hook-form';
import { Label } from '../shadcn/ui/label';
import { Input } from '../shadcn/ui/input';
import { Button } from '../shadcn/ui/button';
import { useNavigate } from 'react-router-dom';
import { ErrorResponse, Response } from '@/src/api/types/common.data.type';
import { join } from '../../api/auth.api';

function JoinForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const requestJoin = (data: FieldValues) => {
    join(
      { name: data.name, email: data.email, password: data.password },
      (res: Response<string> | ErrorResponse) => {
        if (res?.success) navigate('/login');
      },
    );
  };

  return (
    <form
      className="flex flex-col items-center w-full"
      onSubmit={handleSubmit((data) => requestJoin(data))}
    >
      <h1 className='text-2xl'>회원가입</h1>
      <div className="control mt-1 w-full">
        <Label>Name</Label>
        <Input {...register('name', { required: true })} />
        {errors.name && <p>{errors.name.message?.toString() || '이름은 필수입니다.'}</p>}
      </div>
      <div className="control mt-1 w-full">
        <Label>Email</Label>
        <Input {...register('email', { required: true })} />
        {errors.email && <p>{errors.email.message?.toString() || '이메일은 필수입니다.'}</p>}
      </div>
      <div className="control mt-1 w-full">
        <Label>Password</Label>
        <Input type="password" {...register('password', { required: true })} />
        {errors.password && <p>{errors.password.message?.toString() || '비밀번호는 필수입니다.'}</p>}
      </div>
      <Button className='mt-4 w-full' type='submit'>회원가입</Button>
    </form>
  );
}
export default JoinForm;
