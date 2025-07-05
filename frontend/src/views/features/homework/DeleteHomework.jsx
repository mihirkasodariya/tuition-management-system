import React, { memo, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import ModalV1 from '@/views/components/modal/ModalV1';
import { studentActions } from '@/redux/combineActions';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import _ from 'lodash';
import { Loader2 } from 'lucide-react';

const DeleteHomework = ({ info, closeModalFunction }) => {
  const [loading, setLoading] = useState(false);

  const { deleteHomeworkAction, updateStudentStateAction } = studentActions;
  const { homeworkList } = useSelector((state) => state.studentState);
  const dispatch = useDispatch();

  const deleteHomeworkSubmitHandler = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    const response = await deleteHomeworkAction(info?.homeworkDetails?._id);
    setLoading(false);
    if (response[0] === true) {
      let updateList = _.cloneDeep(homeworkList);
      updateList.docs = updateList?.docs?.filter(
        (item) => item?._id !== info?.homeworkDetails?._id
      );
      dispatch(updateStudentStateAction({ homeworkList: updateList }));
      closeModalFunction();
    } else {
      toast.error(response[1]?.message || 'unable to delete the  homework');
    }
  }, [loading, info?.homeworkDetails, homeworkList]);
  return (
    <ModalV1
      isOpen={info?.deleteModal}
      onClose={closeModalFunction}
      title="Delete Homework"
      maxHeight="fit-content"
      closeOutside={false}
      size="small"
    >
      <div className="p-4"></div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Are you sure you want to delete this homework?</h2>
        <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
        <p className="text-sm">
          <span className=" font-medium">Title : </span>
          {info?.homeworkDetails?.title}
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <Button onClick={closeModalFunction}>Cancel</Button>
        <Button
          variant={'destructive'}
          disabled={loading}
          className={loading ? ' cursor-not-allowed' : ''}
          onClick={deleteHomeworkSubmitHandler}
        >
          {loading ? (
            <>
              {' '}
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting ...{' '}
            </>
          ) : (
            'Delete'
          )}
        </Button>
      </div>
    </ModalV1>
  );
};

export default memo(DeleteHomework);
