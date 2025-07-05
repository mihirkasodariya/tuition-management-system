import React, { useCallback, useState, useEffect, memo } from 'react';
import { Button } from '@/components/ui/button';
import MetaData from '@/utils/MetaData';
import CreateNotesModal from '@/views/features/builder/notes/CreateNotesModal';
import MainWrapper from '@/views/layouts/Mainwrapper';
import { useDispatch, useSelector } from 'react-redux';
import { builderActions } from '@/redux/combineActions';
import CustomTable1 from '@/views/components/tables/TableV1';
import moment from 'moment';
import { format } from 'timeago.js';
import { Trash, Pencil, Eye, FilePenLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const breadCrumbs = [{ label: 'Notes', href: null }];
const headers = [
  { title: 'Title', key: 'title' },
  { title: 'Description', key: 'description' },
  { title: 'Date', key: 'date' },
  { title: 'Time Ago', key: 'timeAgo' },
];

const TableRow = memo(({ row, onDelete, onClickNavigationFunction }) => (
  <div className="flex gap-4">
    <Button onClick={() => onClickNavigationFunction(row, 'noteView')}>
      <Eye />{' '}
    </Button>
    <Button onClick={() => onClickNavigationFunction(row, 'noteEdit')}>
      <FilePenLine />
    </Button>
    <Button variant="outline" onClick={() => onClickNavigationFunction(row, 'edit')}>
      <Pencil color="black" className="cursor-pointer size-5" />
    </Button>
    <Button variant="outline">
      <Trash color="red" className="cursor-pointer size-5" onClick={() => onDelete(row)} />
    </Button>
  </div>
));

const NotesList = () => {
  const { fetchNotesAction, updateBuilderStateAction } = builderActions;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notesList, loading } = useSelector((state) => state.builderToolkitState);

  const [info, setInfo] = useState({
    openCreateModal: false,
    isSubmitting: false,
    noteDetails: null,
    loading: true,
    limit: 20,
    currentPage: 1,
  });

  useEffect(() => {
    if (!notesList && notesList?.currentPage !== 1) {
      fetchNotesListHandler();
    }
  }, []);

  const fetchNotesListHandler = useCallback(
    async (queryObject) => {
      let query = {
        page: queryObject?.currentPage ?? info?.currentPage,
        limit: queryObject?.limit ?? info?.limit,
      };
      dispatch(fetchNotesAction(query));
    },
    [notesList, info?.currentPage, info?.limit]
  );

  const paginationFunctionHandler = useCallback(
    (currentPage) => {
      let update = { currentPage };
      setInfo((prev) => ({ ...prev, ...update }));
      fetchNotesListHandler(update);
    },
    [info?.page]
  );

  const openCreateNoteModalFunction = useCallback(() => {
    setInfo((prev) => ({
      ...prev,
      openCreateModal: true,
    }));
  }, [info?.openCreateModal]);

  const onClickNavigationFunction = useCallback(
    (row, type) => {
      if (type === 'noteView') {
        navigate(`/notes/${row?.slug}`);

        dispatch(
          updateBuilderStateAction({
            singleTemplateData: row,
            templateSections: row?.templateSections,
          })
        );
      } else if (type === 'noteEdit') {
        navigate(`/builder/${row?.slug}`);

        dispatch(
          updateBuilderStateAction({
            singleTemplateData: row,
            templateSections: row?.templateSections,
          })
        );
      } else if (type === 'edit') {
        setInfo((prev) => ({
          ...prev,
          openCreateModal: true,
          noteDetails: row,
        }));
      }
    },
    [info?.openCreateModal, info?.noteDetails]
  );

  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <MetaData title="Notes | AcademIQ" />

      <div className="flex justify-end">
        <Button onClick={openCreateNoteModalFunction}>Add New Notes</Button>
      </div>

      <div>
        <CustomTable1
          headers={headers}
          docs={notesList?.docs?.map((singleData) => ({
            ...singleData,
            date: moment(singleData?.createdAt).format('LL'),
            timeAgo: format(singleData?.createdAt),
          }))}
          cardTitle="Notes List Data"
          loading={loading}
          totalPages={notesList?.totalPages}
          currentPage={notesList?.currentPage}
          onPageChange={paginationFunctionHandler}
          limit={info?.limit}
          actions={(row) => (
            <TableRow
              row={row}
              onDelete={() => {}}
              onClickNavigationFunction={onClickNavigationFunction}
            />
          )}
        />
      </div>

      <CreateNotesModal info={info} setInfo={setInfo} />
    </MainWrapper>
  );
};

export default memo(NotesList);
