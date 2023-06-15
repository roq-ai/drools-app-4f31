import * as yup from 'yup';

export const ratingValidationSchema = yup.object().shape({
  value: yup.number().integer().required(),
  mp3_id: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
});
