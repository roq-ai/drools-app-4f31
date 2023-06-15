import * as yup from 'yup';
import { ratingValidationSchema } from 'validationSchema/ratings';
import { sharedLinkValidationSchema } from 'validationSchema/shared-links';

export const mp3ValidationSchema = yup.object().shape({
  title: yup.string().required(),
  genre: yup.string().required(),
  file_path: yup.string().required(),
  library_id: yup.string().nullable().required(),
  rating: yup.array().of(ratingValidationSchema),
  shared_link: yup.array().of(sharedLinkValidationSchema),
});
