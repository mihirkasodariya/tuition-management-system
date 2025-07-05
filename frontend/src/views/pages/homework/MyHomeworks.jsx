import React, { useEffect, useCallback, memo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { myDetailsActions } from '@/redux/combineActions';
import moment from 'moment';
import _ from 'lodash';
import { format } from 'timeago.js';
import { useParams } from 'react-router-dom';
import MetaData from '@/utils/MetaData';
import CustomTable1 from '@/views/components/tables/TableV1';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import MainWrapper from '@/views/layouts/Mainwrapper';

const headers = [
  { title: 'Title', key: 'title' },
  { title: 'Deadline', key: 'deadline' },
  { title: 'Date', key: 'date' },
  { title: 'Time Ago', key: 'timeAgo' },
  { title: 'Rating', key: 'rating' },
];

const breadCrumbs = [{ label: 'My Homeworks', href: null }];

const TableRow = memo(({ row }) => (
  <div className="flex gap-4">
    <Button variant="outline">
      <Eye color="black" className="cursor-pointer size-5" />
    </Button>
  </div>
));

const MyHomeworks = () => {
  const { getMyHomeworkListAction } = myDetailsActions;

  const dispatch = useDispatch();
  const { myHomeworkList, loading } = useSelector((state) => state.myDetailsState);

  const [info, setInfo] = useState({
    limit: 10,
    currentPage: 1,
  });

  useEffect(() => {
    if (!myHomeworkList || myHomeworkList?.currentPage !== 1) {
      fetchMyHomeworkListHandler();
    }
  }, []);

  const fetchMyHomeworkListHandler = useCallback(
    async (queryObject = {}) => {
      let query = {
        page: queryObject?.currentPage ?? info?.currentPage,
        limit: queryObject?.limit ?? info?.limit,
      };
      dispatch(getMyHomeworkListAction(query));
    },
    [myHomeworkList, info?.currentPage, info?.limit]
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
      fetchMyHomeworkListHandler(queryObject);
    },
    [info?.currentPage]
  );

  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <MetaData title={`Homework List | AcademIQ `} />
      <br />

      <CustomTable1
        headers={headers}
        docs={myHomeworkList?.docs?.map((singleData) => ({
          ...singleData,
          deadline: moment(singleData?.deadline).format('LLL'),
          date: moment(singleData?.createdAt).format('L'),
          timeAgo: format(singleData?.createdAt),
        }))}
        cardTitle="Homework List"
        loading={loading}
        totalPages={myHomeworkList?.totalPages}
        currentPage={myHomeworkList?.currentPage}
        onPageChange={paginationFunctionHandler}
        limit={info?.limit}
        actions={(row) => <TableRow row={row} />}
      />
    </MainWrapper>
  );
};

export default memo(MyHomeworks);
