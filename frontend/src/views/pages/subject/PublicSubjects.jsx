import { memo, useEffect, useState, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, GraduationCap, Menu, School } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { subjectActions, boardActions } from '@/redux/combineActions';
import { Skeleton } from '@/components/ui/skeleton';
import _ from 'lodash';
import MetaData from '@/utils/MetaData';

// Generate class tabs (1-12)
const classTabs = Array.from({ length: 12 }, (_, i) => i + 1);

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

const PublicSubjectsPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { getPublicSubjectsListAction } = subjectActions;
  const { getBoardsListAction } = boardActions;
  const dispatch = useDispatch();
  const { publicSubjectsList } = useSelector((state) => state.subjectState);
  const { boardsList } = useSelector((state) => state.boardState);
  const isMobile = useIsMobile();
  const [info, setInfo] = useState({
    selectedClass: 1,
    drawerOpen: false,
    loading: false,
    boardTypeDetails: null,
  });

  // GSAP animations
  useGSAP(() => {
    // Animate class tabs
    gsap.fromTo(
      '.class-tab',
      {
        y: -20,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.03,
        duration: 0.4,
        ease: 'power1.out',
      }
    );

    // Animate subject cards
    animateSubjectCards();
  }, [info?.selectedClass]);

  // for not calling multiple times
  useEffect(() => {
    if (!boardsList) {
      fetchBoardsListHandler();
    }
    if (!publicSubjectsList || publicSubjectsList?.boardType !== boardId) {
      let query = {
        boardType: boardId,
      };
      fetchSubjectsListHandler(query);
    }
  }, []);

  useEffect(() => {
    if (boardsList) {
      let currentBoardType = _.find(boardsList, { _id: boardId });
      setInfo((prev) => ({ ...prev, boardTypeDetails: currentBoardType || null }));
    }
    if (publicSubjectsList && boardsList && publicSubjectsList?.boardType === boardId) {
      let classKey = _.keys(publicSubjectsList?.docs)?.[0] || 1;
      setInfo((prev) => ({
        ...prev,
        loading: false,
        selectedClass: Number(classKey),
      }));
    }
  }, [boardsList, publicSubjectsList]);

  const animateSubjectCards = () => {
    gsap.fromTo(
      '.subject-card',
      {
        scale: 0.9,
        opacity: 0,
        y: 20,
      },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.5,
        ease: 'back.out(1.2)',
      }
    );
  };

  const handleClassSelect = useCallback(
    (classNum) => {
      let updateOptions = {};
      updateOptions.selectedClass = classNum;
      if (isMobile) {
        updateOptions.drawerOpen = false;
      }

      setInfo((prev) => ({
        ...prev,
        ...updateOptions,
      }));
    },
    [info?.selectedClass, info?.drawerOpen]
  );

  const fetchSubjectsListHandler = useCallback(
    async (query) => {
      dispatch(getPublicSubjectsListAction(query));
    },
    [publicSubjectsList, info?.boardType]
  );

  const fetchBoardsListHandler = useCallback(async () => {
    dispatch(getBoardsListAction());
  }, [boardsList]);

  const redirectToChaptersFunction = useCallback((subjectId) => {
    navigate(subjectId);
  }, []);

  return (
    <div className="container mx-auto py-6 px-4">
      <MetaData title="Subjects | AcademIQ" />
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <School className="h-6 w-6 text-primary" />
            {info?.boardTypeDetails?.name} Classes
          </h1>
        </div>
        <Badge
          variant="outline"
          className="px-3 py-1 text-sm break-words whitespace-normal line-clamp-2 "
        >
          {info?.boardTypeDetails?.description}
        </Badge>
      </div>

      <div className="mb-6">
        {isMobile ? (
          <div className="flex items-center justify-between border rounded-md p-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="font-medium">Class {info?.selectedClass}</span>
            </div>
            <Drawer
              open={info?.drawerOpen}
              onOpenChange={(e) => setInfo((prev) => ({ ...prev, drawerOpen: e }))}
            >
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Menu className="h-4 w-4" />
                  Select Class
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Select Class</DrawerTitle>
                  <DrawerDescription>Choose a class to view its subjects</DrawerDescription>
                </DrawerHeader>
                <div className="grid grid-cols-3 gap-2 p-4">
                  {classTabs.map((classNum) => (
                    <DrawerClose key={classNum} asChild>
                      <Button
                        variant={info?.selectedClass === classNum ? 'default' : 'outline'}
                        className="w-full"
                        onClick={() => handleClassSelect(classNum)}
                      >
                        Class {classNum}
                      </Button>
                    </DrawerClose>
                  ))}
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        ) : (
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <div className="flex justify-center p-2">
              {classTabs.map((classNum) => (
                <Button
                  key={classNum}
                  variant={info?.selectedClass === classNum ? 'default' : 'ghost'}
                  className="class-tab mx-1 min-w-[90px]"
                  onClick={() => handleClassSelect(classNum)}
                >
                  Class {classNum}
                </Button>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Class {info?.selectedClass} Subjects
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Select a subject to view chapters and learning materials
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {info?.loading ? (
          <SubjectCardSkeleton />
        ) : publicSubjectsList?.docs?.[info?.selectedClass] &&
          publicSubjectsList.docs[info.selectedClass].length > 0 ? (
          publicSubjectsList.docs[info.selectedClass].map((subject, index) => (
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
              <CardFooter>
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
              There are no subjects available for this class at the moment.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default memo(PublicSubjectsPage);
