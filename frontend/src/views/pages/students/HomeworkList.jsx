import React, { useEffect, useCallback, memo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { studentActions } from '@/redux/combineActions';
import moment from 'moment';
import _ from 'lodash';
import { format } from 'timeago.js';
import { useParams } from 'react-router-dom';
import MetaData from '@/utils/MetaData';
import CustomTable1 from '@/views/components/tables/TableV1';
import { Button } from '@/components/ui/button';
import CreateHomework from '@/views/features/homework/CreateHomework';
import { Trash, Pencil } from 'lucide-react';
import DeleteHomework from '@/views/features/homework/DeleteHomework';

const headers = [
  { title: 'Title', key: 'title' },
  { title: 'Deadline', key: 'deadline' },
  { title: 'Date', key: 'date' },
  { title: 'Time Ago', key: 'timeAgo' },
  { title: 'Rating', key: 'rating' },
];

const TableRow = memo(({ row, editHomeworkFunction, deleteHomeworkFunction }) => (
  <div className="flex gap-4">
    <Button variant="outline" onClick={() => editHomeworkFunction(row)}>
      <Pencil color="black" className="cursor-pointer size-5" />
    </Button>
    <Button variant="outline" onClick={() => deleteHomeworkFunction(row)}>
      <Trash color="red" className="cursor-pointer size-5" />
    </Button>
  </div>
));

const HomeworkList = () => {
  const { getStudentHomeworkListAction } = studentActions;

  const dispatch = useDispatch();
  const { studentId } = useParams();
  const { homeworkList, loading } = useSelector((state) => state.studentState);

  const [info, setInfo] = useState({
    limit: 10,
    currentPage: 1,
    openModal: false,
    deleteModal: false,
    isSubmitting: false,
    initialValues: {
      title: '',
      description: '',
      deadline: moment().add(1, 'days').format('YYYY-MM-DD'),
    },
    homeworkDetails: null,
    feedbackRating: null,
    feedbackLoading: false,
  });

  useEffect(() => {
    if ((!homeworkList && homeworkList?._id !== studentId) || homeworkList?.currentPage !== 1) {
      fetchHomeworkListHandler();
    }
  }, [studentId]);

  const fetchHomeworkListHandler = useCallback(
    async (queryObject = {}) => {
      let query = {
        page: queryObject?.currentPage ?? info?.currentPage,
        limit: queryObject?.limit ?? info?.limit,
        student: studentId,
      };
      dispatch(getStudentHomeworkListAction(query, query));
    },
    [studentId, homeworkList, info?.currentPage, info?.limit]
  );

  const paginationFunctionHandler = useCallback(
    (page) => {
      let queryObject = {
        currentPage: page,
      };

      setInfo((prev) => ({
        ...prev,
        ...queryObject,
      }));
      fetchHomeworkListHandler(queryObject);
    },
    [info?.currentPage]
  );

  const closeModalFunction = useCallback(() => {
    setInfo((prev) => ({
      ...prev,
      openModal: false,
      deleteModal: false,
      isSubmitting: false,
      homeworkDetails: null,
      feedbackRating: null,
      feedbackLoading: false,
      initialValues: {
        title: '',
        description: '',
        deadline: moment().add(1, 'days').format('YYYY-MM-DD'),
      },
    }));
  }, [info?.openModal, info?.isSubmitting, info?.initialValues, info?.deleteModal]);

  const editHomeworkFunction = useCallback(
    (row) => {
      setInfo((prev) => ({
        ...prev,
        homeworkDetails: row,
        feedbackRating: {
          rating: 4,
          feedback: '',
        },
        openModal: true,
        initialValues: {
          title: row?.title,
          description: row?.description,
          deadline: moment(row?.deadline).add(1, 'days').format('YYYY-MM-DD'),
        },
      }));
    },
    [info?.initialValues]
  );

  const deleteHomeworkFunction = useCallback(
    (row) => {
      setInfo((prev) => ({
        ...prev,
        deleteModal: true,
        homeworkDetails: row,
      }));
    },
    [homeworkList, info?.deleteModal]
  );

  return (
    <div>
      <div className="my-3 flex justify-end">
        <Button onClick={() => setInfo({ ...info, openModal: true })}>Create Homework</Button>
      </div>

      <MetaData title={`Admin Student Homework | AcademIQ `} />

      <CustomTable1
        headers={headers}
        docs={homeworkList?.docs?.map((singleData) => ({
          ...singleData,
          deadline: moment(singleData?.deadline).format('LLL'),
          date: moment(singleData?.createdAt).format('L'),
          timeAgo: format(singleData?.createdAt),
        }))}
        cardTitle="Homework List"
        loading={loading}
        totalPages={homeworkList?.totalPages}
        currentPage={homeworkList?.currentPage}
        onPageChange={paginationFunctionHandler}
        limit={info?.limit}
        actions={(row) => (
          <TableRow
            row={row}
            editHomeworkFunction={editHomeworkFunction}
            deleteHomeworkFunction={deleteHomeworkFunction}
          />
        )}
      />

      <CreateHomework info={info} setInfo={setInfo} closeModalFunction={closeModalFunction} />
      <DeleteHomework info={info} closeModalFunction={closeModalFunction} />
    </div>
  );
};

export default memo(HomeworkList);
