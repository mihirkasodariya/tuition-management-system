import React, { memo, useCallback, useRef, useMemo } from 'react';
import ModalV2 from '@/views/components/modal/ModalV2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Label, Separator } from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { studentActions } from '@/redux/combineActions';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import JoditEditor from 'jodit-react';
import { Rating } from '@/components/custom/Rating';
import moment from 'moment';

const createHomework = ({ info, setInfo, closeModalFunction }) => {
  const {
    assignNewHomeworkAction,
    updateStudentStateAction,
    updateRatingHomeworkAction,
    updateHomeworkDetailsAction,
  } = studentActions;
  const { studentId } = useParams();
  const dispatch = useDispatch();
  const editorRef = useRef(null);

  const { homeworkList } = useSelector((state) => state.studentState);
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required').min(2, 'Title is too short!'),
    description: Yup.string()
      .required('Description is required')
      .min(5, 'Description is too short!'),
    deadline: Yup.date().required('Date of birth is required'),
  });

  const formik = useFormik({
    initialValues: {
      title: info?.initialValues?.title || '',
      description: info?.initialValues?.description || '',
      deadline: info?.initialValues?.deadline || null,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (info?.homeworkDetails) {
        updateHomeworkSubmitHandler(values);
      } else {
        submitAssignHomeworkFormHandler(values);
      }
    },
  });

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: 'Start typing...',
    }),
    []
  );

  const {
    errors,
    values,
    touched,
    handleChange,
    setFieldValue,
    handleSubmit,
    handleBlur,
    resetForm,
  } = formik;

  const submitAssignHomeworkFormHandler = useCallback(
    async (values) => {
      if (info?.isSubmitting) return;

      setInfo((prev) => ({ ...prev, isSubmitting: true }));
      let json = {
        title: values?.title,
        description: values?.description,
        deadline: values?.deadline,
      };
      let updateInfoState = {
        isSubmitting: false,
      };
      const response = await assignNewHomeworkAction(studentId, json);
      if (response[2] === 201) {
        let updateList = _.cloneDeep(homeworkList);
        updateList.docs = [response[1]?.data, ...updateList.docs];
        dispatch(updateStudentStateAction({ homeworkList: updateList }));
        resetForm();
        closeModalFunction();
      } else {
        toast.error(response[1]?.message || 'unable to assign the home work');
      }

      setInfo((prev) => ({ ...prev, ...updateInfoState }));
    },
    [info?.isSubmitting, homeworkList]
  );

  const feedbackChangeHandler = useCallback(
    (value, key) => {
      setInfo((prev) => ({
        ...prev,
        feedbackRating: { ...prev.feedbackRating, [key]: value },
      }));
    },
    [info?.feedbackRating]
  );

  const submitRatingFormHandler = useCallback(
    async (e) => {
      e.preventDefault();
      if (info?.feedbackLoading) return;

      setInfo((prev) => ({ ...prev, feedbackLoading: true }));
      let json = {
        rating: info?.feedbackRating?.rating,
        feedback: info?.feedbackRating?.feedback,
      };
      let updateInfoState = {
        feedbackLoading: false,
      };
      const response = await updateRatingHomeworkAction(info?.homeworkDetails?._id, json);
      if (response[0] === true) {
        let updateList = _.cloneDeep(homeworkList);
        updateList.docs = updateList?.docs?.map((item) => {
          if (item._id === info?.homeworkDetails?._id) {
            return response[1]?.data || {};
          } else {
            return item;
          }
        });
        dispatch(updateStudentStateAction({ homeworkList: updateList }));
        closeModalFunction();
      } else {
        toast.error(response[1]?.message || 'unable to add the rating');
      }

      setInfo((prev) => ({ ...prev, ...updateInfoState }));
    },
    [info?.feedbackLoading, homeworkList, info?.homeworkDetails, info?.feedbackRating]
  );

  const updateHomeworkSubmitHandler = useCallback(
    async (values) => {
      if (info?.isSubmitting) return;

      setInfo((prev) => ({ ...prev, isSubmitting: true }));
      let json = {
        title: values?.title,
        description: values?.description,
        deadline: values?.deadline,
      };
      let updateInfoState = {
        isSubmitting: false,
      };
      const response = await updateHomeworkDetailsAction(info?.homeworkDetails?._id, json);
      if (response[0] === true) {
        let updateList = _.cloneDeep(homeworkList);
        updateList.docs = updateList?.docs?.map((item) => {
          if (item._id === info?.homeworkDetails?._id) {
            return response[1]?.data || {};
          } else {
            return item;
          }
        });
        dispatch(updateStudentStateAction({ homeworkList: updateList }));
        closeModalFunction();
      } else {
        toast.error(response[1]?.message || 'unable to update the homework');
      }

      setInfo((prev) => ({ ...prev, ...updateInfoState }));
    },
    [info?.isSubmitting, homeworkList, info?.homeworkDetails]
  );

  return (
    <ModalV2
      isOpen={info?.openModal}
      title="Create New Homework"
      closeOutside={false}
      onClose={() => {
        resetForm();
        closeModalFunction();
      }}
    >
      {info?.homeworkDetails && !info?.homeworkDetails?.ratedOn && (
        <>
          <Card className="lg:col-span-2">
            <CardContent>
              <form className="space-y-4 mt-4" onSubmit={submitRatingFormHandler}>
                <div className="space-y-2">
                  <Label htmlFor="name" className="block text-sm font-medium">
                    Rating *
                  </Label>

                  <Rating
                    value={info?.feedbackRating?.rating}
                    onChange={(value) => feedbackChangeHandler(value, 'rating')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="block text-sm font-medium">
                    Feedback
                  </Label>
                  <Textarea
                    id="feedback"
                    placeholder="Enter the Feedback"
                    rows={3}
                    value={info?.feedbackRating?.feedback}
                    className="resize-none border-gray-400"
                    onChange={(e) => feedbackChangeHandler(e.target.value, 'feedback')}
                    disabled={info?.feedbackLoading}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="submit" disabled={info?.isSubmitting || false} tabIndex={5}>
                    {info?.feedbackLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        submitting...
                      </>
                    ) : (
                      'Submit Rating'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Separator className="w-full h-[2px] bg-gray-200 my-3" />
        </>
      )}

      <Card className="lg:col-span-2">
        <CardContent>
          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name" className="block text-sm font-medium">
                Title *
              </Label>
              <Input
                id="title"
                placeholder="Enter the title"
                value={values?.title}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${touched?.title && errors?.title ? 'border-red-500' : ''}`}
                readOnly={info?.isSubmitting}
                tabIndex={1}
              />
              {touched?.title && errors?.title && (
                <p className="text-sm text-red-500 mt-1">{errors?.title}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="block text-sm font-medium">
                Description *
              </Label>
              {/* <Textarea
                id="description"
                placeholder="Enter board description"
                rows={5}
                value={values?.description}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`resize-none ${
                  touched?.description && errors?.description ? 'border-red-500' : ''
                }`}
                readOnly={info?.isSubmitting}
              /> */}
              <div className="mb-4">
                <JoditEditor
                  ref={editorRef}
                  value={values?.description}
                  config={config}
                  tabIndex={2}
                  onChange={(newContent) => setFieldValue('description', newContent)}
                />
              </div>
              {touched?.description && errors?.description && (
                <p className="text-sm text-red-500 mt-1">{errors?.description}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline" className="block text-sm font-medium">
                Deadline to Submit *
              </Label>
              <input
                id="deadline"
                type="date"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Select date"
                value={values?.deadline}
                onChange={(e) => setFieldValue('deadline', e.target.value)}
                onBlur={handleBlur}
                min={new Date().toISOString().split('T')[0]}
                readOnly={info?.isSubmitting}
                tabIndex={3}
              />

              {touched?.deadline && errors?.deadline && (
                <span className="text-red-500 text-sm">{errors?.deadline}</span>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-4">
              {!info?.homeworkDetails ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={info?.isSubmitting || false}
                    onClick={resetForm}
                    tabIndex={6}
                  >
                    Reset
                  </Button>
                  <Button type="submit" disabled={info?.isSubmitting || false} tabIndex={5}>
                    {info?.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create New Homework'
                    )}
                  </Button>
                </>
              ) : (
                <Button type="submit" disabled={info?.isSubmitting || false} tabIndex={5}>
                  {info?.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Homework'
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </ModalV2>
  );
};

export default memo(createHomework);
