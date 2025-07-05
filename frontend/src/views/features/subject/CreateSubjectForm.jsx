import React, { useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { cleanObject } from '@/helpers';
import { subjectActions } from '@/redux/combineActions';
import toast from 'react-hot-toast';
import _ from 'lodash';
import * as XLSX from 'xlsx';
import DownloadFile from '../../../assets/excels/chapter_demo.xlsx';
const SubjectForm = ({ boards, classrooms, isSubmitting }) => {
  // Validation Schema

  const { createNewSubjectAction } = subjectActions;
  const [info, setInfo] = useState({
    initialValues: {
      name: '',
      code: '',
      description: '',
      classRoom: '',
      boardType: '',
      chapters: [],
    },
  });

  const fileUploadRef = useRef();
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .required('Subject name is required'),
    code: Yup.string()
      .min(2, 'Code must be at least 2 characters')
      .max(20, 'Code cannot exceed 20 characters')
      .required('Subject code is required'),
    description: Yup.string().max(200, 'Description cannot exceed 200 characters'),
    classRoom: Yup.string().required('Class is required'),
    boardType: Yup.string().required('Board is required'),
    chapters: Yup.array()
      .of(
        Yup.object().shape({
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
        })
      )
      .min(1, 'At least one chapter is required'),
  });

  const formik = useFormik({
    initialValues: info.initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      await handleCreateNewSubjectFunction(values);
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

  // Helper functions for dynamic fields
  const addChapter = () => {
    const newChapters = [
      ...values.chapters,
      {
        title: '',
        content: '',
        imageURL: '',
        subchapters: [],
      },
    ];
    setFieldValue('chapters', newChapters);
  };

  const removeChapter = (index) => {
    const newChapters = [...values.chapters];
    newChapters.splice(index, 1);
    setFieldValue('chapters', newChapters);
  };

  const updateChapter = (chapterIndex, field, value) => {
    const newChapters = [...values.chapters];
    newChapters[chapterIndex][field] = value;
    setFieldValue('chapters', newChapters);
    setFieldTouched(`chapters[${chapterIndex}].${field}`, true);
  };

  const addSubchapter = (chapterIndex) => {
    const newChapters = [...values.chapters];
    newChapters[chapterIndex].subchapters.push({
      title: '',
      content: '',
      imageURL: '',
    });
    setFieldValue('chapters', newChapters);
  };

  const removeSubchapter = (chapterIndex, subchapterIndex) => {
    const newChapters = [...values.chapters];
    newChapters[chapterIndex].subchapters.splice(subchapterIndex, 1);
    setFieldValue('chapters', newChapters);
  };

  const updateSubchapter = (chapterIndex, subchapterIndex, field, value) => {
    const newChapters = [...values.chapters];
    newChapters[chapterIndex].subchapters[subchapterIndex][field] = value;
    setFieldValue('chapters', newChapters);
    setFieldTouched(`chapters[${chapterIndex}].subchapters[${subchapterIndex}].${field}`, true);
  };

  const handleCreateNewSubjectFunction = async (details) => {
    let json = cleanObject(details);
    json.classRoom = Number(json?.classRoom);
    const response = await createNewSubjectAction(json);
    if (response[2] === 201) {
      toast.success(response[1]?.message);
      resetForm();
    } else {
      toast.error(response[1]?.message || 'unable to add a subject');
    }
  };

  const fileUploadHandler = (event) => {
    let file = event?.target?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let excelData = XLSX.utils.sheet_to_json(worksheet);
        let mappingsData = {};

        _.forEach(excelData, (row) => {
          if (_.has(mappingsData, row.chapter)) {
            let subchapter = {
              title: row?.subChapter_title || '',
              content: row?.subChapter_content || '',
              imageURL: row?.subChapter_imageURL || '',
            };
            mappingsData[row.chapter].subchapters.push(subchapter);
          } else {
            let subchapters = [
              {
                title: row?.subChapter_title || '',
                content: row?.subChapter_content || '',
                imageURL: row?.subChapter_imageURL || '',
              },
            ];
            mappingsData[row?.chapter] = {
              title: row?.title || '',
              content: row?.content || '',
              imageURL: row?.imageURL || '',
              subchapters,
            };
          }
        });

        let finalData = _.values(mappingsData);
        let updatedValues = {
          ...values,
          chapters: [...values.chapters, ...finalData],
        };

        setInfo((prev) => ({
          ...prev,
          initialValues: updatedValues,
        }));
      };
      reader.readAsBinaryString(file);
    }

    fileUploadRef.current.value = null;
    toast.success('added successfully');
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Subject</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Subject Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Mathematics"
                  className={touched.name && errors.name ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {touched.name && errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Subject Code *</Label>
                <Input
                  id="code"
                  name="code"
                  value={values.code?.toUpperCase()}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. MATH101"
                  className={touched.code && errors.code ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {touched.code && errors.code && (
                  <p className="text-sm text-red-500">{errors.code}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={6}
                placeholder="Brief description of the subject"
                className={
                  touched.description && errors.description
                    ? 'border-red-500  resize-none'
                    : 'resize-none'
                }
                disabled={isSubmitting}
              />
              {touched.description && errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="classRoom">Class *</Label>
                <Select
                  value={values.classRoom}
                  onValueChange={(value) => setFieldValue('classRoom', value)}
                  onBlur={() => setFieldTouched('classRoom', true)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    className={touched.classRoom && errors.classRoom ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classrooms.map((cls) => (
                      <SelectItem key={cls} value={cls.toString()}>
                        Class {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touched.classRoom && errors.classRoom && (
                  <p className="text-sm text-red-500">{errors.classRoom}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="boardType">Board *</Label>
                <Select
                  value={values.boardType}
                  onValueChange={(value) => setFieldValue('boardType', value)}
                  onBlur={() => setFieldTouched('boardType', true)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    className={touched.boardType && errors.boardType ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="Select board" />
                  </SelectTrigger>
                  <SelectContent>
                    {boards.map((board) => (
                      <SelectItem key={board?._id} value={board._id}>
                        {board?.name || ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touched.boardType && errors.boardType && (
                  <p className="text-sm text-red-500">{errors.boardType}</p>
                )}
              </div>
            </div>
            {/* Chapters Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Chapters *</h3>

                <div className="flex gap-6">
                  <input type="file" hidden ref={fileUploadRef} onChange={fileUploadHandler} />
                  <Button
                    type="button"
                    variant="outline"
                    className=" bg-purple-200 hover:bg-purple-300"
                    onClick={() => window.open(DownloadFile, '_blank')}
                  >
                    Download Demo File
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileUploadRef.current.click()}
                  >
                    Add Through File
                  </Button>
                  <Button
                    type="button"
                    onClick={addChapter}
                    variant="outline"
                    disabled={isSubmitting}
                  >
                    Add Chapter
                  </Button>
                </div>
              </div>

              {touched.chapters && errors.chapters && typeof errors.chapters === 'string' && (
                <p className="text-sm text-red-500">{errors.chapters}</p>
              )}

              {values.chapters.map((chapter, chapterIndex) => (
                <Card key={chapterIndex} className="bg-gray-50">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle>Chapter {chapterIndex + 1}</CardTitle>
                      <Button
                        type="button"
                        onClick={() => removeChapter(chapterIndex)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        disabled={isSubmitting}
                      >
                        Remove
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`chapters[${chapterIndex}].title`}>Title *</Label>
                      <Input
                        id={`chapters[${chapterIndex}].title`}
                        value={chapter.title}
                        onChange={(e) => updateChapter(chapterIndex, 'title', e.target.value)}
                        onBlur={() => setFieldTouched(`chapters[${chapterIndex}].title`, true)}
                        placeholder="Chapter title"
                        className={
                          touched.chapters?.[chapterIndex]?.title &&
                          errors.chapters?.[chapterIndex]?.title
                            ? 'border-red-500'
                            : ''
                        }
                        disabled={isSubmitting}
                      />
                      {touched.chapters?.[chapterIndex]?.title &&
                        errors.chapters?.[chapterIndex]?.title && (
                          <p className="text-sm text-red-500">
                            {errors.chapters[chapterIndex].title}
                          </p>
                        )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`chapters[${chapterIndex}].content`}>Content *</Label>
                      <Textarea
                        id={`chapters[${chapterIndex}].content`}
                        value={chapter.content}
                        onChange={(e) => updateChapter(chapterIndex, 'content', e.target.value)}
                        onBlur={() => setFieldTouched(`chapters[${chapterIndex}].content`, true)}
                        placeholder="Chapter content description"
                        className={
                          touched.chapters?.[chapterIndex]?.content &&
                          errors.chapters?.[chapterIndex]?.content
                            ? 'border-red-500'
                            : ''
                        }
                        disabled={isSubmitting}
                      />
                      {touched.chapters?.[chapterIndex]?.content &&
                        errors.chapters?.[chapterIndex]?.content && (
                          <p className="text-sm text-red-500">
                            {errors.chapters[chapterIndex].content}
                          </p>
                        )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`chapters[${chapterIndex}].imageURL`}>Image URL</Label>
                      <Input
                        id={`chapters[${chapterIndex}].imageURL`}
                        value={chapter.imageURL}
                        onChange={(e) => updateChapter(chapterIndex, 'imageURL', e.target.value)}
                        onBlur={() => setFieldTouched(`chapters[${chapterIndex}].imageURL`, true)}
                        placeholder="https://example.com/images/chapter.jpg"
                        type="url"
                        className={
                          touched.chapters?.[chapterIndex]?.imageURL &&
                          errors.chapters?.[chapterIndex]?.imageURL
                            ? 'border-red-500'
                            : ''
                        }
                        disabled={isSubmitting}
                      />
                      {touched.chapters?.[chapterIndex]?.imageURL &&
                        errors.chapters?.[chapterIndex]?.imageURL && (
                          <p className="text-sm text-red-500">
                            {errors.chapters[chapterIndex].imageURL}
                          </p>
                        )}
                    </div>

                    {/* Subchapters Section */}
                    <div className="space-y-4 mt-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-md font-medium">Subchapters *</h4>
                        <Button
                          type="button"
                          onClick={() => addSubchapter(chapterIndex)}
                          variant="outline"
                          size="sm"
                          disabled={isSubmitting}
                        >
                          Add Subchapter
                        </Button>
                      </div>

                      {touched.chapters?.[chapterIndex]?.subchapters &&
                        errors.chapters?.[chapterIndex]?.subchapters &&
                        typeof errors.chapters[chapterIndex].subchapters === 'string' && (
                          <p className="text-sm text-red-500">
                            {errors.chapters[chapterIndex].subchapters}
                          </p>
                        )}

                      {chapter.subchapters.map((subchapter, subchapterIndex) => (
                        <div
                          key={subchapterIndex}
                          className="pl-4 border-l-2 border-gray-200 space-y-3"
                        >
                          <div className="flex justify-between items-center">
                            <h5 className="text-sm font-medium">
                              Subchapter {subchapterIndex + 1}
                            </h5>
                            <Button
                              type="button"
                              onClick={() => removeSubchapter(chapterIndex, subchapterIndex)}
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              disabled={isSubmitting}
                            >
                              Remove
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor={`chapters[${chapterIndex}].subchapters[${subchapterIndex}].title`}
                            >
                              Title *
                            </Label>
                            <Input
                              id={`chapters[${chapterIndex}].subchapters[${subchapterIndex}].title`}
                              value={subchapter.title}
                              onChange={(e) =>
                                updateSubchapter(
                                  chapterIndex,
                                  subchapterIndex,
                                  'title',
                                  e.target.value
                                )
                              }
                              onBlur={() =>
                                setFieldTouched(
                                  `chapters[${chapterIndex}].subchapters[${subchapterIndex}].title`,
                                  true
                                )
                              }
                              placeholder="Subchapter title"
                              className={
                                touched.chapters?.[chapterIndex]?.subchapters?.[subchapterIndex]
                                  ?.title &&
                                errors.chapters?.[chapterIndex]?.subchapters?.[subchapterIndex]
                                  ?.title
                                  ? 'border-red-500'
                                  : ''
                              }
                              disabled={isSubmitting}
                            />
                            {touched.chapters?.[chapterIndex]?.subchapters?.[subchapterIndex]
                              ?.title &&
                              errors.chapters?.[chapterIndex]?.subchapters?.[subchapterIndex]
                                ?.title && (
                                <p className="text-sm text-red-500">
                                  {errors.chapters[chapterIndex].subchapters[subchapterIndex].title}
                                </p>
                              )}
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor={`chapters[${chapterIndex}].subchapters[${subchapterIndex}].content`}
                            >
                              Content *
                            </Label>
                            <Textarea
                              id={`chapters[${chapterIndex}].subchapters[${subchapterIndex}].content`}
                              value={subchapter.content}
                              onChange={(e) =>
                                updateSubchapter(
                                  chapterIndex,
                                  subchapterIndex,
                                  'content',
                                  e.target.value
                                )
                              }
                              onBlur={() =>
                                setFieldTouched(
                                  `chapters[${chapterIndex}].subchapters[${subchapterIndex}].content`,
                                  true
                                )
                              }
                              placeholder="Subchapter content description"
                              className={
                                touched.chapters?.[chapterIndex]?.subchapters?.[subchapterIndex]
                                  ?.content &&
                                errors.chapters?.[chapterIndex]?.subchapters?.[subchapterIndex]
                                  ?.content
                                  ? 'border-red-500'
                                  : ''
                              }
                              disabled={isSubmitting}
                            />
                            {touched.chapters?.[chapterIndex]?.subchapters?.[subchapterIndex]
                              ?.content &&
                              errors.chapters?.[chapterIndex]?.subchapters?.[subchapterIndex]
                                ?.content && (
                                <p className="text-sm text-red-500">
                                  {
                                    errors.chapters[chapterIndex].subchapters[subchapterIndex]
                                      .content
                                  }
                                </p>
                              )}
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor={`chapters[${chapterIndex}].subchapters[${subchapterIndex}].imageURL`}
                            >
                              Image URL
                            </Label>
                            <Input
                              id={`chapters[${chapterIndex}].subchapters[${subchapterIndex}].imageURL`}
                              value={subchapter.imageURL}
                              onChange={(e) =>
                                updateSubchapter(
                                  chapterIndex,
                                  subchapterIndex,
                                  'imageURL',
                                  e.target.value
                                )
                              }
                              onBlur={() =>
                                setFieldTouched(
                                  `chapters[${chapterIndex}].subchapters[${subchapterIndex}].imageURL`,
                                  true
                                )
                              }
                              placeholder="https://example.com/images/subchapter.jpg"
                              type="url"
                              className={
                                touched.chapters?.[chapterIndex]?.subchapters?.[subchapterIndex]
                                  ?.imageURL &&
                                errors.chapters?.[chapterIndex]?.subchapters?.[subchapterIndex]
                                  ?.imageURL
                                  ? 'border-red-500'
                                  : ''
                              }
                              disabled={isSubmitting}
                            />
                            {touched.chapters?.[chapterIndex]?.subchapters?.[subchapterIndex]
                              ?.imageURL &&
                              errors.chapters?.[chapterIndex]?.subchapters?.[subchapterIndex]
                                ?.imageURL && (
                                <p className="text-sm text-red-500">
                                  {
                                    errors.chapters[chapterIndex].subchapters[subchapterIndex]
                                      .imageURL
                                  }
                                </p>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 mt-8">
            <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Subject'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SubjectForm;
