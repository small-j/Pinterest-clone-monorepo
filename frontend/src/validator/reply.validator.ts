import { JSONSchemaType } from 'ajv';
import { commonValue } from '../api/common.value';
import { CreateImageReply, ImageReplyInfo } from '../api/types/reply.data.type';

const idSchema = {
  type: 'integer',
  nullable: false,
};

export function validateImageReplyId(id: number) {
  const validate = commonValue.AJV.compile(idSchema);
  const valid = validate(id);
  if (!valid) {
    throw new Error('Invalid ID format');
  }
}

const createImageReplySchema: JSONSchemaType<CreateImageReply> = {
  type: 'object',
  properties: {
    imageId: { type: 'integer', nullable: false },
    content: { type: 'string', nullable: false },
  },
  required: ['imageId', 'content'],
};

export function validateCreateImageReply(response: CreateImageReply) {
  const validate = commonValue.AJV.compile(createImageReplySchema);
  const valid = validate(response);
  if (!valid) {
    console.error(validate.errors);
    throw new Error('Invalid request format');
  }
}

const imageReplySchema: JSONSchemaType<ImageReplyInfo> = {
  type: 'object',
  properties: {
    id: { type: 'integer', nullable: false },
    content: { type: 'string', nullable: false },
    userId: { type: 'integer', nullable: false },
    userName: { type: 'string', nullable: false },
  },
  required: ['id', 'content', 'userId', 'userName'],
  additionalProperties: false,
};

export function validateSaveImageInfo(response: ImageReplyInfo) {
  const validate = commonValue.AJV.compile(imageReplySchema);
  const valid = validate(response);
  if (!valid) {
    throw new Error('Invalid response format');
  }
}
