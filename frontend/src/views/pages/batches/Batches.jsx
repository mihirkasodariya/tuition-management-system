import React, { useEffect, useCallback, memo, useState } from 'react';
import MainWrapper from '../../layouts/Mainwrapper';
import BatchesList from '../../features/batch/BatchesList';
import { useSelector, useDispatch } from 'react-redux';
import { batchActions } from '@/redux/combineActions';
import MetaData from '@/utils/MetaData';

const breadCrumbs = [{ label: 'Batches', href: null }];
const Batches = () => {
  const { getBatchesListAction } = batchActions;
  const dispatch = useDispatch();
  const { batchesList } = useSelector((state) => state.batchState);

  const [info, setInfo] = useState({
    searchTerm: '',
  });

  useEffect(() => {
    if (!batchesList) {
      fetchBatchesListHandler();
    }
  }, []);

  const fetchBatchesListHandler = useCallback(async () => {
    dispatch(getBatchesListAction());
  }, [batchesList]);

  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <MetaData title="Batches | AcademIQ" />
      <BatchesList info={info} setInfo={setInfo} />
    </MainWrapper>
  );
};

export default memo(Batches);
