import React, { useEffect, useCallback, memo, useState } from 'react';
import MainWrapper from '../../layouts/Mainwrapper';
import { useSelector, useDispatch } from 'react-redux';
import { batchActions, boardActions, studentActions } from '@/redux/combineActions';
import StudentRegistrationForm from '@/views/features/students/RegisterComponent';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import moment from 'moment';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import _ from 'lodash';
import MetaData from '@/utils/MetaData';

const breadCrumbs = [
  { label: 'students', href: '/admin/students' },
  { label: 'Register', href: null },
];
const classRooms = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12

const SubjectDetailsCardSkeleton = memo(() => {
  return (
    <Card className=" shadow-md">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            {/* Title */}
            <Skeleton className="h-8 w-64 mb-2 rounded" />
            {/* Description */}
            <Skeleton className="h-4 w-96 rounded" />
          </div>

          {/* Badges Placeholder */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
      </CardHeader>

      {/* Code Info */}
      <CardContent className="space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" key={index}>
            {/* Email Field Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16 rounded" /> {/* Label */}
              <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
            </div>

            {/* Password Field Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 rounded" /> {/* Label */}
              <div className="relative">
                <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
                <Skeleton className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 rounded" />{' '}
                {/* Eye icon placeholder */}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
});

const RegisterStudent = () => {
  const { getBatchesListAction } = batchActions;
  const { getBoardsListAction } = boardActions;
  const { registerNewStudentAction } = studentActions;

  const dispatch = useDispatch();
  const { batchesList } = useSelector((state) => state.batchState);
  const { boardsList } = useSelector((state) => state.boardState);

  const [info, setInfo] = useState({
    loading: true,
    showPassword: false,
    isSubmitting: false,
    isReadOnly: false,
    initialValues: {
      name: '',
      email: '',
      password: 'Test@123',
      gender: 'female',
      fatherName: '',
      motherName: '',
      phone: '',
      address: '',
      dateOfBirth: null,
      classRoom: '',
      school: '',
      boardType: '',
      timings: {
        start: '',
        end: '',
      },
      days: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      },
      dateOfJoining: null,
    },
    registerEnrollmentModal: false,
    createEnrollmentLoading: false,
  });

  useEffect(() => {
    if (!batchesList) {
      fetchBatchesListHandler();
    }

    if (!boardsList) {
      fetchBoardsListHandler();
    }
  }, []);

  useEffect(() => {
    if (batchesList && boardsList) {
      setInfo((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  }, [boardsList, batchesList]);

  const validateSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase, one lowercase, one number and one special character'
      ),
    gender: Yup.string().required('Gender is required'),
    fatherName: Yup.string().required("Father's name is required"),
    motherName: Yup.string().required("Mother's name is required"),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
    address: Yup.string().required('Address is required'),
    dateOfBirth: Yup.date().required('Date of birth is required'),
    classRoom: Yup.number().required('Class is required'),
    school: Yup.string().required('School is required'),
    boardType: Yup.string().required('Board type is required'),
    timings: Yup.object({
      start: Yup.string().required('Start time is required'),
      end: Yup.string().required('End time is required'),
    }),
    dateOfJoining: Yup.date().required('Date of joining is required'),
  });

  const formik = useFormik({
    initialValues: _.cloneDeep(info?.initialValues),
    validationSchema: validateSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await registerNewStudentDetailsHandler(values);
    },
  });

  const {
    errors,
    values,
    touched,
    handleChange,
    handleSubmit,
    resetForm,
    handleBlur,
    setFieldValue,
  } = formik;

  const fetchBatchesListHandler = useCallback(async () => {
    dispatch(getBatchesListAction());
  }, [batchesList]);

  const fetchBoardsListHandler = useCallback(async () => {
    dispatch(getBoardsListAction());
  }, [boardsList]);

  const registerNewStudentDetailsHandler = async (details) => {
    setInfo((prev) => ({
      ...prev,
      isSubmitting: true,
    }));

    // Format dates to ISO string
    const payload = {
      ...details,
      dateOfBirth: moment(details.dateOfBirth).utc().format(),
      dateOfJoining: moment(details.dateOfJoining).utc().format(),
      timings: {
        start: moment(details.timings.start, 'HH:mm').format(),
        end: moment(details.timings.end, 'HH:mm').format(),
      },
    };

    const response = await registerNewStudentAction(payload);
    if (response[2] === 201) {
      toast.success(response[1]?.message || 'successfully student is registered');
      resetForm();
    } else {
      toast.success(response[1]?.message || 'student is not registered try again later');
    }

    setInfo((prev) => ({
      ...prev,
      isSubmitting: false,
    }));
  };

  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <MetaData title={`Admin  'Register Student' | AcademIQ `} />
      {info?.loading ? (
        <SubjectDetailsCardSkeleton />
      ) : (
        <StudentRegistrationForm
          errors={errors}
          values={values}
          touched={touched}
          handleChange={handleChange}
          setFieldValue={setFieldValue}
          handleBlur={handleBlur}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
          info={info}
          setInfo={setInfo}
          classRooms={classRooms}
          boardTypes={boardsList}
          studentId={null}
        />
      )}
    </MainWrapper>
  );
};

export default memo(RegisterStudent);
