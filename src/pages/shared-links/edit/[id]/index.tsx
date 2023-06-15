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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getSharedLinkById, updateSharedLinkById } from 'apiSdk/shared-links';
import { Error } from 'components/error';
import { sharedLinkValidationSchema } from 'validationSchema/shared-links';
import { SharedLinkInterface } from 'interfaces/shared-link';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { Mp3Interface } from 'interfaces/mp-3';
import { UserInterface } from 'interfaces/user';
import { getMp3s } from 'apiSdk/mp-3s';
import { getUsers } from 'apiSdk/users';

function SharedLinkEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SharedLinkInterface>(
    () => (id ? `/shared-links/${id}` : null),
    () => getSharedLinkById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SharedLinkInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSharedLinkById(id, values);
      mutate(updated);
      resetForm();
      router.push('/shared-links');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SharedLinkInterface>({
    initialValues: data,
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
            Edit Shared Link
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'shared_link',
  operation: AccessOperationEnum.UPDATE,
})(SharedLinkEditPage);
