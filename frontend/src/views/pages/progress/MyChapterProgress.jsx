import React, { useState, useEffect, useCallback, memo } from 'react';
import MainWrapper from '@/views/layouts/Mainwrapper';
import { useDispatch, useSelector } from 'react-redux';
import { subjectActions, studentActions, myDetailsActions } from '@/redux/combineActions';
import _ from 'lodash';
import ProgressUpdateComp, {
  ProgressSkeleton,
} from '@/views/components/enrollments/ProgressUpdateComp';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import MetaData from '@/utils/MetaData';
import ProgressViewComp from '@/views/components/enrollments/ProgressViewComp';

const breadCrumbs = [
  { label: 'My-Subjects', href: '/my-subjects' },
  { label: 'Enrollments', href: '/my-subjects/enrollments' },
  { label: 'Chapter Progress', href: null },
];

const ProgressUpdate = () => {
  const dispatch = useDispatch();
  const { enrollmentId, subjectId } = useParams();
  const { getPublicSubjectDetailAction } = subjectActions;
  const { getMyEnrollmentsListAction } = myDetailsActions;
  const { publicSubjectDetail } = useSelector((state) => state.subjectState);
  const { myEnrollmentList } = useSelector((state) => state.myDetailsState);

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
    if (!myEnrollmentList) {
      fetchEnrollmentsList();
    }
  }, []);

  useEffect(() => {
    if (publicSubjectDetail && publicSubjectDetail?._id === subjectId && myEnrollmentList) {
      const enrollmentDetails = _.find(myEnrollmentList, { _id: enrollmentId });
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
  }, [publicSubjectDetail, myEnrollmentList]);

  const fetchSubjectDetailsHandler = useCallback(() => {
    dispatch(getPublicSubjectDetailAction(subjectId));
  }, [publicSubjectDetail, subjectId]);

  const fetchEnrollmentsList = useCallback(() => {
    dispatch(getMyEnrollmentsListAction());
  }, [myEnrollmentList]);

  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <MetaData title="Chapter Progress  | AcademIQ" />
      {info?.loading ? (
        <ProgressSkeleton />
      ) : (
        <div className="max-w-[78vw]">
          <ProgressViewComp
            publicSubjectDetail={publicSubjectDetail}
            info={info}
            sliderProgress={info?.sliderProgress}
          />
        </div>
      )}
    </MainWrapper>
  );
};

export default memo(ProgressUpdate);
