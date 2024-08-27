import { JSONSchemaType } from 'ajv';
import { commonValue } from '../common.value';
import {
  SaveImageDeleteInfo,
  SaveImageInfo,
} from '../api/types/saveimage.data.type';

const saveImageSchema: JSONSchemaType<SaveImageInfo> = {
  type: 'object',
  properties: {
    id: { type: 'integer', nullable: false },
    imageId: { type: 'integer', nullable: false },
    userId: { type: 'integer', nullable: false },
  },
  required: ['id', 'imageId', 'userId'],
  additionalProperties: false,
};

export function validateSaveImageInfo(response: SaveImageInfo) {
  const validate = commonValue.AJV.compile(saveImageSchema);
  const valid = validate(response);
  if (!valid) {
    throw new Error('Invalid response format');
  }
}

const deleteSaveImageSchema: JSONSchemaType<SaveImageDeleteInfo> = {
  type: 'object',
  properties: {
    id: { type: 'integer', nullable: false },
  },
  required: ['id'],
  additionalProperties: false,
};

export function validateDeleteSaveImageInfo(response: SaveImageDeleteInfo) {
  const validate = commonValue.AJV.compile(deleteSaveImageSchema);
  const valid = validate(response);
  if (!valid) {
    throw new Error('Invalid response format');
  }
}

const idSchema = {
  type: 'integer',
  nullable: false,
};

export function validateSaveImageId(id: number) {
  const validate = commonValue.AJV.compile(idSchema);
  const valid = validate(id);
  if (!valid) {
    throw new Error('Invalid ID format');
  }
}
