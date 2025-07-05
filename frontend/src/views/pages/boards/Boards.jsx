import React, { useEffect, useCallback, memo, useState } from 'react';
import MainWrapper from '../../layouts/Mainwrapper';
import { useSelector, useDispatch } from 'react-redux';
import { boardActions } from '@/redux/combineActions';
import BoardList from '../../features/board/BoardList';
import AddNewBoard from '../../features/board/AddNewBoard';
import MetaData from '@/utils/MetaData';
import _ from 'lodash';

const breadCrumbs = [{ label: 'Boards', href: null }];
const BoardsPage = () => {
  const { getBoardsListAction } = boardActions;
  const dispatch = useDispatch();
  const { boardsList } = useSelector((state) => state.boardState);

  const [info, setInfo] = useState({
    searchTerm: '',
    openCreateModal: false,
    boardName: '',
    boardDescription: '',
    isSubmitting: false,
    selectedBoardId: null,
  });

  useEffect(() => {
    if (!boardsList) {
      fetchBoardsListHandler();
    }
  }, []);

  const fetchBoardsListHandler = useCallback(async () => {
    dispatch(getBoardsListAction());
  }, [boardsList]);

  const openCloseCreateModal = useCallback(
    (open = true) => {
      const updateDetails = {};
      if (open) {
        updateDetails.openCreateModal = true;
      } else {
        updateDetails.openCreateModal = false;
        updateDetails.boardName = '';
        updateDetails.boardDescription = '';
        updateDetails.selectedBoardId = null;
      }

      setInfo((prev) => ({
        ...prev,
        ...updateDetails,
      }));
    },
    [info?.openCreateModal, info?.boardName, info?.boardDescription]
  );

  const editBoardModal = useCallback(
    (boardId) => {
      const updateDetails = {};
      let boardDetails = _.find(boardsList, { _id: boardId });
      updateDetails.openCreateModal = true;
      updateDetails.selectedBoardId = boardId;
      updateDetails.boardName = boardDetails?.name;
      updateDetails.boardDescription = boardDetails?.description;

      setInfo((prev) => ({
        ...prev,
        ...updateDetails,
      }));
    },
    [
      info?.openCreateModal,
      info?.boardName,
      info?.boardDescription,
      info?.selectedBoardId,
      boardsList,
    ]
  );

  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <MetaData title="Admin Boards | AcademIQ" />
      <BoardList
        info={info}
        setInfo={setInfo}
        openCloseCreateModal={openCloseCreateModal}
        editBoardModal={editBoardModal}
      />
      <AddNewBoard info={info} setInfo={setInfo} openCloseCreateModal={openCloseCreateModal} />
    </MainWrapper>
  );
};

export default memo(BoardsPage);
