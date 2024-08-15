import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv);

export const commonValue = {
    ORIGIN: process.env.REACT_APP_SERVER_ORIGIN,
    AJV: ajv,
    TOKEN_HEADER: "Authorization",
    ACCESS_TOKEN: "",
}