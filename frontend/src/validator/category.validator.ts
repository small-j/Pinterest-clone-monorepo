import { JSONSchemaType } from 'ajv';
import { commonValue } from '../api/common.value';
import { CategoryInfo } from '../api/types/category.data.type';

const categoryInfoSchema: JSONSchemaType<CategoryInfo[]> = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'integer', nullable: false },
      name: { type: 'string', nullable: false },
    },
    required: ['id', 'name'],
    additionalProperties: false,
  },
};

export function validateSaveImageInfo(response: CategoryInfo[]) {
  const validate = commonValue.AJV.compile(categoryInfoSchema);
  const valid = validate(response);
  if (!valid) {
    throw new Error('Invalid response format');
  }
}
