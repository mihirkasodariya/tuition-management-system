import { memo, useCallback, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, GraduationCap, Calendar, School, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { subjectActions } from '@/redux/combineActions';
import { useParams } from 'react-router-dom';
import MetaData from '@/utils/MetaData';
import MainWrapper from '@/views/layouts/Mainwrapper';
import { Button } from '@/components/ui/button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import _ from 'lodash';
import toast from 'react-hot-toast';

const ChapterCardSkeleton = () => {
  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-emerald-500 shadow-md">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <Skeleton className="h-8 w-48 md:w-64 rounded mb-2" /> {/* Title */}
              <Skeleton className="h-4 w-64 md:w-96 rounded" /> {/* Description */}
            </div>

            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 md:w-28 rounded-md" />
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>
        </CardContent>
      </Card>
      <Card className="overflow-hidden border-none shadow-md py-0">
        {/* Cover Image / Gradient Header Placeholder */}
        <div className="h-32 bg-muted relative">
          <div className="absolute inset-0 bg-black/0"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <Skeleton className="h-6 w-3/4 rounded mb-2" />
            <Skeleton className="h-4 w-full rounded" />
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="p-4">
          <Skeleton className="h-5 w-24 mb-3 rounded" /> {/* Sub-chapter title */}
          <ul className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <li key={i} className="flex items-start gap-3">
                <Skeleton className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-48 rounded" />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>

        {/* Footer */}
        <CardFooter className="bg-gray-50 px-4 py-3 flex justify-between items-center">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-6 w-16 rounded-md" />
        </CardFooter>
      </Card>
    </div>
  );
};
const EditSingleChapter = () => {
  const dispatch = useDispatch();
  const { subjectId, chapterId } = useParams();
  const {
    getPublicSubjectDetailAction,
    updateSubjectChapterAction,
    updateSubjectStateAction,
    clearSubjectErrorsAction,
  } = subjectActions;
  const { publicSubjectDetail, loading, error } = useSelector((state) => state.subjectState);

  const [info, setInfo] = useState({
    isSubmitting: false,
    initialValues: {
      title: '',
      content: '',
      imageURL: '',
      subchapters: [],
    },
    chapterDetails: null,
  });

  useEffect(() => {
    if (!publicSubjectDetail || publicSubjectDetail?._id !== subjectId) {
      fetchSubjectDetailsHandler();
    }
    if (publicSubjectDetail?._id === subjectId) {
      let chapterDetails = _.find(publicSubjectDetail?.chapters, { _id: chapterId });
      let initialStateData = {
        title: chapterDetails?.title || '',
        content: chapterDetails?.content || '',
        imageURL: chapterDetails?.imageURL || '',
        subchapters: _.map(chapterDetails?.subChapters, (item) => ({
          _id: item?._id,
          title: item?.title || '',
          content: item?.content || '',
          imageURL: item?.imageURL || '',
        })),
      };

      setInfo((prev) => ({
        ...prev,
        initialValues: _.cloneDeep(initialStateData),
        chapterDetails: _.cloneDeep(chapterDetails) || null,
      }));
    }
  }, [publicSubjectDetail, subjectId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      resetErrorStateFunction();
    }
  }, [error]);

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, 'Chapter title must be at least 3 characters')
      .max(100, 'Chapter title cannot exceed 100 characters')
      .required('Chapter title is required'),
    content: Yup.string()
      .min(10, 'Chapter content must be at least 10 characters')
      .required('Chapter content is required'),
    imageURL: Yup.string().url('Must be a valid URL'),
    subchapters: Yup.array()
      .of(
        Yup.object().shape({
          title: Yup.string()
            .min(3, 'Subchapter title must be at least 3 characters')
            .max(100, 'Subchapter title cannot exceed 100 characters')
            .required('Subchapter title is required'),
          content: Yup.string()
            .min(10, 'Subchapter content must be at least 10 characters')
            .required('Subchapter content is required'),
          imageURL: Yup.string().url('Must be a valid URL'),
        })
      )
      .min(1, 'At least one subchapter is required'),
  });

  const formik = useFormik({
    initialValues: info.initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      await handleUpdateChapterDetailsFunction(values);
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    resetForm,
  } = formik;

  const addSubchapter = () => {
    const newChapters = values.subchapters;
    newChapters.push({
      title: '',
      content: '',
      imageURL: '',
    });
    setFieldValue('subchapters', newChapters);
  };

  const removeSubchapter = (subchapterIndex) => {
    const newSubChapters = [...values.subchapters];
    newSubChapters.splice(subchapterIndex, 1);
    setFieldValue('subchapters', newSubChapters);
  };

  const updateSubchapter = (subchapterIndex, field, value) => {
    const newSubChapters = [...values.subchapters];
    newSubChapters[subchapterIndex][field] = value;
    setFieldValue('subchapters', newSubChapters);
    setFieldTouched(`subchapters[${subchapterIndex}].${field}`, true);
  };

  const fetchSubjectDetailsHandler = useCallback(() => {
    dispatch(getPublicSubjectDetailAction(subjectId));
  }, [publicSubjectDetail, subjectId]);

  const handleUpdateChapterDetailsFunction = async (values) => {
    if (info?.isSubmitting) return;
    setInfo((prev) => ({
      ...prev,
      isSubmitting: true,
    }));
    let json = {
      title: values.title,
      content: values.content,
      imageURL: values.imageURL,
      subchapters: values.subchapters,
    };

    let response = await updateSubjectChapterAction(chapterId, json);
    if (response[0] === true) {
      toast.success(response[1]?.message);
      let updatePublicSubjectDetailState = _.cloneDeep(publicSubjectDetail);
      updatePublicSubjectDetailState.chapters = updatePublicSubjectDetailState.chapters.map(
        (item) => {
          if (item._id === chapterId) return response[1].data;
          else return item;
        }
      );
      dispatch(updateSubjectStateAction({ publicSubjectDetail: updatePublicSubjectDetailState }));
    } else {
      toast.error(response[1].message || 'something went wrong in updating the chapter details');
    }

    setInfo((prev) => ({
      ...prev,
      isSubmitting: false,
    }));
  };

  const resetErrorStateFunction = useCallback(() => {
    dispatch(clearSubjectErrorsAction());
  }, [error]);

  return (
    <MainWrapper
      breadCrumbs={[
        { label: 'Subjects', href: '/admin/subjects' },
        { label: 'Subject Detail', href: `/admin/subject/${subjectId}` },
        { label: 'Chapter Details', href: null },
      ]}
    >
      <MetaData title={`${publicSubjectDetail?.name || 'Chapter Details'} | AcademIQ`} />
      <div className="px-4 mx-auto">
        {loading ? (
          <ChapterCardSkeleton />
        ) : publicSubjectDetail && info?.chapterDetails ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject Header Card */}
            <Card className="border-t-4 border-t-emerald-500 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl md:text-3xl capitalize font-bold text-emerald-700">
                      {publicSubjectDetail?.name}
                    </CardTitle>
                    <CardDescription className="text-base mt-2 break-words whitespace-normal line-clamp-2 ">
                      {publicSubjectDetail?.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1"
                    >
                      <School className="h-3.5 w-3.5" />
                      <span>Class {publicSubjectDetail?.class}</span>
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
                    >
                      <GraduationCap className="h-3.5 w-3.5" />
                      <span>{publicSubjectDetail?.boardType?.name}</span>
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{publicSubjectDetail?.batch?.name}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <BookOpen className="h-4 w-4" />
                  <span>Subject Code: {publicSubjectDetail?.code}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-lg font-semibold">Chapter</CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={values?.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Chapter title"
                    className={touched?.title && errors?.title ? 'border-red-500' : ''}
                    disabled={info?.isSubmitting}
                  />
                  {touched?.title && errors?.title && (
                    <p className="text-sm text-red-500">{errors?.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={values?.content}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Chapter content description"
                    className={touched?.content && errors?.content ? 'border-red-500' : ''}
                    disabled={info?.isSubmitting}
                  />
                  {touched?.content && errors?.content && (
                    <p className="text-sm text-red-500">{errors?.content}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageURL">Image URL</Label>
                  <Input
                    id="imageURL"
                    value={values?.imageURL}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="https://example.com/images/chapter.jpg"
                    type="url"
                    className={touched?.imageURL && errors?.imageURL ? 'border-red-500' : ''}
                    disabled={info?.isSubmitting}
                  />
                  {touched?.imageURL && errors?.imageURL && (
                    <p className="text-sm text-red-500">{errors?.imageURL}</p>
                  )}
                </div>

                {/* Subchapters Section */}
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-medium">Subchapters *</h4>
                    <Button
                      type="button"
                      onClick={addSubchapter}
                      variant="outline"
                      size="sm"
                      disabled={info?.isSubmitting}
                    >
                      Add Subchapter
                    </Button>
                  </div>

                  {touched?.subchapters &&
                    errors?.subchapters &&
                    typeof errors?.subchapters === 'string' && (
                      <p className="text-sm text-red-500">{errors?.subchapters}</p>
                    )}

                  {values?.subchapters.map((subchapter, subchapterIndex) => (
                    <div
                      key={subchapterIndex}
                      className="pl-4 border-l-2 border-gray-200 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <h5 className="text-sm font-medium underline">
                          Subchapter : {subchapterIndex + 1}
                        </h5>
                        <Button
                          type="button"
                          onClick={() => removeSubchapter(subchapterIndex)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          disabled={info?.isSubmitting}
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`subchapters[${subchapterIndex}].title`}>Title *</Label>
                        <Input
                          id={`subchapters[${subchapterIndex}].title`}
                          value={subchapter.title}
                          onChange={(e) =>
                            updateSubchapter(subchapterIndex, 'title', e.target.value)
                          }
                          onBlur={() =>
                            setFieldTouched(`subchapters[${subchapterIndex}].title`, true)
                          }
                          placeholder="Subchapter title"
                          className={
                            touched?.subchapters?.[subchapterIndex]?.title &&
                            errors?.subchapters?.[subchapterIndex]?.title
                              ? 'border-red-500'
                              : ''
                          }
                          disabled={info?.isSubmitting}
                        />
                        {touched?.subchapters?.[subchapterIndex]?.title &&
                          errors?.subchapters?.[subchapterIndex]?.title && (
                            <p className="text-sm text-red-500">
                              {errors?.subchapters[subchapterIndex].title}
                            </p>
                          )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`subchapters[${subchapterIndex}].content`}>Content *</Label>
                        <Textarea
                          id={`subchapters[${subchapterIndex}].content`}
                          value={subchapter.content}
                          onChange={(e) =>
                            updateSubchapter(subchapterIndex, 'content', e.target.value)
                          }
                          onBlur={() =>
                            setFieldTouched(`subchapters[${subchapterIndex}].content`, true)
                          }
                          placeholder="Subchapter content description"
                          className={
                            touched?.subchapters?.[subchapterIndex]?.content &&
                            errors?.subchapters?.[subchapterIndex]?.content
                              ? 'border-red-500'
                              : ''
                          }
                          disabled={info?.isSubmitting}
                        />
                        {touched?.subchapters?.[subchapterIndex]?.content &&
                          errors?.subchapters?.[subchapterIndex]?.content && (
                            <p className="text-sm text-red-500">
                              {errors?.subchapters[subchapterIndex].content}
                            </p>
                          )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`subchapters[${subchapterIndex}].imageURL`}>
                          Image URL
                        </Label>
                        <Input
                          id={`subchapters[${subchapterIndex}].imageURL`}
                          value={subchapter.imageURL}
                          onChange={(e) =>
                            updateSubchapter(subchapterIndex, 'imageURL', e.target.value)
                          }
                          onBlur={() =>
                            setFieldTouched(`subchapters[${subchapterIndex}].imageURL`, true)
                          }
                          placeholder="https://example.com/images/subchapter.jpg"
                          type="url"
                          className={
                            touched?.subchapters?.[subchapterIndex]?.imageURL &&
                            errors?.subchapters?.[subchapterIndex]?.imageURL
                              ? 'border-red-500'
                              : ''
                          }
                          disabled={info?.isSubmitting}
                        />
                        {touched?.subchapters?.[subchapterIndex]?.imageURL &&
                          errors?.subchapters?.[subchapterIndex]?.imageURL && (
                            <p className="text-sm text-red-500">
                              {errors?.subchapters[subchapterIndex].imageURL}
                            </p>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex gap-6 justify-end">
                <Button type="submit">
                  {info?.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Chapter'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        ) : (
          <Card className="flex flex-col items-center justify-center p-8 text-center shadow-none border-0">
            <div className="rounded-full p-3 bg-muted mb-4">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Subject Not Found</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              The requested subject could not be found. Please check the subject code or try another
              search.
            </p>
          </Card>
        )}
      </div>
    </MainWrapper>
  );
};

export default memo(EditSingleChapter);
