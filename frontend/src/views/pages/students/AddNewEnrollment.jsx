import React, { memo, useCallback, useEffect, useState } from 'react';
import ModalV1 from '@/views/components/modal/ModalV1';
import { useSelector, useDispatch } from 'react-redux';
import { subjectActions } from '@/redux/combineActions';
import { Checkbox } from '@/components/ui/checkbox';
import _ from 'lodash';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const AddNewEnrollment = ({
  studentId,
  info,
  setInfo,
  batches,
  studentDetails,
  submitEnrollmentFunctionHandler,
}) => {
  const dispatch = useDispatch();
  const { getPublicSubjectsListAction } = subjectActions;

  const { publicSubjectsList } = useSelector((state) => state.subjectState);
  const { enrollmentsList } = useSelector((state) => state.studentState);

  const [currentDetails, setCurrentDetails] = useState({
    activeBatch: '',
    subjectsSelected: {},
  });

  useEffect(() => {
    if (
      info?.registerEnrollmentModal === true &&
      batches &&
      (!publicSubjectsList || publicSubjectsList?.boardType !== studentDetails?.boardType?._id)
    ) {
      let query = {
        boardType: studentDetails?.boardType?._id,
        classRoom: studentDetails?.class,
        batch: _.find(batches, { isActive: true })?._id,
      };
      fetchSubjectsListHandler(query);
    }
  }, [studentId, info?.registerEnrollmentModal]);

  useEffect(() => {
    if (batches) {
      setCurrentDetails((prev) => ({
        ...prev,
        activeBatch: _.find(batches, { isActive: true }),
      }));
    }
  }, [batches]);

  const closeModalFunction = useCallback(() => {
    setInfo((prev) => ({
      ...prev,
      registerEnrollmentModal: false,
    }));

    setCurrentDetails((prev) => ({
      ...prev,
      activeBatch: _.find(batches, { isActive: true }),
      subjectsSelected: {},
    }));
  }, [info?.registerEnrollmentModal]);

  const fetchSubjectsListHandler = useCallback(
    async (query) => {
      dispatch(getPublicSubjectsListAction(query));
    },
    [publicSubjectsList]
  );

  const batchChangeHandler = useCallback(
    async (e) => {
      let query = {
        boardType: studentDetails?.boardType?._id,
        classRoom: studentDetails?.class,
        batch: e.target.value,
      };
      fetchSubjectsListHandler(query);
      setCurrentDetails((prev) => ({
        ...prev,
        activeBatch: _.find(batches, { _id: e.target.value }),
        subjectsSelected: {},
      }));
    },
    [currentDetails?.activeBatch?._id]
  );

  const subjectSelectHandlerFunction = useCallback(
    (e, subjectId) => {
      let updateSubjects = _.cloneDeep(currentDetails?.subjectsSelected);
      if (e) {
        updateSubjects[subjectId] = e;
      } else {
        updateSubjects = _.omit(updateSubjects, subjectId);
      }
      setCurrentDetails((prev) => ({ ...prev, subjectsSelected: updateSubjects }));
    },
    [currentDetails?.subjectsSelected]
  );

  const submitHandler = () => {
    if (info?.createEnrollmentLoading) return;
    let details = {
      batch: currentDetails?.activeBatch?._id,
      studentId,
      subjects: _.keys(currentDetails?.subjectsSelected),
    };

    submitEnrollmentFunctionHandler(details);
  };

  return (
    <ModalV1
      isOpen={info?.registerEnrollmentModal}
      onClose={closeModalFunction}
      title="Add New Enrollment"
      size="small"
      maxHeight="fit-content"
    >
      <div className="container py-4">
        <div>Class : {studentDetails?.class}</div>
        <div>Board : {studentDetails?.boardType?.name}</div>
        <div>Batch : {currentDetails?.activeBatch?.name}</div>

        <div className="my-4">
          <Label className="mb-2">Select Batch</Label>
          <select
            id="countries"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={currentDetails?.activeBatch?._id}
            onChange={batchChangeHandler}
          >
            <option disabled>Select Batch</option>
            {batches &&
              enrollmentsList &&
              batches?.map((singleBatch) => (
                <option
                  value={singleBatch?._id}
                  selected={currentDetails?.activeBatch?._id === singleBatch?._id}
                  disabled={
                    _.some(
                      enrollmentsList?.docs,
                      (item) => item?.batch?._id === singleBatch?._id
                    ) || false
                  }
                >
                  {singleBatch?.name}
                </option>
              ))}
          </select>
        </div>

        <div className="grid gap-2 md:col-span-2 mt-2">
          <Label>Select Subjects :</Label>
          <div className="flex flex-wrap gap-4 mt-1">
            {publicSubjectsList &&
              publicSubjectsList?.docs?.[studentDetails?.class]?.map((singleSubject) => (
                <div key={singleSubject?._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`singleBatch-${singleSubject?._id}`}
                    checked={currentDetails?.subjectsSelected?.[singleSubject?._id] || false}
                    onCheckedChange={(checked) =>
                      subjectSelectHandlerFunction(checked, singleSubject?._id)
                    }
                    //   disabled={info?.isSubmitting}
                    //   readOnly={info?.isReadOnly}
                  />
                  <Label htmlFor={`singleBatch-${singleSubject?._id}`} className="capitalize">
                    {singleSubject?.name}
                  </Label>
                </div>
              ))}
          </div>
        </div>

        {_.size(publicSubjectsList?.docs?.[studentDetails?.class]) > 0 && (
          <div className="w-full mt-6 flex justify-center border-t pt-4">
            <Button disabled={info?.createEnrollmentLoading} onClick={submitHandler}>
              {info?.createEnrollmentLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        )}
      </div>
    </ModalV1>
  );
};

export default memo(AddNewEnrollment);
