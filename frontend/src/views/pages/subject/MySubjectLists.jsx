import { memo, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { myDetailsActions } from '@/redux/combineActions';
import MainWrapper from '@/views/layouts/Mainwrapper';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText } from 'lucide-react';

const breadCrumbs = [{ label: 'My-Subjects', href: null }];

const SubjectCardSkeleton = () => {
  return Array.from({ length: 6 }).map((_, index) => (
    <div
      key={index}
      className="subject-card transition-all duration-300 hover:shadow-md rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div>
          <Skeleton className="h-4 w-3/4 mb-4" />
        </div>

        {/* Content */}
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Footer Button */}
        <div>
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </div>
    </div>
  ));
};
const MySubjectLists = () => {
  const dispatch = useDispatch();
  const { getMySubjectsListAction, loading } = myDetailsActions;
  const { profileDetails } = useSelector((state) => state.userProfileState);
  const { mySubjectList } = useSelector((state) => state.myDetailsState);

  useEffect(() => {
    if (!mySubjectList) {
      fetchSubjectsListHandler();
    }
  }, []);
  const fetchSubjectsListHandler = useCallback(async () => {
    let query = {
      classRoom: profileDetails?.class,
      boardType: profileDetails?.boardType?._id,
    };
    dispatch(getMySubjectsListAction(query));
  }, []);

  const redirectToChaptersFunction = useCallback(
    (subjectId) => {
      window.open(`/subjects/${profileDetails?.boardType}/${subjectId}`, '_blank');
    },
    [profileDetails?.boardType]
  );
  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {loading ? (
          <SubjectCardSkeleton />
        ) : mySubjectList?.length > 0 ? (
          mySubjectList?.map((subject, index) => (
            <Card
              key={subject?.id || index}
              className="subject-card cursor-pointer transition-all duration-300 hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {subject?.name}
                </CardTitle>
                <CardDescription>{subject?.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Multiple chapters available</span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button className="w-full" onClick={() => redirectToChaptersFunction(subject?._id)}>
                  View Chapters
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card className="col-span-full flex flex-col items-center justify-center text-center p-8 shadow-none border-none">
            <div className="rounded-full p-3 bg-primary/10 mb-4">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">No Subjects Found</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              There are no subjects available for your class at this moment.
            </p>
          </Card>
        )}
      </div>
    </MainWrapper>
  );
};

export default memo(MySubjectLists);
