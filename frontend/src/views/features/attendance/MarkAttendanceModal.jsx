import React, { memo, useCallback, useEffect } from 'react';
import ModalV1 from '@/views/components/modal/ModalV1';
import { Label } from '@radix-ui/react-dropdown-menu';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { subjectActions } from '@/redux/combineActions';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const MarkAttendanceModal = ({ info, setInfo, updateTheAttendanceHandler }) => {
  const dispatch = useDispatch();
  const { getPublicSubjectDetailAction } = subjectActions;
  const { publicSubjectDetail, loading } = useSelector((state) => state.subjectState);

  useEffect(() => {
    if (
      info?.selectedAttendance?.subject &&
      info?.selectedAttendance?.subject !== publicSubjectDetail?._id
    ) {
      fetchSubjectDetailsHandler(info?.selectedAttendance?.subject);
      setInfo((prev) => ({
        ...prev,
        selectedSubject: info?.selectedAttendance?.subject || null,
        selectedChapter: info?.selectedAttendance?.progress?.chapter || null,
        selectedTopic: info?.selectedAttendance?.progress?.subChapterId || null,
        progressValue: info?.selectedAttendance?.progress?.value || 0,
      }));
    } else if (
      info?.selectedAttendance?.subject &&
      info?.selectedAttendance?.subject === publicSubjectDetail?._id
    ) {
      setInfo((prev) => ({
        ...prev,
        selectedSubject: info?.selectedAttendance?.subject || null,
        selectedChapter: info?.selectedAttendance?.progress?.chapter || null,
        selectedTopic: info?.selectedAttendance?.progress?.subChapterId || null,
        progressValue: info?.selectedAttendance?.progress?.value || 0,
      }));
    }
  }, [info?.selectedAttendance?.subject, publicSubjectDetail]);

  const selectSubjectHandler = useCallback(
    (e) => {
      let value = e?.target?.value || '';
      setInfo((prev) => ({
        ...prev,
        selectedSubject: value,
        selectedChapter: null,
        selectedTopic: null,
        progressValue: 0,
      }));
      if (!publicSubjectDetail || publicSubjectDetail?._id !== value) {
        fetchSubjectDetailsHandler(value);
      }
    },
    [info]
  );

  const selectChapterHandler = useCallback(
    (e) => {
      const { name, value } = e?.target;
      setInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [info]
  );

  const fetchSubjectDetailsHandler = useCallback(
    (subjectId) => {
      dispatch(getPublicSubjectDetailAction(subjectId));
    },
    [publicSubjectDetail]
  );

  const closeModalFunction = useCallback(() => {
    setInfo((prev) => ({
      ...prev,
      isOpen: false,
      selectedAttendance: null,
      selectedSubject: null,
      selectedChapter: null,
      selectedTopic: null,
      progressValue: 0,
    }));
  }, [
    info?.isOpen,
    info?.selectedAttendance,
    info?.selectedSubject,
    info?.selectedChapter,
    info?.selectedTopic,
    info?.progressValue,
  ]);

  return (
    <ModalV1
      title="Mark Attendance"
      isOpen={info?.isOpen}
      onClose={closeModalFunction}
      size="small"
      maxHeight="fit-content"
    >
      <div className="py-4 space-y-4">
        <div className="flex gap-4">
          <Label htmlFor="attendance-id">Attendance ID :</Label>
          <p id="attendance-id">{info?.selectedAttendance?._id || 'N/A'}</p>
        </div>

        <div className="flex gap-4">
          <Label htmlFor="student-name">Student Name :</Label>
          <p id="student-name">{info?.selectedAttendance?.student?.name || 'N/A'}</p>
        </div>

        <div className="grid grid-cols-3">
          <div className="flex gap-4">
            <Label htmlFor="class">Class :</Label>
            <p id="class">{info?.selectedAttendance?.class || 'N/A'}</p>
          </div>

          <div className=" flex gap-4 col-span-2">
            <Label htmlFor="date">Date :</Label>
            <p id="date">{moment(info?.selectedAttendance?.startDate).format('LLL') || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div>
        <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Select Subject
        </label>
        <select
          id="countries"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={selectSubjectHandler}
          value={info?.selectedSubject || ''}
        >
          <option selected value={''}>
            Choose a subject
          </option>
          {info?.selectedAttendance?.enrollment?.subjects?.map((singleSubject) => (
            <option value={singleSubject?.subjectId?._id}>{singleSubject?.subjectId?.name}</option>
          ))}
        </select>
      </div>

      {info?.selectedSubject &&
        (loading ? (
          <div className="flex justify-center items-center mt-4">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            fetching chapters...
          </div>
        ) : (
          <div className="mt-4">
            <label
              for="selectedChapter"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select Chapter
            </label>
            <select
              id="selectedChapter"
              name="selectedChapter"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={selectChapterHandler}
              value={info?.selectedChapter || ''}
            >
              <option selected value={''}>
                Choose a chapter
              </option>
              {publicSubjectDetail?.chapters?.map((singleChapter) => (
                <option value={singleChapter?._id}>{singleChapter?.title}</option>
              ))}
            </select>
          </div>
        ))}

      {info?.selectedChapter && (
        <div className="mt-4">
          <label
            for="selectedTopic"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Select Topic
          </label>
          <select
            id="selectedTopic"
            name="selectedTopic"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={selectChapterHandler}
            value={info?.selectedTopic || ''}
          >
            <option selected value={''}>
              Choose a topic
            </option>
            {publicSubjectDetail?.chapters
              ?.find((item) => item._id === info?.selectedChapter)
              ?.subChapters.map((singleTopic) => (
                <option value={singleTopic?._id}>{singleTopic?.title}</option>
              ))}
          </select>
        </div>
      )}

      {info?.selectedTopic && (
        <div className="mt-4">
          <label
            htmlFor="progressValue"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Progress Value
          </label>

          <div className="flex flex-1 gap-4">
            <Slider
              max={100}
              min={0}
              step={1}
              defaultValue={[info?.progressValue || 0]}
              name="progressValue"
              onValueChange={(e) => setInfo((prev) => ({ ...prev, progressValue: e[0] }))}
            />
            <p className="text-sm">{info?.progressValue || 0}%</p>
          </div>
        </div>
      )}

      {info?.selectedTopic && info?.progressValue > 0 && (
        <div className="mt-4 flex justify-center">
          <Button onClick={updateTheAttendanceHandler} disabled={info?.isSubmitting}>
            {info?.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                submitting...
              </>
            ) : info?.selectedAttendance?.isPresent ? (
              'Mark As Absent'
            ) : (
              'Mark As Present'
            )}
          </Button>
        </div>
      )}
    </ModalV1>
  );
};

export default MarkAttendanceModal;
