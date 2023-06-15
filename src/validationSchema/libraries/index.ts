import * as yup from 'yup';
import { mp3ValidationSchema } from 'validationSchema/mp-3s';

export const libraryValidationSchema = yup.object().shape({
  description: yup.string(),
  image: yup.string(),
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  mp3: yup.array().of(mp3ValidationSchema),
});
