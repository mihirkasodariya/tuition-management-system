import React, { memo, useState, useEffect, useCallback } from 'react';
import LoginForm from '../features/Login/LoginForm';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginActions } from '@/redux/combineActions';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { ADMIN, STUDENT } from '@/constants/roles.constants';
import { encryptPassword } from '@/utils/encryption';
import Header from '../components/navbar/Header';
import { useNavigate } from 'react-router-dom';
import MetaData from '@/utils/MetaData';

const Login = () => {
  const { error, isLoginSuccess, role } = useSelector((state) => state.loginState);
  // const { profileDetails } = useSelector((state) => state.userProfileState);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginUserAction, clearLoginErrorsAction, resetLoginAction } = loginActions;

  const [info, setInfo] = useState({
    showPassword: false,
    isSubmitting: false,
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
      setInfo((prev) => ({
        ...prev,
        isSubmitting: false,
      }));

      dispatch(clearLoginErrorsAction());
    }

    if (isLoginSuccess) {
      dispatch(resetLoginAction());
      if (role === STUDENT) navigate('/dashboard');
      else if (role === ADMIN) navigate('/dashboard');
    }
  }, [error, isLoginSuccess]);

  const validateSchema = Yup.object().shape({
    email: Yup.string()
      .email('Please Enter the Correct Email')
      .required('please enter your email!'),
    password: Yup.string()
      .required('please enter your password!')
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[@$!%*?&#]/, 'Password must contain at least one special character'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validateSchema,
    onSubmit: (values, { resetForm }) => {
      // resetForm();
      handleSubmitFunction(values);
    },
  });
  const { errors, values, touched, handleChange, handleSubmit, handleBlur } = formik;

  const handleSubmitFunction = useCallback(() => {
    if (info?.isSubmitting) return;

    setInfo((prev) => ({
      ...prev,
      isSubmitting: true,
    }));

    let encryptionPassword = encryptPassword(values?.password || '');
    let json = {
      email: values?.email,
      password: encryptionPassword,
    };

    dispatch(loginUserAction(json));
  }, [info?.isSubmitting, values?.email, values?.password]);

  return (
    <div className="flex min-h-screen flex-col">
      <MetaData title="Log In | AcademIQ" />
      <Header />
      <div className="flex h-full w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleBlur={handleBlur}
            values={values}
            touched={touched}
            errors={errors}
            info={info}
            setInfo={setInfo}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(Login);
