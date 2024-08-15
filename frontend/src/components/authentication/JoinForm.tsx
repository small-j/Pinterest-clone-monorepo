import { FieldValues, useForm } from 'react-hook-form';
import { Label } from '../shadcn/ui/label';
import { Input } from '../shadcn/ui/input';
import { Button } from '../shadcn/ui/button';
import { useNavigate } from 'react-router-dom';
import { ErrorResponse, Response } from '@/src/api/types/common.data.type';
import { join } from '../../api/auth.api';
import { JSONSchemaType } from 'ajv';
import { commonValue } from '../../api/common.value';

interface JoinData {
  email: string;
  name: string;
  password: string;
}

const loginSchema: JSONSchemaType<JoinData> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
  },
  required: ['name', 'email', 'password'],
  additionalProperties: false,
};

function JoinForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const navigate = useNavigate();

  const validateWithAjv = (data: FieldValues) => {
    const validate = commonValue.AJV.compile(loginSchema);
    const valid = validate(data);

    if (!valid) {
      validate.errors?.forEach((error) => {
        if (error.instancePath === '/email') {
          setError('email', {
            type: 'manual',
            message: '잘못된 이메일 주소입니다.',
          });
        }
        if (error.instancePath === '/password') {
          setError('password', {
            type: 'manual',
            message: '암호 길이는 6자 이상이어야 합니다.',
          });
        }
      });
      return false;
    }
    return true;
  };

  const requestJoin = (data: FieldValues) => {
    if (!validateWithAjv(data)) return;

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
      <h1 className="text-2xl">회원가입</h1>
      <div className="control mt-1 w-full">
        <Label>이름</Label>
        <Input {...register('name', { required: true })} />
        {errors.name && (
          <p>{errors.name.message?.toString() || '이름은 필수입니다.'}</p>
        )}
      </div>
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
          <p>
            {errors.password.message?.toString() || '비밀번호는 필수입니다.'}
          </p>
        )}
      </div>
      <Button className="mt-4 w-full" type="submit">
        회원가입
      </Button>
    </form>
  );
}
export default JoinForm;
