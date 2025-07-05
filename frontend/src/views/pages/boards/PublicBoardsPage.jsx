'use client';

import { memo, useCallback, useEffect } from 'react';
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
import { School, BookOpen } from 'lucide-react';
import Header from '@/views/components/navbar/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { useSelector, useDispatch } from 'react-redux';
import { boardActions } from '@/redux/combineActions';
import { useNavigate } from 'react-router-dom';
import MetaData from '@/utils/MetaData';

// Sample board data (you would replace this with your actual data)
const boardsData = [
  {
    _id: '680e038ba0e4b51180bd0c28',
    name: 'CBSE',
    description: 'Central Board of Secondary Education',
    createdAt: '2025-04-27T10:14:35.692Z',
    updatedAt: '2025-04-27T10:14:35.692Z',
    __v: 0,
  },
  {
    _id: '680e038ba0e4b51180bd0c29',
    name: 'ICSE',
    description: 'Indian Certificate of Secondary Education',
    createdAt: '2025-04-27T10:14:35.692Z',
    updatedAt: '2025-04-27T10:14:35.692Z',
    __v: 0,
  },
  {
    _id: '680e038ba0e4b51180bd0c32',
    name: 'MSBSHSE',
    description: 'Maharashtra State Board of Secondary and Higher Secondary Education',
    createdAt: '2025-04-27T10:14:35.692Z',
    updatedAt: '2025-04-27T10:14:35.692Z',
    __v: 0,
  },
  {
    _id: '680e038ba0e4b51180bd0c30',
    name: 'State Board',
    description: 'State Education Board',
    createdAt: '2025-04-27T10:14:35.692Z',
    updatedAt: '2025-04-27T10:14:35.692Z',
    __v: 0,
  },
];

const BoardCardSkeleton = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          className="board-card cursor-pointer transition-all duration-300 hover:shadow-lg 'ring-2 ring-primary"
        >
          <CardHeader className="pb-2 h-20">
            <div className="flex items-center space-x-2 mb-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-24" />
            </div>

            <CardDescription>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <Skeleton className="h-4 w-full" />
            </p>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-8 w-full rounded-md" />
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

const PublicBoardsPage = () => {
  const { getBoardsListAction } = boardActions;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, boardsList } = useSelector((state) => state.boardState);

  // GSAP animations
  useGSAP(() => {
    if (boardsList && boardsList.length > 0) {
      gsap.fromTo(
        '.board-card',
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
        }
      );
    }
  }, [boardsList]);

  useEffect(() => {
    if (!boardsList) {
      fetchBoardsListHandler();
    }
  }, []);

  const fetchBoardsListHandler = useCallback(async () => {
    dispatch(getBoardsListAction());
  }, [boardsList]);

  const navigateToSubjectsPage = useCallback((boardId) => {
    navigate('/subjects/' + boardId);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <MetaData title="Boards | AcademIQ" />
      <Header />
      <div className="container mx-auto py-8 max-w-screen-md px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Educational Boards</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <BoardCardSkeleton />
          ) : (
            boardsList?.map((board, index) => (
              <Card
                key={board?._id || index}
                className={`board-card cursor-pointer transition-all duration-300 hover:shadow-lg 'ring-2 ring-primary'
              }`}
              >
                <CardHeader className="pb-2 h-20">
                  <CardTitle className="flex items-center">
                    <School className="mr-2 h-5 w-5 text-primary capitalize" />
                    {board?.name}
                  </CardTitle>
                  <CardDescription className="max-h-20 overflow-hidden">
                    {board?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Select this board to view available subjects and classes.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => navigateToSubjectsPage(board?._id)}
                  >
                    Show Subjects
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(PublicBoardsPage);
