import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv);

export const commonValue = {
  ORIGIN: process.env.REACT_APP_SERVER_ORIGIN,
  AJV: ajv,
  TOKEN_HEADER: 'Authorization',
  ACCESS_TOKEN: '',
  IMAGE_PIN_CARD_SIZE: 236,
  IMAGE_PIN_CARD_MARGIN_SIZE: 8,
  IMAGE_DATA_PAGE_SIZE: (visualViewport: VisualViewport) => 9 * // 9행.
  Math.floor(
    visualViewport.width /
      (commonValue.IMAGE_PIN_CARD_MARGIN_SIZE +
        commonValue.IMAGE_PIN_CARD_SIZE +
        commonValue.IMAGE_PIN_CARD_MARGIN_SIZE),
  ),
};
