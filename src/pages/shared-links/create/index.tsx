import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createSharedLink } from 'apiSdk/shared-links';
import { Error } from 'components/error';
import { sharedLinkValidationSchema } from 'validationSchema/shared-links';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { Mp3Interface } from 'interfaces/mp-3';
import { UserInterface } from 'interfaces/user';
import { getMp3s } from 'apiSdk/mp-3s';
import { getUsers } from 'apiSdk/users';
import { SharedLinkInterface } from 'interfaces/shared-link';

function SharedLinkCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: SharedLinkInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createSharedLink(values);
      resetForm();
      router.push('/shared-links');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<SharedLinkInterface>({
    initialValues: {
      url: '',
      mp3_id: (router.query.mp3_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: sharedLinkValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Shared Link
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="url" mb="4" isInvalid={!!formik.errors?.url}>
            <FormLabel>Url</FormLabel>
            <Input type="text" name="url" value={formik.values?.url} onChange={formik.handleChange} />
            {formik.errors.url && <FormErrorMessage>{formik.errors?.url}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<Mp3Interface>
            formik={formik}
            name={'mp3_id'}
            label={'Select Mp 3'}
            placeholder={'Select Mp 3'}
            fetcher={getMp3s}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.title}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'shared_link',
  operation: AccessOperationEnum.CREATE,
})(SharedLinkCreatePage);
