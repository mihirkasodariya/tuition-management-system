import React, { memo, useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import _ from 'lodash';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { userActions } from '@/redux/combineActions';

const ChangePassword = () => {
  const { updateUserPasswordAction } = userActions;
  const [info, setInfo] = useState({
    isLoading: false,
    initialValues: {
      password: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const validateSchema = Yup.object({
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase, one lowercase, one number and one special character'
      ),
    newPassword: Yup.string()
      .required('New Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase, one lowercase, one number and one special character'
      ),
    confirmNewPassword: Yup.string()
      .required('New Confirmed Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase, one lowercase, one number and one special character'
      ),
  });

  const formik = useFormik({
    initialValues: _.cloneDeep(info?.initialValues),
    validationSchema: validateSchema,
    // enableReinitialize: true,
    onSubmit: async (values) => {
      if (values.newPassword !== values.newPassword) {
        return toast.error('new password, confirm password should be same');
      } else if (values.password === values.newPassword) {
        return toast.error('password and old password should not be same');
      } else {
        updatePasswordHandlerFunction(values);
      }
    },
  });

  const { errors, values, touched, handleChange, handleSubmit, resetForm, handleBlur } = formik;

  const updatePasswordHandlerFunction = useCallback(
    async (values) => {
      if (info?.isLoading) return;
      setInfo((prev) => ({
        ...prev,
        isLoading: true,
      }));
      let json = {
        password: values?.password,
        newPassword: values?.newPassword,
      };

      let response = await updateUserPasswordAction(json);
      if (response[0] == true) {
        toast.success('successfully password is updated');
        resetForm();
      } else {
        toast.error(response[1]?.message || 'something went wrong, try again later');
      }

      setInfo((prev) => ({
        ...prev,
        isLoading: false,
      }));
    },
    [info?.isLoading]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Change Password</CardTitle>
        <CardDescription>Set a new password to keep your account secure.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Old Password</Label>
              <Input
                id="password"
                type="text"
                name="password"
                placeholder={'Enter Old Password'}
                value={values?.password}
                onChange={handleChange}
                onBlur={handleBlur}
                readOnly={info?.isLoading}
                disabled={info?.isLoading}
                className={touched?.password && errors?.password ? 'border-red-500' : ''}
                required
              />
              {touched?.password && errors?.password && (
                <span className="text-red-500 text-sm">{errors?.password}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">New Password</Label>
              <Input
                id="newPassword"
                type="text"
                name="newPassword"
                placeholder={'Enter New Password'}
                value={values?.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                readOnly={info?.isLoading}
                disabled={info?.isLoading}
                className={touched?.newPassword && errors?.newPassword ? 'border-red-500' : ''}
                required
              />
              {touched?.newPassword && errors?.newPassword && (
                <span className="text-red-500 text-sm">{errors?.newPassword}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                name="confirmNewPassword"
                placeholder={'********'}
                value={values?.confirmNewPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                readOnly={info?.isLoading}
                disabled={info?.isLoading}
                className={
                  touched?.confirmNewPassword && errors?.confirmNewPassword ? 'border-red-500' : ''
                }
                required
              />
              {touched?.confirmNewPassword && errors?.confirmNewPassword && (
                <span className="text-red-500 text-sm">{errors?.confirmNewPassword}</span>
              )}
            </div>
          </div>

          <br />
          <Button type="submit" disabled={info?.isLoading}>
            {info?.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default memo(ChangePassword);
