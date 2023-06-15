import * as yup from 'yup';

export const sharedLinkValidationSchema = yup.object().shape({
  url: yup.string().required(),
  mp3_id: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
});
