import React, { useState, useEffect, useCallback, memo } from 'react';
import MainWrapper from '@/views/layouts/Mainwrapper';
import { useDispatch, useSelector } from 'react-redux';
import { subjectActions, studentActions } from '@/redux/combineActions';
import _ from 'lodash';
import ProgressUpdateComp, {
  ProgressSkeleton,
} from '@/views/components/enrollments/ProgressUpdateComp';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import MetaData from '@/utils/MetaData';
import ProgressViewComp from '@/views/components/enrollments/ProgressViewComp';

const ProgressUpdate = ({ isEdit = true }) => {
  const dispatch = useDispatch();
  const { studentId, enrollmentId, subjectId } = useParams();
  const { getPublicSubjectDetailAction, updateSubjectStateAction } = subjectActions;
  const { getStudentEnrollmentListAction, updateStudentProgressAction } = studentActions;
  const { publicSubjectDetail } = useSelector((state) => state.subjectState);
  const { enrollmentsList } = useSelector((state) => state.studentState);

  const [info, setInfo] = useState({
    loading: true,
    enrollmentDetails: null,
    enrollmentSubject: null,
    sliderProgress: {},
    isChanged: false,
    isSubmitting: false,
  });

  useEffect(() => {
    if (!publicSubjectDetail || publicSubjectDetail?._id !== subjectId) {
      fetchSubjectDetailsHandler();
    }

    if (!enrollmentsList || enrollmentsList?._id !== studentId) {
      fetchStudentEnrollmentListHandler();
    }
  }, []);

  useEffect(() => {
    if (
      publicSubjectDetail &&
      publicSubjectDetail?._id === subjectId &&
      enrollmentsList &&
      enrollmentsList?._id === studentId
    ) {
      const enrollmentDetails = _.find(enrollmentsList?.docs, { _id: enrollmentId });
      const enrollmentSubject = _.find(
        enrollmentDetails?.subjects,
        (item) => item?.subjectId?._id === subjectId
      );

      const sliderProgress = _.keyBy(
        enrollmentSubject?.chapters?.map((ch) => ({
          ...ch,
          subChapters: _.keyBy(ch.subChapters, '_id'),
        })),
        '_id'
      );

      setInfo((prev) => ({
        ...prev,
        loading: false,
        enrollmentDetails,
        enrollmentSubject,
        sliderProgress,
      }));
    }
  }, [publicSubjectDetail, enrollmentsList]);

  const fetchSubjectDetailsHandler = useCallback(() => {
    dispatch(getPublicSubjectDetailAction(subjectId));
  }, [publicSubjectDetail, subjectId]);

  const fetchStudentEnrollmentListHandler = useCallback(async () => {
    dispatch(getStudentEnrollmentListAction(studentId));
  }, [enrollmentsList, studentId]);

  const changeSliderHandlerFunction = (value, subChapterId, chapterId) => {
    setInfo((prev) => {
      let updateState = _.cloneDeep(prev?.sliderProgress);
      let isHavingCurrentChapter = _.has(updateState || {}, chapterId);
      let isHavingCurrentSubChapter = _.has(
        updateState?.[chapterId]?.subChapters || {},
        subChapterId
      );

      let chapterPercentage = 0;
      if (isHavingCurrentChapter && isHavingCurrentSubChapter) {
        updateState[chapterId]['subChapters'][subChapterId]['topicProgress'] = value;
      } else if (isHavingCurrentChapter) {
        updateState[chapterId]['subChapters'][subChapterId] = {
          _id: subChapterId,
          topicProgress: value,
        };
      } else {
        let subChapters = {};
        subChapters[subChapterId] = {
          _id: subChapterId,
          topicProgress: value,
        };

        updateState[chapterId] = {
          _id: chapterId,
          subChapters,
          progress: value,
        };
      }

      let subChapterValues = _.values(updateState[chapterId]?.subChapters || {});
      const percentages = _.map(subChapterValues, 'topicProgress');
      const overallPercentage = percentages.length ? _.sum(percentages) / percentages.length : 0;
      updateState[chapterId].progress = overallPercentage;

      return { ...prev, sliderProgress: updateState };
    });
  };

  const updateStudentProgressHandler = async () => {
    if (info?.isSubmitting) return;
    setInfo((prev) => ({
      ...prev,
      isSubmitting: true,
    }));
    const chaptersArray = _.values(info?.sliderProgress).map((ch) => ({
      ...ch,
      subChapters: _.values(ch.subChapters),
    }));

    let json = {
      chapters: chaptersArray,
    };

    let response = await updateStudentProgressAction(enrollmentId, subjectId, json);
    if (response[0] === true) {
      toast.success('successfully updated');
      let newUpdateList = _.cloneDeep(enrollmentsList);
      for (let i = 0; i < (newUpdateList?.docs?.length || 0); i++) {
        if (newUpdateList.docs[i]?._id === response[1]?.data?._id) {
          newUpdateList.docs[i] = response[1]?.data;
        }
      }

      dispatch(updateSubjectStateAction({ enrollmentsList: newUpdateList }));
    } else {
      toast.error(response[1]?.message || 'failed to update the student  progress');
    }

    setInfo((prev) => ({
      ...prev,
      isSubmitting: false,
    }));
  };

  return (
    <MainWrapper
      breadCrumbs={[
        { label: 'students', href: '/admin/students' },
        { label: 'Student Details', href: `/admin/student-details/${studentId}/student-profile` },
        {
          label: 'Student Enrollments',
          href: `/admin/student-details/${studentId}/student-enrollments`,
        },
      ]}
    >
      <MetaData title="Admin Progress Update | AcademIQ" />
      {info?.loading ? (
        <ProgressSkeleton />
      ) : isEdit ? (
        <ProgressUpdateComp
          publicSubjectDetail={publicSubjectDetail}
          changeSliderHandlerFunction={changeSliderHandlerFunction}
          info={info}
          sliderProgress={info?.sliderProgress}
          updateStudentProgressHandler={updateStudentProgressHandler}
        />
      ) : (
        <ProgressViewComp
          publicSubjectDetail={publicSubjectDetail}
          info={info}
          sliderProgress={info?.sliderProgress}
        />
      )}
    </MainWrapper>
  );
};

export default memo(ProgressUpdate);
