import React, { useEffect, useCallback, memo, useState } from 'react';
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
import { useParams } from 'react-router-dom';
import MetaData from '@/utils/MetaData';

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

const UpdateStudentDetails = () => {
  const { getBatchesListAction } = batchActions;
  const { getBoardsListAction } = boardActions;
  const { updateStudentStateAction, updateStudentDetailsAction, getSingleStudentDetailAction } =
    studentActions;

  const dispatch = useDispatch();
  const { studentId } = useParams();
  const { batchesList } = useSelector((state) => state.batchState);
  const { boardsList } = useSelector((state) => state.boardState);
  const { singleStudentDetail } = useSelector((state) => state.studentState);

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
  });

  useEffect(() => {
    if (!batchesList) {
      fetchBatchesListHandler();
    }

    if (!boardsList) {
      fetchBoardsListHandler();
    }

    if (studentId && (!singleStudentDetail || singleStudentDetail?._id !== studentId)) {
      fetchStudentDetailHandler();
    }
  }, []);

  useEffect(() => {
    if (batchesList && boardsList && studentId && singleStudentDetail?._id === studentId) {
      let updateDetails = {
        name: singleStudentDetail?.name ?? info?.initialValues?.name,
        email: singleStudentDetail?.email ?? info?.initialValues?.email,
        gender: singleStudentDetail?.gender ?? info?.initialValues?.gender,
        fatherName: singleStudentDetail?.fatherName ?? info?.initialValues?.fatherName,
        motherName: singleStudentDetail?.motherName ?? info?.initialValues?.motherName,
        phone: singleStudentDetail?.phone ?? info?.initialValues?.phone,
        address: singleStudentDetail?.address ?? info?.initialValues?.address,
        dateOfBirth: new Date(singleStudentDetail?.dateOfBirth) ?? info?.initialValues?.dateOfBirth,
        classRoom: String(singleStudentDetail.class || info?.initialValues?.classRoom),
        school: singleStudentDetail?.school ?? info?.initialValues?.school,
        boardType: singleStudentDetail?.boardType?._id ?? info?.initialValues?.boardType,
        days: singleStudentDetail?.days ?? info?.initialValues?.days,
        timings: {
          start: singleStudentDetail?.timings?.startTimeHHMM ?? info?.initialValues?.timings?.start,
          end: singleStudentDetail?.timings?.endTimeHHMM ?? info?.initialValues?.timings?.end,
        },
        dateOfJoining:
          new Date(singleStudentDetail?.dateOfJoining) ?? info?.initialValues?.dateOfJoining,
      };
      setInfo((prev) => ({
        ...prev,
        loading: false,
        isReadOnly: true,
        initialValues: {
          ...prev?.initialValues,
          ...updateDetails,
        },
      }));
    }
  }, [boardsList, batchesList, singleStudentDetail?._id, studentId]);

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
      await updateStudentDetailsHandler(values);
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

  const fetchStudentDetailHandler = useCallback(async () => {
    dispatch(getSingleStudentDetailAction(studentId));
  }, [singleStudentDetail, studentId]);

  const updateStudentDetailsHandler = async (details) => {
    setInfo((prev) => ({
      ...prev,
      isSubmitting: true,
      isReadOnly: true,
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
    const response = await updateStudentDetailsAction(payload, studentId);
    if (response[2] === 201) {
      toast.success(response[1]?.message || 'successfully student is updated');
      dispatch(
        updateStudentStateAction({
          singleStudentDetail: response[1]?.data,
          studentsList: null,
        })
      );
      // resetForm();
    } else {
      toast.success(response[1]?.message || 'student is not updated try again later');
    }
    setInfo((prev) => ({
      ...prev,
      isSubmitting: false,
    }));
  };

  return (
    <>
      <MetaData
        title={`Admin ${studentId ? 'Student Details' : 'Register Student'} | AcademIQ `}
      />
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
          studentId={studentId || null}
        />
      )}
    </>
  );
};

export default memo(UpdateStudentDetails);
