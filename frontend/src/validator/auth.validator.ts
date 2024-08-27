import { JSONSchemaType, ValidateFunction } from 'ajv';
import { commonValue } from '../common.value';
import {
  JoinInfo,
  LoginInfo,
  LoginUserInfo,
} from '../api/types/auth.data.type';

const idSchema = {
  type: 'integer',
  nullable: false,
};

export function validateUserId(id: number) {
  const validate = commonValue.AJV.compile(idSchema);
  const valid = validate(id);
  if (!valid) {
    throw new Error('Invalid ID format');
  }
}

const loginInfoSchema: JSONSchemaType<LoginInfo> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', nullable: false },
    password: { type: 'string', minLength: 6, nullable: false },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};

export function validateLoginInfo(request: LoginInfo) {
  const validate = commonValue.AJV.compile(loginInfoSchema);
  const valid = validate(request);
  if (!valid) {
    throw new Error('Invalid request format');
  }
}

export function getValidStateLoginInfo(request: LoginInfo): [ValidateFunction<LoginInfo>, boolean] {
    const validate = commonValue.AJV.compile(loginInfoSchema);
    return [validate, validate(request)];
}

const joinInfoSchema: JSONSchemaType<JoinInfo> = {
  type: 'object',
  properties: {
    name: { type: 'string', nullable: false },
    email: { type: 'string', format: 'email', nullable: false },
    password: { type: 'string', minLength: 6, nullable: false },
  },
  required: ['name', 'email', 'password'],
  additionalProperties: false,
};

export function validateJoinInfo(request: JoinInfo) {
  const validate = commonValue.AJV.compile(joinInfoSchema);
  const valid = validate(request);
  if (!valid) {
    throw new Error('Invalid request format');
  }
}

export function getValidStateJoinInfo(request: JoinInfo): [ValidateFunction<JoinInfo>, boolean] {
    const validate = commonValue.AJV.compile(joinInfoSchema);
    return [validate, validate(request)];
}

const LoginUserInfoSchema: JSONSchemaType<LoginUserInfo> = {
  type: 'object',
  properties: {
    id: { type: 'integer', nullable: false },
    name: { type: 'string', nullable: false },
    email: { type: 'string', format: 'email', nullable: false },
    token: { type: 'string', nullable: false },
  },
  required: ['id', 'name', 'email', 'token'],
  additionalProperties: false,
};

export function validateLoginUserInfo(response: LoginUserInfo) {
  const validate = commonValue.AJV.compile(LoginUserInfoSchema);
  const valid = validate(response);
  if (!valid) {
    throw new Error('Invalid response format');
  }
}
