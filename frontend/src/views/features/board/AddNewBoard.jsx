import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ModalV1 from '@/views/components/modal/ModalV1';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Loader2 } from 'lucide-react';
import { boardActions } from '@/redux/combineActions';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { BOARD_LIST } from '@/redux/boards/constant';
import _ from 'lodash';

const AddNewBoard = ({ info, openCloseCreateModal }) => {
  const dispatch = useDispatch();
  const { boardsList } = useSelector((state) => state.boardState);
  const { createNewBoardAction, updateBoardAction } = boardActions;

  const validateSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .required('Board name is required'),
    description: Yup.string().max(200, 'Description cannot exceed 200 characters'),
  });

  const formik = useFormik({
    initialValues: {
      name: info?.boardName || '',
      description: info?.boardDescription || '',
    },
    enableReinitialize: true,
    validationSchema: validateSchema,
    onSubmit: async (values) => {
      let json = {
        name: values?.name,
        description: values?.description,
      };

      if (info?.selectedBoardId) {
        await updateSubmitHandlerFunction(json);
      } else {
        await submitHandlerFunction(json);
      }
    },
  });
  const { errors, values, touched, handleChange, handleSubmit, handleBlur, resetForm } = formik;

  const submitHandlerFunction = async (json) => {
    let response = await createNewBoardAction(json);
    if (response[2] === 201) {
      let updateData = _.cloneDeep(boardsList);
      openCloseCreateModal(false);
      resetForm();
      updateData.unshift(response[1]?.data);
      dispatch({ type: BOARD_LIST.update, payload: updateData });
    } else {
      toast.error(response[1]?.message || 'unable to add to a board');
    }
  };

  const updateSubmitHandlerFunction = async (json) => {
    // const isNameExists = boardsList.some(
    //   (board) => board.name.toLowerCase() === json.name.toLowerCase()
    // );
    // if (isNameExists) {
    //   toast.error('Board name already exists');
    //   return;
    // }

    let response = await updateBoardAction(info?.selectedBoardId, json);
    if (response[0]) {
      let updateData = _.cloneDeep(boardsList)?.map((item) => {
        if (item._id === info?.selectedBoardId) {
          return response[1]?.data;
        } else {
          return item;
        }
      });
      openCloseCreateModal(false);
      resetForm();
      dispatch({ type: BOARD_LIST.update, payload: updateData });
    } else {
      toast.error(response[1]?.message || 'unable to add to a board');
    }
  };

  return (
    <ModalV1
      isOpen={info?.openCreateModal}
      onClose={() => {
        openCloseCreateModal(false);
        resetForm();
      }}
      title={info?.selectedBoardId ? 'Update Board Details' : 'Create New Board'}
      size="small"
      maxHeight="fit-content"
    >
      <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name" className="block text-sm font-medium">
            Board Name *
          </Label>
          <Input
            id="name"
            placeholder="Enter board name"
            value={values?.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${errors.name ? 'border-red-500' : ''}`}
            readOnly={info?.isSubmitting}
          />
          {touched?.name && errors?.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
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
          <p className="text-sm text-muted-foreground">Optional description for your board</p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          {!info?.selectedBoardId ? (
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
                  'Create Board'
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
                'Update Board'
              )}
            </Button>
          )}
        </div>
      </form>
    </ModalV1>
  );
};

export default memo(AddNewBoard);
