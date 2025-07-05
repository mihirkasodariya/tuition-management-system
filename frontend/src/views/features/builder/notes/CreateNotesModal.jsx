import React, { memo, useCallback } from 'react';
import ModalV1 from '@/views/components/modal/ModalV1';
import { useDispatch, useSelector } from 'react-redux';
import { builderActions } from '@/redux/combineActions';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import slugify from 'slugify';
import toast from 'react-hot-toast';
import _ from 'lodash';

const CreateNotesModal = ({ info, setInfo }) => {
  const dispatch = useDispatch();
  const { notesList } = useSelector((state) => state.builderToolkitState);
  const { createNewNotesAction, updateBuilderStateAction, updateNoteIdAction } = builderActions;

  const validateSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, 'title must be at least 3 characters')
      .max(50, 'title cannot exceed 50 characters')
      .required('title name is required'),
    description: Yup.string()
      .max(200, 'Description cannot exceed 200 characters')
      .required('description is required'),
  });

  const formik = useFormik({
    initialValues: {
      title: info?.noteDetails?.title || '',
      description: info?.noteDetails?.description || '',
    },
    enableReinitialize: true,
    validationSchema: validateSchema,
    onSubmit: async (values) => {
      let json = {
        description: values?.description,
      };

      if (info?.noteDetails) {
        if (values?.title !== info?.noteDetails?.title) json.title = values?.title;
        await updateSubmitHandlerFunction(json);
      } else {
        json.noteName = values?.title;
        await submitHandlerFunction(json);
      }
    },
  });
  const { errors, values, touched, handleChange, handleSubmit, handleBlur, resetForm } = formik;

  const submitHandlerFunction = useCallback(
    async (json) => {
      if (info?.isSubmitting) return;
      setInfo((prev) => ({
        ...prev,
        isSubmitting: true,
      }));
      let response = await createNewNotesAction(json);
      if (response[2] === 201) {
        toast.success('successfully created a new notes');
        let updatedDatedList = _.cloneDeep(notesList);
        updatedDatedList?.docs?.unshift(response[1]?.data);
        dispatch(updateBuilderStateAction({ notesList: updatedDatedList }));
        resetForm();
      } else {
        toast.error(response[1]?.message || 'unable to add to a new notes');
      }
      setInfo((prev) => ({
        ...prev,
        isSubmitting: false,
        openCreateModal: response[2] === 201 ? false : true,
      }));
    },
    [info?.isSubmitting]
  );

  const updateSubmitHandlerFunction = useCallback(
    async (json) => {
      if (info?.isSubmitting) return;
      setInfo((prev) => ({
        ...prev,
        isSubmitting: true,
      }));
      let response = await updateNoteIdAction(info?.noteDetails?.slug, json);
      if (response[0] === true) {
        let updateData = _.cloneDeep(notesList);
        updateData.docs = updateData?.docs?.map((item) => {
          if (item?.slug === info?.noteDetails?.slug) {
            return response[1]?.data;
          } else {
            return item;
          }
        });
        dispatch(updateBuilderStateAction({ notesList: updateData }));
        resetForm();
        toast.success(response[1]?.message);
      } else {
        toast.error(response[1]?.message || 'unable to update note details');
      }

      setInfo((prev) => ({
        ...prev,
        isSubmitting: false,
        openCreateModal: response[2] === 200 ? false : true,
        noteDetails: response[2] === 200 ? null : info?.noteDetails,
      }));
    },
    [info?.isSubmitting, info?.noteDetails, notesList]
  );

  const closeModalFunction = useCallback(() => {
    setInfo((prev) => ({
      ...prev,
      openCreateModal: false,
      noteDetails: null,
      isSubmitting: false,
    }));
  }, [info?.openCreateModal, info?.noteDetails]);

  return (
    <ModalV1
      isOpen={info?.openCreateModal}
      title={info?.noteDetails ? 'Update Notes' : 'Create New Notes'}
      onClose={closeModalFunction}
      size="small"
      maxHeight="fit-content"
    >
      <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name" className="block text-sm font-medium">
            Notes title *
          </Label>
          <Input
            id="title"
            placeholder="Enter board name"
            value={values?.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${errors.title ? 'border-red-500' : ''}`}
            readOnly={info?.isSubmitting}
          />
          {touched?.title && errors?.title && (
            <p className="text-sm text-red-500 mt-1">{errors?.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="block text-sm font-medium">
            Notes slug *
          </Label>
          <Input
            id="slug"
            placeholder="Enter board name"
            value={slugify(values?.title, { lower: true, strict: true })}
            // onChange={handleChange}
            // onBlur={handleBlur}
            className={`${errors.slug ? 'border-red-500' : ''}`}
            readOnly={true}
            disabled={true}
          />
          {touched?.slug && errors?.slug && (
            <p className="text-sm text-red-500 mt-1">{errors?.slug}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="block text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Enter board description"
            rows={5}
            value={values?.description}
            onChange={handleChange}
            onBlur={handleBlur}
            className="resize-none"
            readOnly={info?.isSubmitting}
          />
          {touched?.description && errors?.description && (
            <p className="text-sm text-red-500 mt-1">{errors?.description}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          {!info?.noteDetails ? (
            <>
              <Button
                type="button"
                variant="outline"
                disabled={info?.isSubmitting || false}
                onClick={resetForm}
              >
                Reset
              </Button>
              <Button type="submit" disabled={info?.isSubmitting || false}>
                {info?.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create New Note'
                )}
              </Button>
            </>
          ) : (
            <Button type="submit" disabled={info?.isSubmitting || false}>
              {info?.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Note'
              )}
            </Button>
          )}
        </div>
      </form>
    </ModalV1>
  );
};

export default memo(CreateNotesModal);
