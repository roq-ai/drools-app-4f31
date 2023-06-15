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
import { createMp3 } from 'apiSdk/mp-3s';
import { Error } from 'components/error';
import { mp3ValidationSchema } from 'validationSchema/mp-3s';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { LibraryInterface } from 'interfaces/library';
import { getLibraries } from 'apiSdk/libraries';
import { Mp3Interface } from 'interfaces/mp-3';

function Mp3CreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: Mp3Interface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createMp3(values);
      resetForm();
      router.push('/mp-3s');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<Mp3Interface>({
    initialValues: {
      title: '',
      genre: '',
      file_path: '',
      library_id: (router.query.library_id as string) ?? null,
    },
    validationSchema: mp3ValidationSchema,
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
            Create Mp 3
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="title" mb="4" isInvalid={!!formik.errors?.title}>
            <FormLabel>Title</FormLabel>
            <Input type="text" name="title" value={formik.values?.title} onChange={formik.handleChange} />
            {formik.errors.title && <FormErrorMessage>{formik.errors?.title}</FormErrorMessage>}
          </FormControl>
          <FormControl id="genre" mb="4" isInvalid={!!formik.errors?.genre}>
            <FormLabel>Genre</FormLabel>
            <Input type="text" name="genre" value={formik.values?.genre} onChange={formik.handleChange} />
            {formik.errors.genre && <FormErrorMessage>{formik.errors?.genre}</FormErrorMessage>}
          </FormControl>
          <FormControl id="file_path" mb="4" isInvalid={!!formik.errors?.file_path}>
            <FormLabel>File Path</FormLabel>
            <Input type="text" name="file_path" value={formik.values?.file_path} onChange={formik.handleChange} />
            {formik.errors.file_path && <FormErrorMessage>{formik.errors?.file_path}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<LibraryInterface>
            formik={formik}
            name={'library_id'}
            label={'Select Library'}
            placeholder={'Select Library'}
            fetcher={getLibraries}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
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
  entity: 'mp3',
  operation: AccessOperationEnum.CREATE,
})(Mp3CreatePage);
